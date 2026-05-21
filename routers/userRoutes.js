const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getLoggedUser,updateProfile } = require("../controllers/userController");

router.get("/profile", verifyToken, getLoggedUser);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;