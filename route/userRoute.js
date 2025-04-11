// const express = require("express");
// const app = express();
// const { signUp, verify, login, type, forgetPassword, resetPassword } = require("../controller/user");
// const userAuth = require("../middleware/auth");
// const {
//   createPet,
//   upadatePet,
//   deletePet,
//   getAllPets,
//   getPet,
// } = require("../controller/pet");
// const router = express.Router();
// const multer = require("multer");
// const { uploadImage } = require("../functions/user");
// const { createManager, upadateManager, deleteManager, getManager } = require("../controller/manager");
// const { createBProfile, updateBProfile, deleteBProfile, getBProfile } = require("../controller/bProfile");

// // const { upload3Image } = require("../functions/pet");

// const userStorage = multer.diskStorage({
//   destination: "userPics",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const userUpload = multer({
//   storage: userStorage,
// });

// // //petStorage
// // const petStorage = multer.diskStorage({
// //   destination: "petPics",
// //   filename: (req, file, cb) => {
// //     cb(null, file.originalname);
// //   },
// // });

// // const petUpload = multer({
// //   storage: petStorage,
// // });

// // //managerStorage
// // const managerStorage = multer.diskStorage({
// //   destination: "managerP",
// //   filename: (req, file, cb) => {
// //     cb(null, file.originalname);
// //   },
// // });
 
// // const managerUpload = multer({
// //   storage: managerStorage,
// // });

// // const bProfileStorage = multer.diskStorage({
// //   destination: "bProfile",
// //   filename: (req, file, cb) => {
// //     cb(null, file.originalname);
// //   },
// // });
 
// // const bProfileUpload = multer({
// //   storage: bProfileStorage,
// // });

// router.post("/signup", signUp);
// router.post("/verify", userAuth, verify);
// router.post("/login", login);
// router.post("/type", type);
// router.post("/image", userUpload.single("image"), uploadImage);
// router.post("/forgetPassword",forgetPassword)
// router.post("/resetPassword",resetPassword)

// //pets routes
// // router.post("/createPet", petUpload.array("images", 3), createPet);
// // // router.post("/images", petUpload.array("images", 3), upload3Image);
// // router.post("/updatePet",petUpload.array("images", 3), upadatePet);
// // router.post("/deletePet", deletePet);
// // router.get("/getAllPets", getAllPets);
// // router.get("/getPet", getPet);

// // manager profile
// // router.post("/createManager",managerUpload.single("image"),createManager)
// // router.post("/updateManager",managerUpload.single("image"),upadateManager)
// // router.post("/deleteManager",deleteManager)
// // router.get("/getManager",getManager)
 
// // bussinessProfile
// // router.post("/createBProfile",bProfileUpload.array("images"),createBProfile)
// // router.post("/updateBProfile",bProfileUpload.array("images"),updateBProfile)
// // router.post("/deleteBProfile",deleteBProfile)
// // router.get("/getBProfile",getBProfile)


// module.exports = router;
