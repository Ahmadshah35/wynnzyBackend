const serviceModel = require("../models/service");

const createSevices = async (req, session) => {
  // req.body.location = {
  //   type: "Point",
  //   coordinates: [
  //     parseFloat(req.body.longitude),
  //     parseFloat(req.body.latitude),
  //   ],
  //   name: req.body.locationName,
  // };
  const services = new serviceModel(req.body);
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error("At least one file is required");
  }
  const imagesFiles = req.files.map((file) => file.path);

  if (!imagesFiles.length) {
    throw new Error("  images are required");
  }
  services.images = imagesFiles;
  const result = await services.save({ session });
  return result;
};

const updateServices = async (id, userData, files, session) => {
  const existingService = await serviceModel.findById(id);
  if (!existingService) {
    throw new Error("Profile not found");
  }

  const newImages = Array.isArray(files) ? files.map((file) => file.path) : [];

  userData.images = Array.isArray(existingService.images)
    ? [...existingService.images, ...newImages]
    : newImages;

  const updatedService = await serviceModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );

  return updatedService;
};

const deleteServices = async (id, session) => {
  const services = await serviceModel.findByIdAndDelete(id, {
    new: true,
    session,
  });
  console.log("object", services);
  return services;
};

const getServices = async (id) => {
  const services = await serviceModel.findById(id);
  return services;
};

const getAllServices = async (userId) => {
  const services = await serviceModel.find(userId);
  return services;
};

module.exports = {
  createSevices,
  updateServices,
  deleteServices,
  getServices,
  getAllServices,
 
};
