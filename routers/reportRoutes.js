const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { submitReport } = require("../controllers/reportController");

router.post("/submit", verifyToken, submitReport);

module.exports = router;