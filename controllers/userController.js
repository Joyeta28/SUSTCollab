const db = require("../config/db");

exports.getLoggedUser = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT id, full_name, email, bio, skills,dept,regi_num
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: result[0] });
    });
};


exports.updateProfile = (req, res) => {

    const userId = req.user.id;

    const {full_name,bio,dept,regi_num,skills} = req.body;

    const sql = `
        UPDATE users
        SET full_name = ?, bio = ?, skills = ?
        WHERE id = ?
    `;

    db.query(sql,
        [full_name, bio, skills, userId],
        (err) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Profile updated successfully" });
        }
    );
};

exports.deleteAccount = (req, res) => {

    const userId = req.user.id;

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [userId], (err) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Account deleted successfully"
        });
    });
};




exports.getAllUsers = (req, res) => {
    const sql = `SELECT id, full_name, email, bio, dept, regi_num, role 
                 FROM users`;
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({message: "Database error"});
        }

        res.json(results);
    });
};





exports.getUserDetails = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT id,
               full_name,
               email,
               bio,
               dept,
               regi_num,
               skills
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result[0]);
    });
};






exports.deleteUser = async(req, res) => {
    const user_id = req.params.id;

    const sql = `DELETE FROM users
                WHERE id = ?`;

    db.query(sql, [user_id], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({message : "Database Error!"});
        }

        res.status(200).json(result);
    });
}