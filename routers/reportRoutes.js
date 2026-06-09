const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { submitReport, getAllReports, getReportDetails, updateReportStatus } = require("../controllers/reportController");

router.post("/submit", verifyToken, submitReport);
router.get("/", verifyToken, getAllReports);
router.get("/:id", verifyToken, getReportDetails);
router.put("/:id", verifyToken, updateReportStatus);

module.exports = router;