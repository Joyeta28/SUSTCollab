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






exports.getAllReports = (req,res)=>{
    const sql = `SELECT
                reports.id, reports.reason, reports.status, reports.created_at,
                reporter.full_name AS reporter_name,
                reported.full_name AS reported_user_name,
                reported.id AS reported_user_id

                FROM reports
                JOIN users AS reporter ON reports.reporter_id = reporter.id
                JOIN users AS reported ON reports.reported_user_id = reported.id

                ORDER BY reports.created_at DESC`;

    db.query(sql,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"Database Error"});
        }
        res.json(results);
    });

};



exports.getReportDetails = (req,res)=>{
    const reportId = req.params.id;

    const sql = `SELECT reports.*,
                reporter.full_name AS reporter_name,
                reported.full_name AS reported_user_name
                FROM reports
                JOIN users reporter ON reports.reporter_id = reporter.id
                JOIN users reported ON reports.reported_user_id = reported.id
                WHERE reports.id = ?`;

    db.query(sql,[reportId],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"Database error"});
        }
        res.json(result[0]);

    });

};



exports.updateReportStatus = (req, res)=>{
    const reportId = req.params.id;
    const {status} = req.body;

    const sql = `UPDATE reports
                SET status = ?
                WHERE id = ?`;

    db.query(sql, [status, reportId], (err)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"Database error!"});
        }
        res.json({message: "Status updated"});
    });
};