const express = require("express");
const bookingController = require("../controller/booking");
const router = express.Router();

router.post("/user/createBooking", bookingController.createBooking);
router.post("/user/updateBooking", bookingController.updateBooking);
router.post("/user/deleteBooking", bookingController.deleteBooking);
router.get("/user/getBooking", bookingController.getBooking);
router.post("/user/bookingStatus", bookingController.bookingStatus);
router.get("/user/bookingsByManagerId", bookingController.bookingsByManagerId);
router.get("/user/bookingsByUserId", bookingController.getAllBookingByUserId);

module.exports = router;
