const func = require("../functions/service");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const createService = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.managerId);
    if (!user) {
      return res.status(200).json({ 
        success: false,
        message: "user not found", 
       });
    }
    if (user.type == "Daycare") {
      const service = await func.createSevices(req);
        return res.status(200).json({  
          success: true, 
          data: service });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: "Unauthorized user type", 
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

const updateService = async (req, res) => {
  try {
    const service = await func.updateServices(req);

    if (service) {
      return res
        .status(200)
        .json({ success: true, data: service });
      
    } else {
      return res.status(200).json({  
          success: false, 
          message: "Update failed" 
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

const deleteService = async (req, res) => {
  try {
    const { id } = req.body;
    const service = await func.deleteServices(id);
    if (service) {
      return res.status(200).json({
        message: "successfully deleted",
        success: true,
        data: service,
      });
    } else {
      res.status(200).json({ 
        success: false,
        message: "unsuccessful", 
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

const getService = async (req, res) => {
  try {
    const service = await func.getServices(req);
    console.log("first :", service);
    if (service) {
      res.status(200).json({ 
          success: true, 
          message: "successful", 
          data: service 
        });
    } else {
      res.status(200).json({ 
        success: false,
        message: "service  not found", 
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

const getAllServices = async (req, res) => {
  try {
    const service = await func.getAllServices(req);
    if (!service) {
      res.status(200).json({ 
        success: false,
        message: "services not found", 
       });
    } else {
      return res.status(200).json({ 
        success: true, 
        message: "successful", 
        data: service 
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

const getAllServicesByManager = async (req, res) => {
  try {
    const services = await func.servicesByManagerId(req);
    if( services.length === 0 ){
      return res.status(200).json({
        success: true,
        message: "No Services Found!",
      })
    } else {
      return res.status(200).json({
        success: true,
        message: "All Services By ManagerId!",
        data: services
      })
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

module.exports = {
  createService,
  updateService,
  deleteService,
  getService,
  getAllServices,
  getAllServicesByManager
};
