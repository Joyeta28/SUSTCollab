const express = require("express");
const router = express.Router();

const {createPost, getAllPosts, getMyPosts, getPostDetails, changeStatus} = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createPost);
router.get("/", getAllPosts);
router.get("/my-posts",auth, getMyPosts);
router.get("/:id", getPostDetails);
router.put("/:id/status", auth, changeStatus);

module.exports = router;