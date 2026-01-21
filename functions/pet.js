const mongoose = require("mongoose");
const petModel = require("../models/pet");

const createPet = async (req) => {
  try {
    if (!req.files || (!req.files.profileImage && !req.files.petImages)) {
      throw new Error("At least one image must be provided");
    }

    const profileImage = req.files.profileImage
      ? req.files.profileImage[0].filename
      : null;
    const petImages = req.files.petImages
      ? req.files.petImages.map((file) => file.filename)
      : [];

    const pet = new petModel({
      ...req.body,
      profileImage,
      petImages,
    });

    const result = await pet.save();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePet = async (req) => {
  const { id } = req.body;
  const updatedData = req.body;
  const profileImage = req.files.profileImage;
  if (profileImage && profileImage.length > 0) {
    updatedData.profileImage = req.files.profileImage[0].filename;
  }
  const petimages = req.files.petImages;
  if (!petimages) {
    const pet = await petModel.findByIdAndUpdate(
      id,
      { $set: { ...updatedData } },
      { new: true }
    );
    return pet;
  } else {
    const petImages = req.files.petImages.map((file) => file.filename);
    const pet = await petModel.findByIdAndUpdate(
      id,
      { $set: { ...updatedData }, $push: { petImages: petImages } },
      { new: true }
    );
    return pet;
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

const getPet = async (req) => {
  const { petProfileId } = req.query;
  const pet = await petModel.findById({_id: petProfileId});
  return pet;
};

module.exports = {
  createPet,
  updatePet,
  deletePet,
  getAllPets,
  getPet,
};
