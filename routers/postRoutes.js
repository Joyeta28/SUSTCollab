const express = require("express");
const router = express.Router();

const {createPost, getAllPosts, getMyPosts, getPostDetails, changeStatus, deletePost, getPostsByUser} = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createPost);
router.get("/", getAllPosts);
router.get("/my-posts",auth, getMyPosts);
router.get("/user/:id", getPostsByUser);
router.get("/:id", getPostDetails);
router.put("/:id/status", auth, changeStatus);
router.delete("/:id", auth, deletePost);


module.exports = router;