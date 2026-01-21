const func = require("../functions/bprofile");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const userFunction = require("../functions/user");
const reviewFunction = require("../functions/review");

const createBProfile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(200)
        .json({ message: "At least one file is required", success: false });
    }

    if (!req.body.managerId) {
      return res
        .status(200)
        .json({ message: " valid manager ID is required", success: false });
    }

    const user = await userModel.findById(req.body.managerId);
    if (!user) {
      return res.status(200).json({ message: "manager not found", success: false });
    }

    const profile = await func.createBProfile(req);
    const update = await userFunction.profileCreated(req);
    if (profile) {
      return res.status(200).json({ 
          success: true, 
          message: "Profile Created!", 
          data: profile,
         });
      
    } else {
      return res
        .status(200)
        .json({
          success: false,
          message: "Data not saved in this api",
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

const updateBProfile = async (req, res) => {
  try {

    const profile = await func.updateBProfile(req);

    if (profile) {
      return res.status(200).json({ 
            success: true, 
            message: "Profile Updated Successfully",
            data: profile,
           });
    } else {
      return res
        .status(200)
        .json({message: "Update failed", success: false });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteBProfile = async (req, res) => {

  try {
    const { id } = req.body;
    const bProfile = await func.deleteBProfile(id);
    if (bProfile) {
      return res
        .status(200)
        .json({
          success: true,
          message: "successfully deleted",
          data: bProfile,
        });
    } else {
      res.status(200).json({ message: "unsuccessful", success: false });
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

const getBProfile = async (req, res) => {
  try {
    const bProfile = await func.getBProfile(req);
    if (bProfile) {
      res
        .status(200)
        .json({ message: "successful", success: true, data: bProfile });
    } else {
      res.status(200).json({ message: "profile not found ", success: false });
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

const profileByManager = async (req, res) => {
  try {
      const profile = await func.businessProfileByManager(req);
      const totalreviews = await reviewFunction.totalProfileReviews(req);
      return res.status(200).json({
        success: true,
        message: "Business Profile By Manager!",
        data: {
          profile,
          totalreviews
        }
      })    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })
  }
};

const getAllBusinessProfiles = async (req, res) => {
  try {
    const profiles = await func.AllBusinessProfiles(req);
    return res.status(200).json({
      success: true,
      message: "All Business Profiles!",
      data: profiles
    })
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })
  }
};

const nearByBusinesses = async (req, res) => {
  try {
      const business = await func.nearByBusinesses(req);
      if( business.length === 0){
        return res.status(200).json({
          success: false,
          msg: "No NearBy Business Found"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Businesses Near You!",
          data: business
        })
      }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })
  }
};

const searchAPI = async (req, res) => {
  try {
    const profile = await func.searchAPI(req);
    if(profile.length === 0){
      return res.status(200).json({
        success: false,
        message: "No Business Found!"
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Business By Search!",
        data: profile
      })
    }
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })    
  }
}

module.exports = {
  createBProfile,
  updateBProfile,
  deleteBProfile,
  getBProfile,
  profileByManager,
  getAllBusinessProfiles,
  nearByBusinesses,
  searchAPI
};
