const express = require("express");
const reviewController = require("../controller/review");
const router=express.Router()


router.post("/user/createReview", reviewController.createReview);
router.post("/user/updateReview", reviewController.updateReview);
router.post("/user/deleteReview", reviewController.deleteReview);
router.get("/user/getReviewById", reviewController.getReviewById);
router.get("/user/getAllReview", reviewController.getAllReview);

module.exports = router;