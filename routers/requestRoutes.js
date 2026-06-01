const express = require("express")
const router = express.Router()


const verifyToken = require("../middleware/authMiddleware")
const {sendRequest, getMyRequests,acceptRequest, getSentRequests } = require("../controllers/requestController")

router.post("/send", verifyToken, sendRequest)
router.get("/my-requests", verifyToken, getMyRequests);
router.put("/accept/:id", verifyToken, acceptRequest);
router.get("/sent", verifyToken, getSentRequests);

module.exports = router;