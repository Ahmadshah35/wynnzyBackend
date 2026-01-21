const express = require("express");
const router = express.Router();
const multer = require("multer");
const serviceController = require("../controller/service");
const categoryController = require("../controller/category");

const serviceStorage = multer.diskStorage({
  destination: "./public/service",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const serviceUpload = multer({
  storage: serviceStorage,
});

// Category Routes
router.post("/user/addCategory", serviceUpload.single("image"), categoryController.addcategory);
router.get("/user/getCategoryById", categoryController.getCatgory);
router.get("/user/getAllcategories", categoryController.getAllCategories);
router.post("/user/updateCategory", serviceUpload.single("image"), categoryController.updateCategory);
router.post("/user/deleteCategory", categoryController.deleteCategory);

// Service Routes
router.post("/user/createService", serviceUpload.array("images", 3), serviceController.createService);
router.post("/user/updateService",serviceUpload.array("images", 3),serviceController.updateService);
router.post("/user/deleteService", serviceController.deleteService);
router.get("/user/getService", serviceController.getService);
router.get("/user/getAllServices", serviceController.getAllServices);
router.get("/user/servicesByManagerId", serviceController.getAllServicesByManager);

module.exports = router;
