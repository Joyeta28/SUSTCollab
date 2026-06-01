const db = require("../config/db");

exports.sendRequest = (req, res) => {
    const sender_id = req.user.id;
    const { post_id } = req.body;
    const getPostSql = `
        SELECT user_id
        FROM posts
        WHERE id = ?
        `;
    db.query(getPostSql, [post_id], (err, postResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }
        if (postResult.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        const receiver_id = postResult[0].user_id;

        if (sender_id === receiver_id) {
            return res.json({
                message: "You cannot request your own post"
            });
        }

        const sql = `
            SELECT *
            FROM requests
            WHERE sender_id = ?
            AND post_id = ?
        `;

        db.query(sql,[sender_id, post_id], (err, result) => {
                if (result.length > 0) {
                    return res.json({
                        message: "Request already sent"
                    });
                }
                const sql = `
                    INSERT INTO requests
                    (post_id, sender_id, receiver_id, status)
                    VALUES (?, ?, ?, ?)
                `;

                db.query( sql, [post_id, sender_id, receiver_id, "Pending"], (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: "Database error"
                            });
                        }
                        res.json({
                            message: "Request sent successfully"
                        });
                    }
                );
            }
        );
    });
};

exports.getMyRequests = (req, res) => {
    const receiver_id = req.user.id;
    const sql = `SELECT
            requests.id,
            requests.status,
            posts.post_code,
            users.full_name,
            users.id AS user_id
        FROM requests
        JOIN posts
        ON requests.post_id = posts.id
        JOIN users
        ON requests.sender_id = users.id
        WHERE requests.receiver_id = ?`;

    db.query(sql, [receiver_id], (err, results) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Database error"
            });
        }
        res.json(results);
    });
};

exports.acceptRequest = (req, res) => {
    const request_id = req.params.id;
    const sql = `
        UPDATE requests
        SET status = 'Accepted'
        WHERE id = ?`;

    db.query(sql, [request_id], (err) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Database error"
            });
        }
        res.json({
            message:"Request Accepted"
        });
    });
};

exports.getSentRequests = (req, res) => {

    const sender_id = req.user.id;

    const sql = `
        SELECT
            requests.id,
            requests.status,
            posts.title,
            posts.post_code,
            users.full_name AS owner_name

        FROM requests

        JOIN posts
        ON requests.post_id = posts.id

        JOIN users
        ON posts.user_id = users.id

        WHERE requests.sender_id = ?

        ORDER BY requests.id DESC
    `;

    db.query(sql, [sender_id], (err, results) => {

        if(err){
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};