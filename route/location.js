const express = require("express");
const locationController = require("../controller/location");

const router = express.Router();

router.post("/user/createLocation", locationController.createLocation);
router.post("/user/updateLocation", locationController.upadateLocation);
router.post("/user/deleteLocation", locationController.deleteLocation);
router.get("/user/getLocation", locationController.getLocation);
router.get("/user/getAllLocation", locationController.getAllLocation);
router.post("/user/selecLocation", locationController.selectUserLocation);
module.exports = router;
