const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  locationName: {
    type: String,
    required: true,
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
  longitude:{
    type:Number
  },
  latitude:{
    type:Number
  }
});

const locationModel = mongoose.model("location", locationSchema);
module.exports = locationModel;
