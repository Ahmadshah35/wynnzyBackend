const express = require("express");
const otpController = require("../controller/otp");
const router = express.Router();

router.post("/user/verifyOtp", otpController.verifyOtp);
router.post("/user/resendOtp", otpController.resendOtp);

module.exports = router
