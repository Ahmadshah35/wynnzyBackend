const func = require("../functions/admin");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const adminModel = require("../models/admin");

const signUpAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await func.validiateAdminEmail(req);
    // console.log(validate)
    if (validate) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Email already exists", sucess: "false" });
    }
    const admin = await func.signUpAdmin(req, session);
    if (!admin) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "admin creation failed", sucess: "false" });
    }
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

    res.status(200).json({
      message: "Successfully created",
      sucess: "true",
      data: adminWithoutPassword,
      token: token,
    });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await func.validiateAdminEmail(req);
    if (!validate) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "eamil not found", sucess: "false" });
    }
    const { password } = req.body;
    const id=validate._id
    const admin = await func.getAdmin(id);
    // console.log(admin)
    if (!admin) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "admin not found", sucess: "false" });
    }
    const compare = await func.comparePassword(password, admin.password);
    if (!compare) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(401)
        .json({ message: "Invalid password", sucess: "false" });
    }
    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "5d" }
    );

    const adminWithoutPassword = await adminModel
      .findById(admin._id)
      .select("-password")
      .lean();
    res.status(200).json({
      status: "successful",
      sucess: "true",
      data: adminWithoutPassword,
      token: token,
    });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const verifyAdminOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const verifyOtpp = await func.verifyAdminOtp(req, session);
    // console.log(verifyOtp)
    if (verifyOtpp) {
      const email = verifyOtpp.email;
      const isVerified = await func.isVerifiedAdmin(email, session);
      // console.log(isVerified)
      if (isVerified) {
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
        res.status(200).json({
          message: "sucessfully verified",
          sucess: "true",
          data: adminWithoutPassword,
          token: token,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "admin is not verified", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "give valid credentials", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const resendAdminOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateAdminEmail(req);
    // console.log(validiate)
    if (validiate) {
      const email = validiate.email;
      // console.log(email)
      const resendOtp = await func.resendAdminOtp(email, session);
      // console.log(resendOtp)
      if (resendOtp) {
        const userData = {
          email: email,
          Otp: resendOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const adminWithoutPassword = await adminModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        res.status(200).json({
          message: "sucessfully otp send",
          sucess: "true",
          data: adminWithoutPassword,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "otp doesn't sent", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(401)
        .json({ message: "invalid email", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const forgetAdminPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateAdminEmail(req);
    if (validiate) {
      const email = validiate.email;
      const passwordOtp = await func.passwordAdminOtp(email, session);
      if (passwordOtp) {
        const userData = {
          email: email,
          Otp: passwordOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const adminWithoutPassword = await adminModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        res.status(200).json({
          message: "sucessfully otp send",
          sucess: "true",
          data: adminWithoutPassword,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "otp doesn't sent", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(401)
        .json({ message: "invalid email", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const resetAdminPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateAdminEmail(req);

    if (validiate) {
      const email = validiate.email;
      const { newPassword } = req.body;
      const resetPassword = await func.resetAdminPassword(
        email,
        newPassword,
        session
      );
      if (resetPassword) {
        const adminWithoutPassword = await adminModel
          .findById(resetPassword._id)
          .select("-password")
          .lean();
        res.status(200).json({
          message: "updated sucessfully ",
          sucess: "true",
          data: adminWithoutPassword,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "unsucessfully not updated", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "kindly give valid email", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
    });
  }
};

const resetAdminEmail = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const admin = await func.getAdmin(req);
    //   console.log(admin)
    if (admin) {
      const { email } = req.body;
      const id = admin._id;
      const resetEmail = await func.updateAdminEmail(id, email, session);
      if (resetEmail) {
        const adminWithoutPassword = await adminModel
          .findById(resetEmail._id)
          .select("-password")
          .lean();
        res.status(200).json({
          message: "updated sucessfully ",
          sucess: "true",
          data: adminWithoutPassword,
        });
        await session.commitTransaction();
        session.endSession();
        return;
      } else {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "unsucessfully not updated", sucess: "false" });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "kindly give valid email", sucess: "false" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "something went wrong",
      sucess: "false",
      error: error.message,
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
