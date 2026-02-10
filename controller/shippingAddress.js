const shippingAddressModel = require("../models/shippingAddress");
const mongoose = require("mongoose");

// Create a new shipping address
const createShippingAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, city, state, zipCode } = req.body;
    const userId = req.user._id;

    if (!fullName || !phoneNumber || !address || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newAddress = new shippingAddressModel({
      userId,
      fullName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Shipping address created successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error("createShippingAddress error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating shipping address",
      error: error.message,
    });
  }
};

// Get all shipping addresses for a user
const getUserShippingAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    const addresses = await shippingAddressModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Shipping addresses retrieved successfully",
      data: addresses,
    });
  } catch (error) {
    console.error("getUserShippingAddresses error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving shipping addresses",
      error: error.message,
    });
  }
};

// Get a single shipping address by ID
const getShippingAddressById = async (req, res) => {
  try {
    const { shippingAddressId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await shippingAddressModel.findById(shippingAddressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping address retrieved successfully",
      data: address,
    });
  } catch (error) {
    console.error("getShippingAddressById error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving shipping address",
      error: error.message,
    });
  }
};

// Update a shipping address
const updateShippingAddress = async (req, res) => {
  try {
    const { shippingAddressId, fullName, phoneNumber, address, city, state, zipCode } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (zipCode) updateData.zipCode = zipCode;

    const updatedAddress = await shippingAddressModel.findOneAndUpdate(
      { _id: shippingAddressId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("updateShippingAddress error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating shipping address",
      error: error.message,
    });
  }
};

// Delete a shipping address
const deleteShippingAddress = async (req, res) => {
  try {
    const { shippingAddressId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const userId = req.user._id;
    const deletedAddress = await shippingAddressModel.findOneAndDelete({ _id: shippingAddressId, userId });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping address deleted successfully",
    });
  } catch (error) {
    console.error("deleteShippingAddress error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting shipping address",
      error: error.message,
    });
  }
};

module.exports = {
  createShippingAddress,
  getUserShippingAddresses,
  getShippingAddressById,
  updateShippingAddress,
  deleteShippingAddress,
};
