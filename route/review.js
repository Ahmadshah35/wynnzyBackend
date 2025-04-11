const express = require("express");
const { createReview, deleteReview, getReview, getAllReview, updateReview, getAverageRating } = require("../controller/review");
const router=express.Router()


router.post("/review/createReview",createReview);
router.post("/review/updateReview", updateReview);
router.post("/review/deleteReview", deleteReview);
router.get("/review/getReview", getReview);
router.get("/review/getAllReview", getAllReview);
router.get("/review/averageRating", getAverageRating);
module.exports=router