const bcrypt = require("bcryptjs")
const db = require("../config/db")

exports.register = (req,res)=>{
    const{full_name,email,password} = req.body
    db.query(
        "SELECT * From users where email = ?",[email], async(err,result)=>{
            if(result.length>0){
                return res.json({
                    message : "Email already registered"
                })
            }
            const hashedPassword = await bcrypt.hash(password,10)

            db.query(
                "INSERT INTO users(full_name,email,password) VALUES(?,?,?)",[full_name,email,hashedPassword],
                (err)=>{
                    if(err){
                        return res.json(err)
                    }
                    res.json({
                        message :"Registration Successful"
                    })
                }
            )
        }
    )
}

exports.login = (req,res)=>{
    const {email,password} = req.body
    db.query(
        "SELECT * FROM users WHERE email = ?",[email],async (err,result)=>{
            if(result.length === 0){
                return res.json({
                    message : "User not found"
                })
            }
            const user = result[0]

            const match = await bcrypt.compare(password,user.password)

            if(!match){
                return res.json({
                    message : "Wrong password"
                })
            }
            res.json({
                message : "Login Successful"
            })
        }
    )
}