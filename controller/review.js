const { default: mongoose } = require("mongoose");
const func = require("../functions/review");
const reviewModel = require("../models/review");

const createReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await func.createReview(req, session);

    if (review) {
      res.status(200).json({ status: "sucess", sucess: "true", data: review });
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

const updateReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const userData = req.body;
    const review = await func.updateReview(id, userData, session);
    // console.log(profile)
    if (review) {
      res.status(200).json({ status: "sucess", sucess: "true", data: review });
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
const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    const review = await func.deleteReview(id);
    if (review) {
      return res
        .status(200)
        .json({ message: "deleted sucessfully", sucess: "true", data: review });
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

const getReview = async (req, res) => {
  try {
    const { id } = req.query;
    const review = await func.getReview({ _id: id });
    if (review.length == 0) {
      return res
        .status(200)
        .json({ status: "review not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: review });
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
const getAllReview = async (req, res) => {
  try {
    const { userId } = req.query;
    const review = await func.getAllReview(userId);
    if (review.length == 0) {
      return res
        .status(200)
        .json({ status: "review not found", sucess: "false" });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: review });
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

const getAverageRating = async (req, res) => {
  try {
    const { managerId } = req.body;
    const result = await reviewModel.aggregate([
      { $match: { managerId: new mongoose.Types.ObjectId(managerId) } },
      {
        $group: {
          _id: "$managerId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    const rating =
      result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };

    return res
      .status(200)
      .json({ status: "sucessful", sucess: "true", data: rating });
  } catch (error) {
    console.error("Error getting average rating:", error);
    res
      .status(400)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
    throw error;
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getAllReview,
  getAverageRating,
};
