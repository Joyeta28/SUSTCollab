const db = require("../config/db");

exports.createPost = async (req, res) => {
    try {
        const {title, description, category, required_skills, team_size, course_title, semester} = req.body;
        const user_id = req.user.id;

        const post_code = generatePostCode();

        const sql = `
            INSERT INTO posts
            (user_id, title, description, category, required_skills, team_size, course_title, semester, post_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.execute(sql, [user_id, title, description, category, required_skills, team_size, course_title, semester, post_code]);

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


exports.getPostDetails = async(req, res) => {
    try{
        const post_id = req.params.id;

        const sql = `SELECT posts.*, users.full_name
                    FROM posts
                    JOIN users ON posts.user_id = users.id
                    WHERE posts.id = ?`;
        
        db.query(sql, [post_id], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }
            res.status(200).json(results[0]);
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}


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




exports.getPostsByUser = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT posts.*, users.full_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};



exports.changeStatus = async(req, res) =>{
    const post_id = req.params.id;
    const {status} = req.body;

    if(!status){
        return res.status(400).json({message: "Status Required!"});
    }

    const sql = `UPDATE posts SET status = ? WHERE id = ?`;
    db.query(sql, [status, post_id], (err, result) => {
        if (err){
            console.log(err);
            return res.status(500).json({message : "Database Error!"});
        }

        res.json({message : "Status Changed", updatedStatus: status});
    });
}

function generatePostCode() {
    const prefix = "SC";
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return prefix + randomNum; 
}

exports.deletePost = async(req, res) => {
    const post_id = req.params.id;

    const sql = `DELETE FROM posts
                WHERE id = ?`;

    db.query(sql, [post_id], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({message : "Database Error!"});
        }

        res.status(200).json(result);
    });
}