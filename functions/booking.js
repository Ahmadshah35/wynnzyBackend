const bookingModel = require("../models/booking");

const createBooking = async (req, session) => {
  const booking = new bookingModel(req.body);
  const result = await booking.save({ session });
  return result;
};

const updateBooking = async (id, userData, session) => {
  const booking = await bookingModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );
  return booking;
};

const deleteBooking = async (id) => {
  const booking = await bookingModel.findByIdAndDelete(
    { _id: id },
    {
      new: true,
    }
  );
  return booking;
};

const getBooking = async (id) => {
  const booking = await bookingModel.findById(id);
  return booking;
};

const getAllBooking = async (userId) => {
  const booking = await bookingModel.find({ userId: userId });
  return booking;
};

const bookingStatus = async (req, session) => {
  const { id, status } = req.body;
  //  console.log(req.body)
  const type = await bookingModel.findByIdAndUpdate(
    { _id: id },
    { $set: { status: status } },
    { new: true, session }
  );
  // console.log(type);
  return type;
};
module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  getAllBooking,
  bookingStatus,
};
