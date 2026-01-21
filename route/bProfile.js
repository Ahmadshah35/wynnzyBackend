const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bProfileController = require("../controller/bProfile");

const imagePath = path.join(__dirname, "../public/bProfile")
const documentPath = path.join(__dirname, "../public/bProfile");

[imagePath, documentPath].forEach(dir =>{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true});
    }
});

const bProfileStorage = multer.diskStorage({
  // destination: "./public/bProfile",
   destination: function(req, file, cb){
        if(file.mimetype.startsWith("image/")){
            cb(null, imagePath);
            // imagePath
        } else if(file.mimetype === "application/pdf"){
            cb(null, documentPath);
            // documentPath
        } else {
            cb( new Error("Invalid File Type!"), false);
        }
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + "-" + file.originalname)
    },
});

const bProfileUpload = multer({
  storage: bProfileStorage,
});

const upload = bProfileUpload.fields([
  {name :"certificate" , maxCount:4},
  {name : "image" , maxCount : 4 },
   {name: "profileImage", maxCount: 1} 
])

router.post("/user/createBProfile",upload,bProfileController.createBProfile);
router.post("/user/updateBProfile",upload,bProfileController.updateBProfile);
router.post("/user/deleteBProfile", bProfileController.deleteBProfile);
router.get("/user/getBProfile", bProfileController.getBProfile);
router.get("/user/getBusinessByManager", bProfileController.profileByManager);
router.get("/user/getAllBusinesses", bProfileController.getAllBusinessProfiles);
router.get("/user/nearByBusinesses", bProfileController.nearByBusinesses);
router.get("/user/searchBusiness", bProfileController.searchAPI);

module.exports = router;
