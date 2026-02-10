const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variationId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    couponCode: {
      type: String,
    },

    discount: {
      type: Number,
      default: 0, // percentage
      min: 0,
    },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1 });

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;