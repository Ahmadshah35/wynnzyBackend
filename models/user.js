const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    type: {
      type: String,
      enum: ["User", "Daycare"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image:{
      type:String
    },
    contactNumber:{
      type:Number
    },
    bio:{
      type:String
    },
    expLevel:{
      type:Number
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
