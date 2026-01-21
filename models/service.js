const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
     managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    serviceName: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: true,
    },
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      re: "Category",
      // enum:["Sitting","Boarding","Training","Drop-Ins"],
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
    status:{
      type:String,
      enum:["Active","InActive"],
      default: "InActive"
    }
  },
  { timestamps: true }
);

const serviceModel = mongoose.model("service", serviceSchema);
module.exports = serviceModel;
