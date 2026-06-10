const express = require("express")

const router = express.Router()

const verifyToken = require("../middleware/authMiddleware");
const {getTotalRequestsSent,getTotalAcceptedRequests, getUserPostCount,getPostsPerDay, getRequestAcceptanceRate, getRequestsPerDay} = require("../controllers/analyticsController")


router.get("/total-sent", verifyToken, getTotalRequestsSent);

router.get("/postCount", verifyToken, getUserPostCount);

router.get( "/total-accepted",verifyToken, getTotalAcceptedRequests);

router.get("/posts-per-day", verifyToken, getPostsPerDay);

router.get("/acceptance-rate", verifyToken, getRequestAcceptanceRate);

router.get("/rq-per-day", verifyToken, getRequestsPerDay);

module.exports = router;

