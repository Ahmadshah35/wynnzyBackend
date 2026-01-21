const { default: mongoose } = require("mongoose");
const func = require("../functions/location");

const createLocation = async (req, res) => {
  try {
    const location = await func.createLocation(req);
    if (location) {
      return res.status(200).json({ 
          success: true, 
          message: "Lcation Created!",
          data: location, });
    } else {
      return res
        .status(200)
        .json({
          success: false,
          message: "data isn't saved in Database",
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

const upadateLocation = async (req, res) => {
  try {
    const location = await func.updateLocation(req);
    // console.log(profile)
    if (location) {
      res.status(200).json({ 
          success: true, 
          message: "Location Updated Successfully!", 
          data: location
         });
      return;
    } else {
      return res
        .status(200)
        .json({ message: "update failed", success: false });
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

const deleteLocation = async (req, res) => {
  try {
    const location = await func.deleteLocation(req);
    if (location) {
      return res
        .status(200)
        .json({
          message: "Deleted successfully",
          success: true,
          data: location,
        });
    } else {
      return res
        .status(200)
        .json({ message: "Delete failed", success: false });
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

const getLocation = async (req, res) => {
  try {
    const location = await func.getLocation(req);
    if (location.length == 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "location not found",
        });
    } else {
      return res.status(200).json({ 
          success: true, 
          message: "Location By Id!", 
          data: location });
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

const getAllLocation = async (req, res) => {
  try {
    const location = await func.getAllLocation(req);
    if (location.length == 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "location not found",
        });
    } else {
      return res.status(200).json({ 
          success: true, 
          message: "Locations By userId",
          data: location
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

const selectUserLocation = async (req, res) => {
  try {
    const location = await func.selectLocation(req);
    return res.status(200).json({
      success: true,
      message: "Location is Selected!",
      data: location
    })
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({
      success: false,
      message: "Having Errors!",
      error: error.message
    })
  }
}

module.exports = {
  createLocation,
  upadateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
  selectUserLocation
};
