const { default: mongoose } = require("mongoose");
const func = require("../functions/booking");
const userModel = require("../models/user");

const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.type == "User") {
      const booking = await func.createBooking(req, session);
      if (booking) {
        res
          .status(200)
          .json({ status: "sucess", sucess: "true", data: booking });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          status: "failed",
          message: "data isn't saved in Database",
          sucess: "false",
        });
      }
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized user type", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;
    const booking = await func.updateBooking(id, userData, session);
    if (booking) {
      res.status(200).json({ status: "sucess", sucess: "true", data: booking });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", message: "update failed", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
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
        message: "booking deleted sucessfully",
        sucess: "true",
        data: booking,
      });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "delete failed", sucess: "false" });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const { id } = req.body;
    const booking = await func.getBooking({ _id: id });
    if (booking.length == 0) {
      return res
        .status(200)
        .json({ status: "booking not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: booking });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const getAllBooking = async (req, res) => {
  try {
    const { userId } = req.query;
    const booking = await func.getAllBooking(userId);
    if (booking.length == 0) {
      return res
        .status(200)
        .json({ status: " booking not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: booking });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const bookingStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const status = await func.bookingStatus(req);
    // console.log(status)
    if (status) {
      res.status(200).json({ status: "sucess", Data: status, sucess: true });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "having error in status ", sucess: false });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json({ message: "something went wrong ", sucess: false });
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  getAllBooking,
  bookingStatus,
};
