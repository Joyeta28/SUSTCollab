const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getLoggedUser,updateProfile,deleteAccount, getAllUsers, getUserDetails } = require("../controllers/userController");

router.get("/profile", verifyToken, getLoggedUser);
router.put("/profile", verifyToken, updateProfile);
router.delete("/delete", verifyToken, deleteAccount);
router.get("/users", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserDetails);

module.exports = router;