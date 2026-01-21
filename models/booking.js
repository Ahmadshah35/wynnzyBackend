const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    petId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "userpet",
      requried: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bprofile",
      requried: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    serviceId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    }],
    total: {
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
