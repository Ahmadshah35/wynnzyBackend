const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["Food", "Treats", "Supplements", "Toys", "Accessories"],
      required: true,
    },
    petType: {
      type: String,
      enum: ["Dog", "Cat", "Both"],
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ["Puppy", "Kitten", "Adult", "Senior", "All_Ages"],
      default: "All_Ages",
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    ingredients: {
      type: String,
      trim: true,
    },
    nutritionalInfo: {
      protein: String,
      fat: String,
      fiber: String,
      moisture: String,
      calories: String,
    },
    variations: [
      {
        name: {
          type: String,
          trim: true,
        },
        value: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          min: 0,
        },
        stock: {
          type: Number,
          min: 0,
        },
        flavor: {
          type: String,
          trim: true,
        },
        weight: {
          type: String,
          trim: true,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out_of_Stock"],
      default: "Active",
    },
    favoriteBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;