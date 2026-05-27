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



exports.getAllPosts = async (req, res) => {
    try{
        const sql = `SELECT posts.*, users.full_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC`;

         db.query(sql, (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }
            res.status(200).json(results);
        });

    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


exports.getMyPosts = async (req, res) => {
    try{
        const user_id = req.user.id;

        const sql = `
        SELECT posts.*, users.full_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC
        `;

        db.query(sql,[user_id], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }
            res.status(200).json(results);
        });

    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};