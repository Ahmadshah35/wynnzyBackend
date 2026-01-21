const locationModel = require("../models/location");
const mongoose = require("mongoose");

const createLocation = async (req) => {
  req.body.location = {
    type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    name: req.body.locationName,
  };
  const location = new locationModel(req.body);
  const result = await location.save();
  return result;
};

const updateLocation = async (req) => {
  const { locationId } = req.body;
  const updatedData = req.body;
  const location = await locationModel.findByIdAndUpdate(
    locationId,
    { $set: updatedData },
    { new: true }
  );
  return location;
};

const deleteLocation = async (req) => {
  try {
    const { locationId } = req.body;
    const deletedLocation = await locationModel.findOneAndDelete(
      { _id: locationId }
    );

    return deletedLocation;
  } catch (error) {
    console.error("Error in deleteLocation:", error);
    throw error;
  }
};

const selectLocation = async (req) => {
    const { userId, locationId } = req.body;
    const location = await locationModel.updateMany({userId: userId}, {isSelected: false});

    const selected = await locationModel.findByIdAndUpdate({_id: locationId},
      { $set: {isSelected: true}},
      { new: true});

      return selected;
};

const getLocation = async (req) => {
  const { locationId } = req.query;
  const location = await locationModel.findById(locationId);
  return location;
};

const getAllLocation = async (req) => {
  const { userId } = req.query;
  const location = await locationModel.find(userId);
  return location;
};

module.exports = {
  createLocation,
  updateLocation,
  selectLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
};
