const db = require("../config/db");

exports.createPost = async (req, res) => {
    try {
        const {title, description, category, required_skills, team_size, course_title, semester} = req.body;

        const user_id = req.user.id;

        const sql = `
            INSERT INTO posts
            (user_id, title, description, category, required_skills, team_size, course_title, semester)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.execute(sql, [user_id, title, description, category, required_skills, team_size, course_title, semester]);

        res.status(201).json({
            message: "Post created successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};