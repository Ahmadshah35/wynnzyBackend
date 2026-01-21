const serviceModel = require("../models/service");

const createSevices = async (req) => {
  const services = new serviceModel(req.body);
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error("At least one file is required");
  }
  const imagesFiles = req.files.map((file) => file.filename);

  services.images = imagesFiles;
  const result = await services.save();
  return result;
};

const updateServices = async (req) => {
  const { serviceId } = req.body;
  const userData = req.body;
  const image = req.files.images;
  if (!image) {
    const updateService = await serviceModel.findByIdAndUpdate(
      serviceId,
      { $set: userData },
      { new: true }
    );
    return updateService;
  } else {
    const image = req.files.images.map((file) => file.filename);
    const updatedService = await serviceModel.findByIdAndUpdate(
      serviceId,
      { $set: { ...userData }, $push: { images: image } },
      { new: true }
    );
    return updatedService;
  }
};

const deleteServices = async (id) => {
  const services = await serviceModel.findByIdAndDelete(id, {
    new: true
  });
  console.log("object", services);
  return services;
};

const getServices = async (req) => {
  const { serviceId } = req.query;
  const services = await serviceModel.findById({_id: serviceId});
  return services;
};

const getAllServices = async (req) => {
  const services = await serviceModel.find();
  return services;
};

const servicesByManagerId = async (req) => {
  const { managerId, status, serviceCategory } = req.query;
  const filter = { managerId };
  if(status){
    filter.status = status
  };
  if(serviceCategory){
    filter.serviceCategory = serviceCategory
  };
  console.log("first :", filter);
  // return
    const services = await serviceModel.find(filter);
    return services
}

module.exports = {
  createSevices,
  updateServices,
  deleteServices,
  getServices,
  getAllServices,
  servicesByManagerId
};
