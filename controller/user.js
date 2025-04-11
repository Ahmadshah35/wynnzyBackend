const func = require("../functions/user");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await func.validiateEmail(req);
    // console.log(validate)
    if (validate) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Email already exists", sucess: "false" });
    }
    const user = await func.signUp(req, session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "User creation failed", sucess: "false" });
    }
    const userData = {
      email: user.email,
      Otp: user.otp,
    };
    const sendmail = await mailer.sendMail(userData);
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "5d" }
    );

    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      type: user.type,
      isVerified: user.isVerified,
      otp: user.otp,
    };

    res.status(200).json({
      message: "Successfully created",
      sucess: "true",
      data: userWithoutPassword,
      token: token,
    });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const login = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validate = await func.validiateEmail(req);
    if (!validate) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "eamil not found", sucess: "false" });
    }
    const { password } = req.body;
    const user = await func.getUser(req);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "User not found", sucess: "false" });
    }
    const compare = await func.comparePassword(password, user.password);
    if (!compare) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(401)
        .json({ message: "Invalid password", sucess: "false" });
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
    res
      .status(200)
      .json({
        status: "successful",
        sucess: "true",
        data: userWithoutPassword,
        token: token,
      });
    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const verifyOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const verifyOtpp = await func.verifyOtp(req, session);
    // console.log(verifyOtp)
    if (verifyOtpp) {
      const email = verifyOtpp.email;
      const isVerified = await func.isVerified(email, session);
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
        const userWithoutPassword = {
          _id: verifyOtpp._id,
          fullName: verifyOtpp.fullName,
          email: verifyOtpp.email,
          type: verifyOtpp.type,
          isVerified: verifyOtpp.isVerified,
          otp: verifyOtpp.otp,
        };
        res.status(200).json({
          message: "sucessfully verified",
          sucess: "true",
          data: userWithoutPassword,
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
          .json({ message: "user is not verified", sucess: "false" });
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
    return res
      .status(500)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const resendOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateEmail(req);
    // console.log(validiate)
    if (validiate) {
      const email = validiate.email;
      // console.log(email)
      const resendOtp = await func.resendOtp(email, session);
      // console.log(resendOtp)
      if (resendOtp) {
        const userData = {
          email: email,
          Otp: resendOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const userWithoutPassword = await userModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        res
          .status(200)
          .json({
            message: "sucessfully otp send",
            sucess: "true",
            data: userWithoutPassword,
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
    return res
      .status(500)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const forgetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateEmail(req);
    if (validiate) {
      const email = validiate.email;
      const passwordOtp = await func.passwordOtp(email, session);
      if (passwordOtp) {
        const userData = {
          email: email,
          Otp: passwordOtp.otp,
        };
        const sendMail = await mailer.sendMail(userData);
        const userWithoutPassword = await userModel
          .findById(validiate._id)
          .select("-password")
          .lean();
        res
          .status(200)
          .json({
            message: "sucessfully otp send",
            sucess: "true",
            data: userWithoutPassword,
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
    return res
      .status(500)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

const resetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validiate = await func.validiateEmail(req);

    if (validiate) {
      const email = validiate.email;
      const { password } = req.body;
      const resetPassword = await func.resetPassword(
        email,
        password,
        session
      );
      if (resetPassword) {
        const userWithoutPassword = await userModel
          .findById(resetPassword._id)
          .select("-password")
          .lean();
        res
          .status(200)
          .json({
            message: "updated sucessfully ",
            sucess: "true",
            data: userWithoutPassword,
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
    return res
      .status(500)
      .json({
        message: "something went wrong",
        sucess: "false",
        error: error.message,
      });
  }
};

// const type = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const type = await func.type(req);
//     if (type) {
//       const userWithoutPassword = await userModel
//         .findById(type._id)
//         .select("-password")
//         .lean();
//       await session.commitTransaction();
//       session.endSession();
//       return res
//         .status(200)
//         .json({ status: "sucess", Data: userWithoutPassword });
//     } else {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "having error in type " });
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: "something went wrong " });
//   }
// };

module.exports = {
  signUp,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  // type,
};
