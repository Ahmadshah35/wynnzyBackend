const func = require("../functions/user");
const funcOtp = require("../functions/otp");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");


const socialLogin =async (req, res) => {
  try {
    const { fullName, email, socialType, socialId } = req.body;

    const validate = await userModel.findOne({ email: email });

    if (validate) {
      // if (validate.isDeleted == true) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "User account is Deleted cannot Login",
      //   });
      // }
      const token = jwt.sign(
        { _id: validate._id, email: validate.email, type: validate.type },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "5y" }
      );

      const safeUser = await userModel.findByIdAndUpdate(
        { _id: validate._id },
        { $set: { socialId: socialId, socialType: socialType } },
        { new: true }
      ).select("-password");

      res.status(200).json({
        message: "Logged In successfully",
        success: true,
        data: safeUser,
        token,
      });
    } else {
      const password = "12345678";
      const hashPassword = await bcrypt.hash(password, 10);
      const signUp = new userModel({
        email: email,
        password: hashPassword,
        fullName: fullName,
        socialType: socialType,
        socialId: socialId,
        type: null,
      });
      const result = await signUp.save();
      if (!result) {
        return res.status(200).json({
          message: "signUp failed",
          success: false,
        });
      } else {
        const data = await userModel.findById(result._id).select("-password");

        const token = jwt.sign(
          {
            _id: result._id,
            email: result.email,
          },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1d" }
        );
        res.status(200).json({
          message: "sucessfully SignUp ",
          data: data,
          token,
          success: true,
        });
      }
    }
  } catch (error) {
    console.error("signUpOrLoginWithGoogle failed:", error);
    return res.status(400).json({
      message: "Having Errors",
      success: false,
      error: error.message,
    });
  }
}


const signUp = async (req, res) => {
  try {
    const validate = await func.validiateEmail(req);
    if (validate) {
      return res.status(200).json({
        success: false,
        message: "Email is Already Taken!",
      });
    }

    const { type, email, fullName, password } = req.body;

    if (type === "User" || type === "Daycare") {
      const token = jwt.sign(
        { email, fullName, password, type },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "1y" }
      );

      const createOtp = await funcOtp.generateOtp(email);

      const userData = {
        email,
        Otp: createOtp.otp,
      };
      let OTP = userData.Otp;
      const send = await mailer.sendMail(userData);

      return res.status(200).json({
        success: true,
        message: "Otp sent Successfully!",
        data: { email, fullName, type, OTP },
        accessToken: token,
      });
    } else {
      return res.status(200).json({
        message: "Invalid type",
        success: false,
      });
    }
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(403).json({
      success: false,
      message: "Having Errors",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const validate = await func.validiateEmail(req);
    if (!validate) {
      return res
        .status(200)
        .json({ message: "email not found", success: false });
    }
    const { password } = req.body;
    const user = await func.getUser(req);
    if (!user) {
      return res.status(200).json({ message: "User not found", success: false });
    }
    const compare = await func.comparePassword(password, user.password);
    if (!compare) {
      return res
        .status(200)
        .json({ message: "Invalid password", success: false });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "5d" }
    );
    const userWithoutPassword = await userModel
      .findById(user._id)
      .select("-password")
      .lean();
      return res.status(200).json({
      success: true,
      message: "User Logged in Successfully!",
      data: userWithoutPassword,
      token: token,
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

const resetPassword = async (req, res) => {
  try {
    const validiate = await func.validiateEmail(req);

    if (!validiate) {
      return res.status(200).json({
        success: false,
        message: "InValid email",
      });
    }
    const { email, newPassword } = req.body;

    const resetPassword = await func.resetPassword(email, newPassword);
    if (!resetPassword) {
      return res.status(200).json({
        success: false,
        message: "unsuccessfully not updated",
      });
    }

    const userWithoutPassword = await userModel
      .findById(resetPassword._id)
      .select("-password")
      .lean();

    return res.status(200).json({
      message: "updated successfully",
      success: true,
      data: userWithoutPassword,
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

const deleteUser = async (req, res) => {
  try {
    const user = await func.deleteUser(req);
    return res.status(200).json({
      success: true,
      message: "User Is Deleted!"
    })
  } catch (error) {
    console.log("Having Errors :", error);
      return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
      const user = await func.updateUser(req);
      return res.status(200).json({
        success: true,
        message: "User updated Successfully!",
        data: user
      });
  } catch (error) {
      console.log("Having Errors :", error);
      return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const userProfile = async (req, res) => {
   try {
      const user = await func.userProfile(req);
      return res.status(200).json({
        success: true,
        message: "User Details By Id!",
        data: user
      });
  } catch (error) {
      console.log("Having Errors :", error);
      return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
      const validate = await func.validiateEmail(req);
      if(!validate){
        return res.status(200).json({
          success: false,
          msg: "No Account Found!"
        });
      } else {
        const { email } = req.body;
        const createOtp = await funcOtp.generateOtp(email);
        const userData = {
          userId: validate._id,
          email,
          OTP: createOtp.otp,
        };
        const send = await mailer.sendMail(userData);
        return res.status(200).json({
          success: true,
          msg: "OTP Sent Successfully!",
          data: userData
        })
      }
  } catch (error) {
      console.log("Having Errors :", error);
      return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });    
  }
};

const verifyPasswordOTP = async (req, res) => {
  try {
    const verify = await funcOtp.verifyOtp(req);
    if(!verify){
      return res.status(200).json({
        success: false,
        msg: "Invalid OTP"
      })
    } else {
      return res.status(200).json({
        success: true,
        msg: "OTP Verified Successfully!"
      })      
    }
  } catch (error) {
      console.log("Having Errors :", error);
      return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });    
  }
};

module.exports = {
  socialLogin,
  signUp,
  login,
  resetPassword,
  deleteUser,
  updateUser,
  userProfile,
  forgetPassword,
  verifyPasswordOTP
};
