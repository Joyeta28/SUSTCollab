const db = require("../config/db");

exports.getLoggedUser = (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT id, full_name, email FROM users WHERE id = ?", [userId], (err, result) => {

            if (err) 
                return res.status(500).json({message: "Database error"});
            
            if (result.length === 0) 
                return res.status(404).json({message: "User not found"});
            
            res.json({
                user: result[0]
            });
        }
    );
};