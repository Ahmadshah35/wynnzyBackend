const func = require("../functions/service");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const createService = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      res.status(400).json({ error: "user not found", sucess: "false" });
      await session.abortTransaction();
      session.endSession();
      return;
    }
    if (user.type == "Daycare") {
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

      const service = await func.createSevices(req, session);

      if (service) {
        await session.commitTransaction();
        session.endSession();
        return res
          .status(200)
          .json({ status: "success", sucess: "true", data: service });
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
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized user type", sucess: "false" });
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

const updateService = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;

    const service = await func.updateServices(id, userData, req.files, session);

    if (service) {
      res
        .status(200)
        .json({ status: "success", sucess: "true", data: service });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", sucess: "false", message: "Update failed" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: "failed",
      sucess: "false",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const service = await func.deleteServices(id, session);
    if (service) {
      res
        .status(200)
        .json({
          message: "successfully deleted",
          sucess: "true",
          data: service,
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

const getService = async (req, res) => {
  try {
    const { id } = req.query;
    const service = await func.getServices(id);
    if (service) {
      res
        .status(200)
        .json({ message: "successful", sucess: "true", data: service });
    } else {
      res.status(400).json({ message: "service  not found", sucess: "false" });
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

const getAllServices = async (req, res) => {
  try {
    const { userId } = req.query;
    const service = await func.getAllServices({ userId: userId });
    if (!service) {
      res.status(400).json({ message: "services not found", sucess: "false" });
    } else {
      res
        .status(200)
        .json({ message: "successful", sucess: "true", data: service });
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
  createService,
  updateService,
  deleteService,
  getService,
  getAllServices,
 
};
