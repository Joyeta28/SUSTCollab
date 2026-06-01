const bcrypt = require("bcryptjs")
const db = require("../config/db")
const jwt = require("jsonwebtoken")

exports.register = (req, res) => {
    const {
        full_name,
        email,
        dept,
        regi_num,
        password
    } = req.body

    db.query(
        `SELECT * 
        FROM users
        WHERE email = ?`,[email],
        async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                })
            }
            if (result.length > 0) {
                return res.json({
                    message: "Email already registered"
                })
            }
            const hashedPassword =
                await bcrypt.hash(password, 10)

            db.query(
                `INSERT INTO users (full_name, email, dept, regi_num, password, role) VALUES (?, ?, ?, ?, ?, "student")`,
                [   full_name,
                    email,
                    dept,
                    regi_num,
                    hashedPassword
                ],
                (err) => {
                    if (err) {
                        console.log(err)

                        return res.status(500).json({
                            message: "Registration failed"
                        })
                    }
                    res.json({
                        message: "Registration Successful"
                    })
                }
            )
        }
    )
}

exports.login = (req, res) => {
    const { email, password } = req.body
    db.query(
        `SELECT * 
        FROM users 
        WHERE email = ?`, [email], async (err, result) => {
            if (result.length === 0) {
                return res.json({
                    message: "User not found"
                })
            }
            const user = result[0]

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                return res.json({
                    message: "Wrong password"
                })
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )
            res.json({
                message: "Login Successful",
                token: token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            })
        }
    )
}