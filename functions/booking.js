const bookingModel = require("../models/booking");

const createBooking = async (req) => {
  const booking = new bookingModel(req.body);
  const result = await booking.save();
  return result;
};

const updateBooking = async (req) => {
  const { bookingId } = req.body;
  const updatedData = req.body;
  // console.log("Data :", req.body);
  // return 
  const booking = await bookingModel.findByIdAndUpdate(
    {_id: bookingId},
    { $set: updatedData },
    { new: true }
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

const getBooking = async (req) => {
  const { bookingId } = req.query;
  const booking = await bookingModel.findById({_id: bookingId}).populate("serviceId").populate("categoryId").populate("userId","-password").populate("petId");
  return booking;
};

const bookingStatus = async (req) => {
  const { id, status } = req.body;
 
  const type = await bookingModel.findByIdAndUpdate(
    { _id: id },
    { $set: { status: status } },
    { new: true }
  );
 
  return type;
};

const getAllBookingByUserId = async (req) => {
  const { userId, status } = req.query;

  const filter = { userId }
  if(status){
    filter.status = status
  }
  const booking = await bookingModel.find(filter).populate("serviceId").populate("categoryId");
  return booking;
};

const bookingsByManagerId = async (req) => {
  const { managerId, status } = req.query;
  const filter = { managerId };
  
  if(status){
    filter.status = status
  };
  const bookings = await bookingModel.find(filter).populate("serviceId").populate("userId","-password").populate("petId").populate("categoryId");
  return bookings
}; 

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
  bookingStatus,
  getAllBookingByUserId,
  bookingsByManagerId,
};
