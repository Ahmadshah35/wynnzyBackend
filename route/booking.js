const express = require("express");
const { createBooking, updateBooking, deleteBooking, getBooking, getAllBooking, bookingStatus } = require("../controller/booking");
const router=express.Router()


router.post("/booking/createBooking",createBooking);
router.post("/booking/updateBooking", updateBooking);
router.post("/booking/deleteBooking", deleteBooking);
router.get("/booking/getBooking", getBooking);
router.get("/booking/getAllBooking", getAllBooking);
router.post("/booking/bookingStatus", bookingStatus);

module.exports=router