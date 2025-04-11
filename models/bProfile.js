const mongoose = require("mongoose");

const bProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bType: {
    type: String,
    enum:["Daycare","Hotel"],
    required: true,
  },
  services: {
    type: String,
    enum:["Sitting","Boarding","Training","Drop-Ins"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  certificate: {
    type: [String],
  },
},{timestamps:true});

const bProfileModel = mongoose.model("bprofile", bProfileSchema);
module.exports = bProfileModel;
