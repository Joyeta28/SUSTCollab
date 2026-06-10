const express = require("express")

const router = express.Router()

const verifyToken = require("../middleware/authMiddleware");
const {getTotalRequestsSent,getTotalAcceptedRequests, getUserPostCount,getPostsPerDay, getRequestAcceptanceRate} = require("../controllers/analyticsController")


router.get("/total-sent", verifyToken, getTotalRequestsSent);

router.get("/postCount", verifyToken, getUserPostCount);

router.get( "/total-accepted",verifyToken, getTotalAcceptedRequests);

router.get("/posts-per-day", verifyToken, getPostsPerDay);

router.get("/acceptance-rate", verifyToken, getRequestAcceptanceRate);

module.exports = router;

