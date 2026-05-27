const express = require("express");
const router = express.Router();

const {createPost, getAllPosts, getMyPosts} = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createPost);
router.get("/", getAllPosts);
router.get("/my-posts",auth, getMyPosts);

module.exports = router;