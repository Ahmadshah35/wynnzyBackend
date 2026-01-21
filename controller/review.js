const { default: mongoose } = require("mongoose");
const func = require("../functions/review");
const reviewModel = require("../models/review");

const createReview = async (req, res) => {
  try {
    const review = await func.createReview(req);

    if (review) {
      const { managerId } = req.body;
      const updateRating = await func.avgRating(managerId);
      return res.status(200).json({ 
        success: true, 
        message: "Review Added Successfully!", 
        data: review,updateRating 
      });
      
    } else {
      return res.status(200).json({
        success: false,
        message: "data isn't saved in Database",
      });
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.body;
    const userData = req.body;
    const review = await func.updateReview(id, userData);
    // console.log(profile)
    if (review) {
      return res.status(200).json({ 
        success: true, 
        message: "Review updated Successfully!", 
        data: review, 
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: "update failed", 
      }); 
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    const review = await func.deleteReview(id);
    if (review) {
      return res.status(200).json({ 
          success: true, 
          message: "deleted successfully", 
          data: review });
    } else {
      return res.status(200).json({ 
          success: false,  
          message: "delete failed", 
        });
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await func.getReviewById(req);
      return res.status(200).json({ 
        success: true, 
        message: "Review By Id!", 
        data: review, 
      });
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};
const getAllReview = async (req, res) => {
  try {
    const review = await func.getAllReview(req);
    if (review.length == 0) {
      return res.status(200).json({ 
          success: false, 
          message: "review not found", 
        });
    } else {
      const { managerId } = req.query;
      const avgRating = await func.avgRating(managerId);
      const totalreviews = await func.totalProfileReviews(req);
      return res.status(200).json({ 
        success: true, 
        message: "All Reviews By ManagerId", 
        data: {
          review,
          totalreviews,
          avgRating
        }, 
      });
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getAllReview,
};
