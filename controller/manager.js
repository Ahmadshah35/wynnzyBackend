const { default: mongoose } = require("mongoose");
const managerModel = require("../functions/manager");
const userModel = require("../models/user");
const createManager = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (user.type == "Daycare") {
      const manager = await managerModel.createManager(req, session);

      if (manager) {
        res
          .status(200)
          .json({ status: "sucess", sucess: "true", data: manager });
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
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized user type", sucess: "false" });
    }
  } catch (error) {
    // console.log(error)
    await session.abortTransaction();
    session.endSession();
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

const updateManager = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;
    const manager = await managerModel.updateManager(id, userData);
    // console.log(manager)
    if (manager) {
      res.status(200).json({ status: "sucess", sucess: "true", data: manager });
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
const deleteManager = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const manager = await managerModel.deleteManager(id);
    res
      .status(200)
      .json({ message: "deleted sucessfully", sucess: "true", data: manager });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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

const getManager = async (req, res) => {
  try {
    const { id } = req.query;
    const manager = await managerModel.getManager(id);
    return res
      .status(200)
      .json({ status: "sucessful", sucess: "true", data: manager });
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
  createManager,
  updateManager,
  deleteManager,
  getManager,
};
