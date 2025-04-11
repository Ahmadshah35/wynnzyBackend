const func = require("../functions/bprofile");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const createBProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.files || req.files.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "At least one file is required", sucess: "false" });
    }

    if (!req.body.userId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "user ID is required", sucess: "false" });
    }

    const user = await userModel.findById(req.body.userId);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "user not found", sucess: "false" });
    }

    const profile = await func.createBProfile(req, session);

    if (profile) {
      res
        .status(200)
        .json({ status: "success", sucess: "true", data: profile });
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
          message: "Data not saved in this api",
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

const updateBProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;

    const profile = await func.updateBProfile(id, userData, req.files, session);

    if (profile) {
      res
        .status(200)
        .json({ status: "success", sucess: "true", data: profile });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", message: "Update failed", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const deleteBProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.body;
    const bProfile = await func.deleteBProfile(id, session);
    if (bProfile) {
      res
        .status(200)
        .json({
          message: "successfully deleted",
          sucess: "true",
          data: bProfile,
        });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: "unsuccessful", sucess: "false" });
    }
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res
      .status(400)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  } finally {
    session.endSession();
  }
};

const getBProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const bProfile = await func.getBProfile(id);
    if (bProfile) {
      res
        .status(200)
        .json({ message: "successful", sucess: "true", data: bProfile });
    } else {
      res.status(400).json({ message: "profile not found ", sucess: "false" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

module.exports = {
  createBProfile,
  updateBProfile,
  deleteBProfile,
  getBProfile,
};
