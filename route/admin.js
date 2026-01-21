const express = require("express");
const adminController = require("../controller/admin");
// const userAuth = require("../middleware/auth")

const router = express.Router();

router.post("/admin/signUpAdmin", adminController.signUpAdmin);
router.post("/admin/loginAdmin", adminController.loginAdmin);
router.post("/admin/resendAdminOtp", adminController.resendAdminOtp);
router.post("/admin/resetAdminPassword", adminController.resetAdminPassword);
router.post("/admin/resetAdminEmail", adminController.resetAdminEmail);
router.post("/admin/verifyAdminOtp", adminController.verifyAdminOtp);
router.post("/admin/forgetAdminPassword", adminController.forgetAdminPassword);

module.exports = router;
