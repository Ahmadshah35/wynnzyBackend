const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  location: {
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
    type: String,
    required: true,
  },
  longitude:{
    type:Number
  },
  latitude:{
    type:Number
  },
  isSelected: {
    type: Boolean
  }
});

locationSchema.index({ location: "2dsphere" });

const locationModel = mongoose.model("location", locationSchema);
module.exports = locationModel;
