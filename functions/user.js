const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const signUp = async (req, session) => {
  const { password } = req.body;
  const user = new userModel(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user.password = hashPassword;
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = genOtp;
  const result = await user.save({ session });
  return result;
};

const validiateEmail = async (req) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  return user;
};

const getUser = async (req) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  return user;
};

const comparePassword = async (password, hashPassword) => {
  const compare = await bcrypt.compare(password, hashPassword);
  return compare;
};

const isVerified = async (email, session) => {
  const verify = await userModel.findOneAndUpdate(
    { email: email },
    {
      $set: { isVerified: true },
    },
    { new: true, session }
  );
  return verify;
};

const verifyOtp = async (req, session) => {
  const { Otp, email } = req.body;
  const verify = await userModel
    .findOne({ email: email, otp: Otp })
    .session(session);
  return verify;
};

const resendOtp = async (email, session) => {
  const user = await userModel
    .findOne({ email }, { new: true })
    .session(session);
  if (!user) {
    throw new Error("User not found");
  }
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = genOtp;

  await user.save({ session });
  return user;
};

const passwordOtp = async (email, session) => {
  const user = await userModel.findOne({ email: email });
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = genOtp;
  const result = await user.save({ session });
  return result;
};

const resetPassword = async (email, newPassword, session) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await userModel.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true, session }
  );
  return resetPassword;
};

const verify = async (userId, session) => {
  const verify = await userModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true, session }
  );
  return verify;
};

// const type = async (req, session) => {
//   const { id, type } = req.body;
//   const types = await userModel.findOneAndUpdate(
//     { _id: id },
//     { $set: { type: type } },
//     { new: true, session }
//   );
//   return types;
// };

module.exports = {
  signUp,
  validiateEmail,
  getUser,
  resetPassword,
  comparePassword,
  isVerified,
  verifyOtp,
  resendOtp,
  passwordOtp,
  // type,
  verify,
};
