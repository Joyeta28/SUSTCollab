const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.changePassword = (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New password and confirm password do not match"
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    const sql = `
        SELECT password
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], async (err, result) => {
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

        const matched = await bcrypt.compare(currentPassword, result[0].password);

        if (!matched) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateSql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;

        db.query(updateSql, [hashedPassword, userId], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Password changed successfully"
            });
        });
    });
};


exports.getSettings = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT request_notifications, project_notifications, report_notifications
        FROM user_settings
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            const insertSql = `
                INSERT INTO user_settings
                (user_id, request_notifications, project_notifications, report_notifications)
                VALUES (?, 1, 1, 1)
            `;

            db.query(insertSql, [userId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                return res.json({
                    request_notifications: 1,
                    project_notifications: 1,
                    report_notifications: 1
                });
            });

            return;
        }

        res.json(result[0]);
    });
};

exports.updateSettings = (req, res) => {
    const userId = req.user.id;

    const {
        request_notifications,
        project_notifications,
        report_notifications
    } = req.body;

    const sql = `
        INSERT INTO user_settings
        (user_id, request_notifications, project_notifications, report_notifications)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            request_notifications = VALUES(request_notifications),
            project_notifications = VALUES(project_notifications),
            report_notifications = VALUES(report_notifications)
    `;

    db.query(
        sql,
        [
            userId,
            request_notifications ? 1 : 0,
            project_notifications ? 1 : 0,
            report_notifications ? 1 : 0
        ],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Settings updated successfully"
            });
        }
    );
};