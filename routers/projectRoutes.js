const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {createProject, getMyProjects} = require("../controllers/projectController");

router.post("/create", verifyToken, createProject);

router.get("/my-projects", verifyToken, getMyProjects);

module.exports = router;