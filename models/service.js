const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    images: {
      type: [String],
      required: true,
    },
    selectService: {
      type: String,
      enum:["Sitting","Boarding","Training","Drop-Ins"],
      required: true,
    },
    categoryName:{
      type:String,
      enum:["Hotel","Daycare","Both"],
      required:true
    },
    price: {
      type: Number,
      required: true,
    },
    address:{
      type:String,
      required:true
    },
    perDay:{
      type:Number,
      required:true
    },
    date:{
      type:String,
      required:true
    },
    time:{
      type:String,
      required:true
    },
    description: {
      type: String,
      required: true,
    },
   
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: true,
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //   },
    //   name: {
    //     type: String,
    //     required: true,
    //   },
    // },
    // longitude: {
    //   type: Number,
    // },
    // latitude: {
    //   type: Number,
    // },
  },
  { timestamps: true }
);

const serviceModel = mongoose.model("service", serviceSchema);
module.exports = serviceModel;
