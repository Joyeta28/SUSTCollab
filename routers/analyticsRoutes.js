const express = require("express")

const router = express.Router()

const verifyToken = require("../middleware/authMiddleware");
const {getTotalRequestsSent,getTotalAcceptedRequests, getUserPostCount} = require("../controllers/analyticsController")


router.get("/analytics/total-sent", verifyToken, getTotalRequestsSent);

router.get( "/analytics/total-accepted",verifyToken, getTotalAcceptedRequests);

router.get("/postCount", verifyToken, getUserPostCount);


module.exports= router;