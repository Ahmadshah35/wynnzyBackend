
const express = require("express");
const { createManager, deleteManager, getManager, updateManager } = require("../controller/manager");
const router=express.Router()
const multer = require("multer");
const { v4: uuidv4 } = require("uuid"); 

const managerStorage = multer.diskStorage({
  destination: "./public/managerP",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
 
const managerUpload = multer({
  storage: managerStorage,
});

router.post("/manager/createManager",managerUpload.single("image"),createManager)
router.post("/manager/updateManager",managerUpload.single("image"),updateManager)
router.post("/manager/deleteManager",deleteManager)
router.get("/manager/getManager",getManager)

module.exports=router