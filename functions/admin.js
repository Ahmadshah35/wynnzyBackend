const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");

const signUpAdmin = async (req) => {
  const { password } = req.body;
  const admin = new adminModel(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  admin.password = hashPassword;
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otp = genOtp;
  const result = await admin.save();
  return result;
};

const validiateAdminEmail = async (req) => {
  const { email } = req.body;
  const admin = await adminModel.findOne({ email: email });
  return admin;
};

const getAdmin = async (id) => {
  const admin = await adminModel.findById(id);
  return admin;
};

const comparePassword = async (password, hashPassword) => {
  const compare = await bcrypt.compare(password, hashPassword);
  return compare;
};


const isVerifiedAdmin = async (email) => {
  const verify = await adminModel.findOneAndUpdate(
    { email: email },
    {
      $set: { isVerified: true },
    },
    { new: true }
  );
  return verify;
};

const verifyAdminOtp = async (req) => {
  const { Otp, email } = req.body;
  const verify = await adminModel.findOne({ email: email, otp: Otp })
  return verify;
};

const resendAdminOtp = async (email) => {
  const admin = await adminModel
    .findOne({ email }, { new: true })
  if (!admin) {
    throw new Error("admin not found");
  }
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otp = genOtp;

  await admin.save();
  return admin;
};

const passwordAdminOtp = async (email) => {
  const admin = await adminModel.findOne({ email: email });
  const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otp = genOtp;
  const result = await admin.save();
  return result;
};

const resetAdminPassword = async (email, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await adminModel.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};

const verifyAdmin = async (userId) => {
  const verify = await adminModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true }
  );
  return verify;
};

const updateAdminEmail = async (id, email) => {
  const admin = await adminModel.findByIdAndUpdate(
    id,
    {
      $set: { email: email },
    },
    { new: true }
  );
  return admin;
};
 
module.exports = {
  signUpAdmin,
  validiateAdminEmail,
  verifyAdmin,
  verifyAdminOtp,
  comparePassword,
  resetAdminPassword,
  passwordAdminOtp,
  resendAdminOtp,
  isVerifiedAdmin,
  getAdmin,
  updateAdminEmail,
};
