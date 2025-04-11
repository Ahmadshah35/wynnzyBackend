const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    serviceName: {
      type: [String],
      enum:["Sitting","Boarding","Training","Drop-Ins"],
      required: true,
    },
    price: {
      type: Number,
      reequired: true,
    },
    address: {
      type: String,
      required: true,
    },
    selectDate: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      enum:["Accept","Reject","Pending"],
      default:"Pending"
     }
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
