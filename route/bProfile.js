const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  createBProfile,
  updateBProfile,
  deleteBProfile,
  getBProfile,
} = require("../controller/bProfile");

const bProfileStorage = multer.diskStorage({
  destination: "./public/bProfile", 
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const bProfileUpload = multer({
  storage: bProfileStorage,
});

router.post(
  "/bProfile/createBProfile",
  bProfileUpload.array("certificate", 4), 
  createBProfile
);

router.post( 
  "/bProfile/updateBProfile",
  bProfileUpload.array("certificate", 4), 
  updateBProfile
);

router.post("/bProfile/deleteBProfile", deleteBProfile);
router.get("/bProfile/getBProfile", getBProfile);

module.exports = router;
