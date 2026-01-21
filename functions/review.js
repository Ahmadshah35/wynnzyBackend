const reviewModel = require("../models/review");
const bProfileModel = require("../models/bProfile");
const mongoose = require("mongoose");

const createReview = async (req) => {
  const review = new reviewModel(req.body);
  const result = await review.save();
  return result;
};

const updateReview = async (id, userData) => {
  const review = await reviewModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );
  return review;
};

const deleteReview = async (id) => {
  const review = await reviewModel.findByIdAndDelete(
    { _id: id },
    {
      new: true,
    }
  );
  return review;
};

const getReviewById = async (req) => {
  const { reviewId } = req.query;
  const review = await reviewModel.findById({_id: reviewId}).populate("userId");
  return review;
};

const getAllReview = async (req) => {
  const { managerId, star } = req.query;
  const filter = { managerId };

  if(star){
    filter.stars = star
  };

  const review = await reviewModel.find(filter).populate("userId");
  return review;
};

const avgRating = async (managerId) => {
  const result = await reviewModel.aggregate([
    { $match: { managerId: new mongoose.Types.ObjectId(managerId)}},
    {
      $group: {
        _id: "$managerId",
        averageRating: { $avg: "$stars"}
      }
    }
  ]);
  const total = await reviewModel.find({managerId: managerId}).countDocuments();
  const avgRating = result.length > 0 ? result[0].averageRating.toFixed(1): null;
  console.log("first :", avgRating)

  const update = await bProfileModel.findOneAndUpdate({managerId: managerId},
    { $set: {ratings: avgRating, totalreviews: total }},
    { new: true});
  return avgRating

};

const totalProfileReviews = async (req) => {
  const { managerId } = req.query;
  const review = await reviewModel.find({managerId: managerId}).countDocuments();
  return review
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getAllReview,
  avgRating,
  totalProfileReviews
};
