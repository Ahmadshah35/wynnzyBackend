const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const shippingAddressModel = mongoose.model("shippingAddress",shippingAddressSchema,);
module.exports = shippingAddressModel;
