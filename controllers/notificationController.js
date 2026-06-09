const db = require("../config/db");

exports.getMyNotifications = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT notifications.*, users.full_name AS sender_name
        FROM notifications
        LEFT JOIN users ON notifications.sender_id = users.id
        WHERE notifications.user_id = ?
        ORDER BY notifications.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

exports.markAsRead = (req, res) => {
    const userId = req.user.id;

    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Notifications marked as read" });
    });
};