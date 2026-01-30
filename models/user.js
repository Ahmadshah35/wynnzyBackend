const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    profileImage: {
      type: String
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    type: {
      type: String,
      enum: ["User", "Daycare"],
    },
    favProducts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileCreated:{
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
