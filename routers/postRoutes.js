const express = require("express");
const router = express.Router();

const {createPost} = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createPost);

module.exports = router;