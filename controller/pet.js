const { default: mongoose } = require("mongoose");
const pet = require("../functions/pet");
const petModel = require("../models/pet");
const userModel = require("../models/user");

const createPet = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(200).json({ message: "User not found", success: false });
    }

    if (user.type !== "User") {
      return res
        .status(200)
        .json({ message: "Unauthorized user type", success: false });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(200)
        .json({ message: "At least one image is required", success: false });
    }

    const pets = await pet.createPet(req);

    if (!pets) {
      return res
        .status(200)
        .json({
          success: false,
          message: "Data isn't saved in the database",
        });
    }

    return res.status(200).json({
      success: true, 
      message: "Pet Profile Created!", 
      data: pets
      });
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const updatePet = async (req, res) => {
  try {
    const pets = await pet.updatePet(req);
    return res.status(200).json({
      success: true,
      message: "Pet Profile Updated!", 
      data: pets 
    });
  } catch (error) {
console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.body;
    const pets = await pet.deletePet(id);
    if (pets) {
      return res
        .status(200)
        .json({ message: "deleted successfully", success: true, data: pets });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: "Failed To Delete!", 
      });
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const getPet = async (req, res) => {
  try {
    // const { petProfileId } = req.query;
    const pets = await pet.getPet(req);
    if (pets) {
      return res.status(200).json({ 
          success: true, 
          message: "Pet Profile By Id!", 
          data: pets, 
        });
    } else {
      return res.status(200).json({ 
          success: false,
          message: "pet not found", 
         });
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const getAllPets = async (req, res) => {
  try {
    const { userId } = req.query;
    const pets = await pet.getAllPets({ userId: userId });
    if (pets) {
      return res.status(200).json({ 
          success: true, 
          message: "All Pet Profiles By User", 
          data: pets });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: "pet not found", 
      });
    }
  } catch (error) {
   console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const singleImage = async (req, res) => {
  try {
    const { id } = req.body;

    if (!req.file) {
      return res
        .status(200)
        .json({ message: "File must be provided", success: false });
    }

    const imagePath = req.file.path;

    const user = await petModel.findByIdAndUpdate(
      id,
      { $set: { profileImage: imagePath } },
      { new: true }
    );

    if (!user) {
      return res.status(200).json({ message: "Pet not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Image uploaded successfully", success: true, user });


    return;
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

module.exports = {
  createPet,
  updatePet,
  deletePet,
  getPet,
  getAllPets,
  singleImage,
};
