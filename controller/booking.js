const { default: mongoose } = require("mongoose");
const func = require("../functions/booking");
const userModel = require("../models/user");

const createBooking = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.type == "User") {
      const booking = await func.createBooking(req);
      if (booking) {
        return res
          .status(200)
          .json({ 
            success: true,
            message: "Booking Created!", 
            data: booking });
        
      } else {
        return res.status(200).json({
          success: false,
          message: "data isn't saved in Database",
        });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized user type", success: false });
    }
  } catch (error) {
    console.log("Having Errors :", error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await func.updateBooking(req);
    if (booking) {
      return res.status(200).json({ success: true, message: "Booking Details Updated!", data: booking });
    } else {
      return res
        .status(200)
        .json({ message: "update failed", success: false });
    }
  } catch (error) {
    console.log("Having Errors : ", error);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.body;
    const booking = await func.deleteBooking(id);
    if (booking) {
      return res.status(200).json({
        success: true,
        message: "booking deleted successfully",
      });
    } else {
      return res
        .status(200)
        .json({ message: "delete failed", success: false });
    }
  } catch (error) {
    console.log("Having Errors: ", error)
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await func.getBooking(req);
    if (!booking) {
      return res.status(200).json({ 
        success: false, 
          message: "booking not found", 
        });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Booking Details By Id", data: booking });
    }
  } catch (error) {
    console.log("Having Errors: ", error)
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const bookingStatus = async (req, res) => {
  try {
    const status = await func.bookingStatus(req);
    // console.log(status)
    if (status) {
      return res.status(200).json({ Data: status, message: "Booking Status Updated!", success: true });
    } else {
      return res
        .status(200)
        .json({ message: "having error in status ", success: false });
    }
  } catch (error) {
    console.log("Having Errors: ", error)
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const getAllBookingByUserId = async (req, res) => {
  try {
    const booking = await func.getAllBookingByUserId(req);
    if (booking.length == 0) {
      return res.status(200).json({ 
          success: false,
          message: "booking not found", 
         });
    } else {
      return res
        .status(200)
        .json({success: true, messgae: "Bookings By UserId",  data: booking });
    }
  } catch (error) {
    console.log("Having Errors: ", error)
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const bookingsByManagerId = async (req, res) => {
  try {
    const bookings = await func.bookingsByManagerId(req);
    if( bookings.length === 0){
      return res.status(200).json({
        success: true,
        message: "No Booking Found!"
      })
    } else {
       return res.status(200).json({
        success: true,
        message: "Bookings By ManagerId!",
        data: bookings
       })
    }
  } catch (error) {
    console.log("Having Errors!", error);
    return res.status(400).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  bookingStatus,
  getAllBookingByUserId,
  bookingsByManagerId,
};
