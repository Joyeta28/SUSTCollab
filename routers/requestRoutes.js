const express = require("express")
const router = express.Router()


const verifyToken = require("../middleware/authMiddleware")
const {sendRequest, getMyRequests,acceptRequest } = require("../controllers/requestController")

router.post("/send", verifyToken, sendRequest)
router.get("/my-requests", verifyToken, getMyRequests);
router.put("/accept/:id", verifyToken, acceptRequest);

module.exports = router;