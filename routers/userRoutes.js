const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getLoggedUser } = require("../controllers/userController");

router.get("/", verifyToken, getLoggedUser);

module.exports = router;