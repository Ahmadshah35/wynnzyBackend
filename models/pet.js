const mongoose = require("mongoose");
const { type } = require("../functions/user");

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    petName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    specialCareNeed: {
      type: String,
    },
    weight:{
      type:Number,
      required:true
    },
   height:{
     type:Number,
     required:true
   },
   color:{
    type:String,
    required:true
   },
   behaviour:{
    type:String,
    required:true
   },
   
    petImages: [
      {
        type: String,
      },
    ],
    profileImage:{
      type:String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

  },
  { timestamps: true }
);

const petModel = mongoose.model("userpet", petSchema);
module.exports = petModel;
