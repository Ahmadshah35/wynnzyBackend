const mongoose = require("mongoose");

const bProfileSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  profileImage:{
    type: String
  },
  image:{
    type:[String]
  },
  fullName:{
    type:String
  },
  businessName: {
    type: String
  },
  contactNumber:{
    type:Number
  },
  bio:{
    type:String
  },
  expLevel:{
    type:Number
  },
  businessName: {
    type: String
  },
  bType: {
    type: [String],
    enum:["Daycare","Hotel"],
  },
  services: {
    type: [String],
    enum:["Sitting","Boarding","Training","Drop-Ins"],
  },
  address: {
    type: String,
  },
  certificate: {
    type: [String],
  },
  location:{
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  locationName: {
    type: String
  },
  longitude: {
    type: Number
  },
  latitude:{
    type: Number
  },
  ratings:{
    type: String
  },
  totalreviews: {
    type: String
  },
  profileCreated:{
    type: Boolean,
    default: true
  },
},{timestamps:true});

bProfileSchema.index({ location: "2dsphere" });

const bProfileModel = mongoose.model("bprofile", bProfileSchema);
module.exports = bProfileModel;
