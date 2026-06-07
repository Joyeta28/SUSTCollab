const db = require("../config/db");

exports.submitReport = (req, res) => {
    const reporter_id = req.user.id;
    const { reported_user_id, reason, description } = req.body;

    if (!reported_user_id || !reason || !description) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (Number(reporter_id) === Number(reported_user_id)) {
        return res.json({
            message: "You cannot report yourself"
        });
    }

    const checkUserSql = `
        SELECT id
        FROM users
        WHERE id = ?
    `;

    db.query(checkUserSql, [reported_user_id], (err, userResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (userResult.length === 0) {
            return res.status(404).json({
                message: "Reported user not found"
            });
        }

        const sql = `
            INSERT INTO reports
            (reporter_id, reported_user_id, reason, description)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [reporter_id, reported_user_id, reason, description], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Report submitted successfully"
            });
        });
    });
};