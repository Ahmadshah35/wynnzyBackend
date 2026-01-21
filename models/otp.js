const { default: mongoose, model } = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const otpModel =mongoose.model("otp",otpSchema)

module.exports = otpModel