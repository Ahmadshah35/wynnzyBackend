const { default: mongoose } = require("mongoose");

const func = require("../functions/location");
const createLocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const location = await func.createLocation(req, session);
    if (location) {
      res
        .status(200)
        .json({ status: "sucess", sucess: "true", data: location });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({
          status: "failed",
          message: "data isn't saved in Database",
          sucess: "false",
        });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const upadateLocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;
    const location = await func.updateLocation(id, userData, session);
    // console.log(profile)
    if (location) {
      res
        .status(200)
        .json({ status: "sucess", sucess: "true", data: location });
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
    console.error("Transaction failed:", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const deleteLocation = async (req, res) => {
  try {
    let { id } = req.body;
    const location = await func.deleteLocation(id);
    if (location) {
      return res
        .status(200)
        .json({
          message: "Deleted successfully",
          sucess: "true",
          data: location,
        });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Delete failed", sucess: "false" });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const getLocation = async (req, res) => {
  try {
    const { id } = req.query;
    const location = await func.getLocation({ _id: id });
    if (location.length == 0) {
      return res
        .status(404)
        .json({
          status: "failed",
          message: "location not found",
          sucess: "false",
        });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: location });
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        status: "failed",
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const getAllLocation = async (req, res) => {
  try {
    const { userId } = req.query;
    const location = await func.getAllLocation({ userId: userId });
    if (location.length == 0) {
      return res
        .status(404)
        .json({
          status: "failed",
          sucess: "false",
          message: "location not found",
        });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: location });
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        status: "failed",
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

module.exports = {
  createLocation,
  upadateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
};
