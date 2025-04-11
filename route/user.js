const express = require("express");
const {
  signUp,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  // type,
} = require("../controller/user");
const router = express.Router();

router.post("/user/signup", signUp);
router.post("/user/login", login);
router.post("/user/verifyOtp", verifyOtp);
router.post("/user/resendOtp", resendOtp);
router.post("/user/forgetPassword", forgetPassword);
router.post("/user/resetPassword", resetPassword);
// router.post("/user/type",type)

module.exports = router;
