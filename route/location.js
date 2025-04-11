const express = require("express");
const {
  createLocation,
  upadateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
} = require("../controller/location");

const router = express.Router();

router.post("/location/createLocation", createLocation);
router.post("/location/updateLocation", upadateLocation);
router.post("/location/deleteLocation", deleteLocation);
router.get("/location/getLocation", getLocation);
router.get("/location/getAllLocation", getAllLocation);
module.exports = router;
