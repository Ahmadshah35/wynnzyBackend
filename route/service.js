const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { createService, updateService, deleteService, getService, getAllServices } = require("../controller/service");

const serviceStorage = multer.diskStorage({
  destination: "./public/service", 
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const serviceUpload = multer({
  storage: serviceStorage,
});

router.post(
  "/service/createService",
  serviceUpload.array("images", 3), 
  createService
);

router.post(
  "/service/updateService",
  serviceUpload.array("images", 3), 
  updateService
);

router.post("/service/deleteService", deleteService);
router.get("/service/getService", getService);
router.get("/service/getAllServices", getAllServices);


module.exports = router;
