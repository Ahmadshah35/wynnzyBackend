const express = require("express");
const userController = require("../controller/user");
const multer = require("multer");
const router = express.Router();


const userStorage = multer.diskStorage({
  destination: "./public/bProfile",
  filename: (req, file, cb) => {
    cb(null,Date.now() + "-" + file.originalname)
  },
});

const userUpload = multer({
  storage: userStorage
});

router.post("/user/signup", userController.signUp);
router.post("/user/login", userController.login);
router.get("/user/getUser", userController.userProfile);
router.post("/user/updateUser", userUpload.single("Image"), userController.updateUser);
router.post("/user/resetPassword", userController.resetPassword);
router.post("/user/forgetPassword", userController.forgetPassword);
router.post("/user/verifyPasswordOTP", userController.verifyPasswordOTP);
router.post("/user/deleteUser", userController.deleteUser);

module.exports = router;
