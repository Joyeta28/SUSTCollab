const express = require("express")

const router = express.Router()

const verifyToken = require("../middleware/authMiddleware");
const {getTotalRequestsSent,getTotalAcceptedRequests} = require("../controllers/requestsCountController")


router.get("/analytics/total-sent", verifyToken, getTotalRequestsSent);

router.get( "/analytics/total-accepted",verifyToken, getTotalAcceptedRequests);