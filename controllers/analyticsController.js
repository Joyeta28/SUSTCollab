const db = require("../config/db")

exports.getTotalRequestsSent = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT COUNT(*) AS total_sent
        FROM requests
        WHERE sender_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            total_sent: result[0].total_sent
        });
    });
};

exports.getTotalAcceptedRequests = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT COUNT(*) AS total_accepted
        FROM requests
        WHERE sender_id = ?
        AND status = 'Accepted'
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            total_accepted: result[0].total_accepted
        });
    });
};



exports.getUserPostCount = async (req, res) => {
    const user_id = req.user.id;
    const sql = `SELECT COUNT(*) AS totalPosts
                FROM posts
                WHERE user_id = ?`;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.status(200).json({
            totalPosts: result[0].totalPosts
        });
    });
};


exports.getPostsPerDay = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT
            DATE(created_at) AS post_date,
            COUNT(*) AS total_posts
        FROM posts
        WHERE user_id = ?
        GROUP BY DATE(created_at)
        ORDER BY post_date ASC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};