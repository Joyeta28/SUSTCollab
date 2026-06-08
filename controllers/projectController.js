const db = require("../config/db");

exports.createProject = (req, res) => {
    const user_id = req.user.id;
    const {
        title,
        description,
        tech_stack,
        github_link
    } = req.body;

    const sql = `
        INSERT INTO projects
        (user_id, title, description, tech_stack, github_link)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            title,
            description,
            tech_stack,
            github_link
        ],
        (err) => {

            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Project added successfully"
            });
        }
    );
};



exports.getMyProjects = (req, res) => {
    const user_id = req.user.id;
    const sql = `
        SELECT *
        FROM projects
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id], (err, results) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};