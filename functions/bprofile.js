const bProfileModel = require("../models/bProfile");

const createBProfile = async (req, session) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error("At least one file is required");
  }

  const bProfile = new bProfileModel(req.body);

  const certificateFiles = req.files.map((file) => file.path);

  if (!certificateFiles.length) {
    throw new Error(" Certificate images are required");
  }

  bProfile.certificate = certificateFiles;

  return await bProfile.save({ session });
};

const updateBProfile = async (id, userData, files, session) => {
  const existingProfile = await bProfileModel.findById(id);
  if (!existingProfile) {
    throw new Error("Profile not found");
  }

  const newCertificate = Array.isArray(files)
    ? files.map((file) => file.path)
    : [];

  userData.certificate = Array.isArray(existingProfile.certificate)
    ? [...existingProfile.certificate, ...newCertificate]
    : newCertificate;

  const updatedProfile = await bProfileModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );

  return updatedProfile;
};

const deleteBProfile = async (id, session) => {
  const bProfile = await bProfileModel.findByIdAndDelete(id, {
    new: true,
    session,
  });
  return bProfile;
};

const getBProfile = async (id) => {
  const bProfile = await bProfileModel.findById(id);
  return bProfile;
};

module.exports = {
  createBProfile,
  updateBProfile,
  deleteBProfile,
  getBProfile,
};
