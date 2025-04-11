const { default: mongoose } = require("mongoose");
const pet = require("../functions/pet");
const petModel = require("../models/pet");
const userModel = require("../models/user");

const createPet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID", sucess: "false" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "User not found", sucess: "false" });
    }

    if (user.type !== "User") {
      return res
        .status(403)
        .json({ error: "Unauthorized user type", sucess: "false" });
    }

    if (!req.files || req.files.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "At least one image is required", sucess: "false" });
    }

    const pets = await pet.createPet(req, session);

    if (!pets) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Data isn't saved in the database",
          sucess: "false",
        });
    }

    res.status(200).json({ status: "success", sucess: "true", data: pets });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ status: "failed", sucess: "false", message: error.message });
  }
};

const updatePet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, ...userData } = req.body;

    if (req.files && req.files.length > 0) {
      userData.images = req.files.map((file) => file.path);
      userData.profileImage = userData.images[0];
    }

    const pets = await pet.updatePet(id, userData, session);

    if (!pets) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", sucess: "false", message: "Update failed" });
    }

    res.status(200).json({ status: "success", sucess: "true", data: pets });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ status: "failed", sucess: "false", message: error.message });
  }
};

const deletePet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;
    const pets = await pet.deletePet(id);
    if (pets) {
      res
        .status(200)
        .json({ message: "deleted sucessfully", sucess: "true", data: pets });
      await session.commitTransaction();
      session.endSession();
      return;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ status: "failed", message: "delete failed", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json({
        status: "failed",
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const getPet = async (req, res) => {
  try {
    const { id } = req.query;
    const pets = await pet.getPet(id);
    if (pets) {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: pets });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "pet not found", sucess: "false" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        status: "failed",
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const getAllPets = async (req, res) => {
  try {
    const { userId } = req.query;
    const pets = await pet.getAllPets({ userId: userId });
    if (pets) {
      return res
        .status(200)
        .json({ status: "sucessful", sucess: "true", data: pets });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "pet not found", sucess: "false" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        status: "failed",
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const singleImage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;

    if (!req.file) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "File must be provided", sucess: "false" });
    }

    const imagePath = req.file.path;

    const user = await petModel.findByIdAndUpdate(
      id,
      { $set: { profileImage: imagePath } },
      { new: true }
    );

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Pet not found", sucess: "false" });
    }
    res
      .status(200)
      .json({ message: "Image uploaded successfully", sucess: "true", user });
    await session.commitTransaction();
    session.endSession();

    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
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
