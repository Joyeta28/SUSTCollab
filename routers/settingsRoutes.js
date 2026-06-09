const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { changePassword, getSettings, updateSettings } = require("../controllers/settingsController");

router.put("/change-password", verifyToken, changePassword);

router.get("/", verifyToken, getSettings);
router.put("/", verifyToken, updateSettings);

module.exports = router;