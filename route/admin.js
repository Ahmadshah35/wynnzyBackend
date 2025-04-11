const express=require("express")
const { signUpAdmin, loginAdmin, resendAdminOtp, resetAdminPassword, resetAdminEmail, verifyAdminOtp, forgetAdminPassword } = require("../controller/admin")
// const userAuth = require("../middleware/auth")

const router=express.Router()

router.post("/admin/signUpAdmin",signUpAdmin)
router.post("/admin/loginAdmin",loginAdmin)
router.post("/admin/resendAdminOtp",resendAdminOtp)
router.post("/admin/resetAdminPassword",resetAdminPassword)
router.post("/admin/resetAdminEmail",resetAdminEmail)
router.post("/admin/verifyAdminOtp",verifyAdminOtp)
router.post("/admin/forgetAdminPassword",forgetAdminPassword)


module.exports=router