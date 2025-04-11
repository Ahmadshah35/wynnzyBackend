const locationModel = require("../models/location");
const mongoose = require("mongoose");

const createLocation = async (req, session) => {
  req.body.location = {
    type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    name: req.body.locationName,
  };
  const location = new locationModel(req.body);
  const result = await location.save({ session });
  return result;
};

const updateLocation = async (id, userData, session) => {
  const location = await locationModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );
  return location;
};

const deleteLocation = async (id, session) => {
  try {
    const deletedLocation = await locationModel.findOneAndDelete(
      { _id: id },
      { session }
    );

    return deletedLocation;
  } catch (error) {
    console.error("Error in deleteLocation:", error);
    throw error;
  }
};

const getLocation = async (id) => {
  const location = await locationModel.findById(id);
  return location;
};

const getAllLocation = async (userId) => {
  const location = await locationModel.find(userId);
  return location;
};

module.exports = {
  createLocation,
  updateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
};
