const bProfileModel = require("../models/bProfile");

const createBProfile = async (req) => {
    // console.log("first :", req.files.profileImage[0].filename);
  // return
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error("At least one file is required");
  }

  req.body.location = {
     type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    name: req.body.locationName, 
  }

  req.body.bType = JSON.parse(req.body.bType);
  req.body.services = JSON.parse(req.body.services);

  const bProfile = new bProfileModel(req.body);

  const profileImage = req.files.profileImage[0].filename;
  const images = req.files.image.map((file) => file.filename);
  const certificateFiles = req.files.certificate.map((file) => file.filename);

  if (!certificateFiles.length) {
    throw new Error(" Certificate images are required");
  }

  bProfile.certificate = certificateFiles;
  bProfile.image = images
  bProfile.profileImage = profileImage

  return await bProfile.save();
};

const updateBProfile = async (req) => {
  const { businessProfileId } = req.body;

  const updatedData = req.body;
  const image = req.files.image;
  if (image && image.length > 0) {
    updatedData.image = req.files.image.map((file) => file.filename);
  }
    if(req.files && req.files.profileImage){
    updatedData.profileImage = req.files.profileImage[0].filename;
  }
  const certificate = req.files.certificate;
  if (!certificate) {
    const bProfile = await bProfileModel.findByIdAndUpdate(
      { _id: businessProfileId },
      { $set: updatedData },
      { new: true }
    );
    return bProfile;
  } else {
    const certificate = req.files.certificate.map((file) => file.filename);
    const bProfile = await bProfileModel.findByIdAndUpdate(
      { _id: businessProfileId },
      { $set: { ...updatedData }, $push: { certificate: certificate } },
      { new: true }
    );
    return bProfile;
  }
};

const deleteBProfile = async (id) => {
  const bProfile = await bProfileModel.findByIdAndDelete(id, {
    new: true,
  });
  return bProfile;
};

const getBProfile = async (req) => {
  const { businessId } = req.query;
  const bProfile = await bProfileModel.findById({_id: businessId});
  return bProfile;
};

const businessProfileByManager = async (req) => {
  const { managerId } = req.query;
  const business = await bProfileModel.findOne({ managerId: managerId });
  return business
};

const AllBusinessProfiles = async (req) => {
  const business = await bProfileModel.find();
  return business
};

const nearByBusinesses = async (req) => {
  const { longitude, latitude } = req.query;
  
  const location = {
    type: "point",
    coordinates: [
      parseFloat(longitude),
      parseFloat(latitude)
    ]
  };

  const business = await bProfileModel.find({
    location:{
      $near:{
        $geometry:{
          type: "Point",
          coordinates: location.coordinates
        },
        $maxDistance: 10000
      }
    }
  });
  return business;
};

const searchAPI = async (req) => {
  const { name } = req.query;
  // console.log("first :", name);
  // return
  const result = await bProfileModel.find({
    businessName: { $regex: name, $options: "i" }
  });
  return result;
};

module.exports = {
  createBProfile,
  updateBProfile,
  deleteBProfile,
  getBProfile,
  businessProfileByManager,
  AllBusinessProfiles,
  nearByBusinesses,
  searchAPI
};
