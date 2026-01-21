const func = require("../functions/admin");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const adminModel = require("../models/admin");

const signUpAdmin = async (req, res) => {
  try {
    const validate = await func.validiateAdminEmail(req);
    if (validate) {
      return res
        .status(200)
        .json({ message: "Email already exists", success: false });
    } else {
          const admin = await func.signUpAdmin(req);
          const userData = {
            email: admin.email,
            Otp: admin.otp,
          };
          const sendmail = await mailer.sendMail(userData);
          const token = jwt.sign(
            { userId: admin._id, email: admin.email },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: "5d" }
          );

          const adminWithoutPassword = {
            _id: admin._id,
            email: admin.email,
            isVerified: admin.isVerified,
            otp: admin.otp,
          };

          return res.status(200).json({
            message: "Successfully created",
            success: true,
            data: adminWithoutPassword,
            token: token,
          });
    
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const validate = await func.validiateAdminEmail(req);
    if (!validate) {
      return res
        .status(200)
        .json({ message: "email not found", success: false });
    } else {
          const { password } = req.body;
          const id=validate._id
          const admin = await func.getAdmin(id);
    
          const compare = await func.comparePassword(password, admin.password);
        if (!compare) {
            return res
            .status(401)
            .json({ message: "Invalid password", success: false });
        } else {
            const token = jwt.sign(
            { userId: admin._id, email: admin.email },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: "5d" });

            const adminWithoutPassword = await adminModel
              .findById(admin._id)
              .select("-password")
              .lean();
            return res.status(200).json({
              message: "Loggedin Successsfully!",
              success: true,
              data: adminWithoutPassword,
              token: token,
            });
        }
  }    
  } catch (error) {
    console.error("Transaction failed:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const verifyAdminOtp = async (req, res) => {
  try {
    const verifyOtpp = await func.verifyAdminOtp(req);
    if (!verifyOtpp) {
        return res
        .status(200)
        .json({ message: "give valid credentials", success: false });
    } else {
         const email = verifyOtpp.email;
      const isVerified = await func.isVerifiedAdmin(email);
      
      if (!isVerified) {
          return res
          .status(200)
          .json({ message: "admin is not verified", success: false });
      } else {
        verifyOtpp.otp = null;
        await verifyOtpp.save();
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "5d" }
        );
        const adminWithoutPassword = {
          _id: verifyOtpp._id,
          email: verifyOtpp.email,
          isVerified: verifyOtpp.isVerified,
          otp: verifyOtpp.otp,
        };
        return res.status(200).json({
          message: "success verified",
          success: true,
          data: adminWithoutPassword,
          token: token,
        });
      }
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

const resendAdminOtp = async (req, res) => {
  try {
    const validiate = await func.validiateAdminEmail(req);
   
    if (!validiate) {
      return res
        .status(401)
        .json({ message: "invalid email", success: false });
    } else {
      const email = validiate.email;
      
      const resendOtp = await func.resendAdminOtp(email);
  
      if (!resendOtp) {
          return res
          .status(200)
          .json({ message: "otp doesn't sent", success: false });
      } else {
        const userData = {
          email: email,
          Otp: resendOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const adminWithoutPassword = await adminModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        return res.status(200).json({
          message: "success otp send",
          success: true,
          data: adminWithoutPassword,
        });
      }
    };
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(500).json({ 
      success: false,
      message: "Having Errors !",
      error: error.message
    });
  }
};

const forgetAdminPassword = async (req, res) => {
  try {
    const validiate = await func.validiateAdminEmail(req);
    if (!validiate) {
              return res
        .status(401)
        .json({ message: "invalid email", success: false });
    } else {
      const email = validiate.email;
      const passwordOtp = await func.passwordAdminOtp(email);
      if (!passwordOtp) {
        return res
          .status(200)
          .json({ message: "otp doesn't sent", success: false });
      } else {
        const userData = {
          email: email,
          Otp: passwordOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const adminWithoutPassword = await adminModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        return res.status(200).json({
          message: "success otp send",
          success: true,
          data: adminWithoutPassword,
        });
      }
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

const resetAdminPassword = async (req, res) => {
  try {
    const validiate = await func.validiateAdminEmail(req);

    if (validiate) {
      const email = validiate.email;
      const { newPassword } = req.body;
      const resetPassword = await func.resetAdminPassword(
        email,
        newPassword
      );
      if (resetPassword) {
        const adminWithoutPassword = await adminModel
          .findById(resetPassword._id)
          .select("-password")
          .lean();
        return res.status(200).json({
          success: true,
          message: "updated success ",
          data: adminWithoutPassword,
        });
      } else {
        return res
          .status(200)
          .json({ message: "unsuccessfully not updated", success: false });
      }
    } else {
      return res
        .status(200)
        .json({ message: "kindly give valid email", success: false });
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

const resetAdminEmail = async (req, res) => {
  try {
    const admin = await func.getAdmin(req);
   
    if (admin) {
      const { email } = req.body;
      const id = admin._id;
      const resetEmail = await func.updateAdminEmail(id, email);
      if (resetEmail) {
        const adminWithoutPassword = await adminModel
          .findById(resetEmail._id)
          .select("-password")
          .lean();
        res.status(200).json({
          success: true,
          message: "updated successfully ",
          data: adminWithoutPassword,
        });
        return;
      } else {
        return res
          .status(200)
          .json({ message: "unsuccessfully not updated", success: false });
      }
    } else {
      return res
        .status(200)
        .json({ message: "kindly give valid email", success: false });
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
  signUpAdmin,
  loginAdmin,
  resendAdminOtp,
  resetAdminPassword,
  resetAdminEmail,
  forgetAdminPassword,
  verifyAdminOtp,
};
