const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getLoggedUser,updateProfile,deleteAccount, searchUsers } = require("../controllers/userController");

router.get("/profile", verifyToken, getLoggedUser);
router.put("/profile", verifyToken, updateProfile);
router.delete("/delete", verifyToken, deleteAccount);
router.get("/search", verifyToken, searchUsers);

module.exports = router;