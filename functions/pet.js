const { default: mongoose } = require("mongoose");
const petModel = require("../models/pet");

const createPet = async (req, session) => {
  try {
    if (!req.files || (!req.files.profileImage && !req.files.petImages)) {
      throw new Error("At least one image must be provided");
    }

    const profileImage = req.files.profileImage
      ? req.files.profileImage[0].path
      : null;
    const petImages = req.files.petImages
      ? req.files.petImages.map((file) => file.path)
      : [];

    const pet = new petModel({
      ...req.body,
      profileImage,
      petImages,
    });

    const result = await pet.save({ session });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePet = async (id, userData, req, session) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Pet ID");
    }

    let updateFields = { ...userData };

    if (req.files && req.files.length > 0) {
      updateFields.petImages = req.files.map((file) => file.path);
      updateFields.profileImage = updateFields.images[0];
    }

    const pet = await petModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, session }
    );

    if (!pet) {
      throw new Error("Pet not found");
    }

    return pet;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePet = async (id, session) => {
  const pet = await petModel.findByIdAndDelete(id, { new: true, session });
  return pet;
};

const getAllPets = async (userId) => {
  const pet = await petModel.find(userId);
  return pet;
};

const getPet = async (id) => {
  const pet = await petModel.findById(id);
  return pet;
};

module.exports = {
  createPet,
  updatePet,
  deletePet,
  getAllPets,
  getPet,
};
