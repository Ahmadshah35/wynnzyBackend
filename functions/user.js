const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const signUp = async (decode) => {
  const hashPassword = await bcrypt.hash(decode.password, 10);
  const user = new userModel({
    email: decode.email,
    fullName: decode.fullName,
    password: hashPassword,
    type: decode.type,
  });
  const result = await user.save();
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

const isVerified = async (email) => {
  const verify = await userModel.findOneAndUpdate(
    { email: email },
    {
      $set: { isVerified: true },
    },
    { new: true }
  );
  return verify;
};


const resetPassword = async (email, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await userModel.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};

const verify = async (userId) => {
  const verify = await userModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true }
  );
  return verify;
};

const deleteUser = async (req) => {
  const { userId } = req.body;
  const result = await userModel.findByIdAndDelete({_id: userId});
  return result
};

const profileCreated = async (req) => {
    const { managerId } = req.body;
    const user = await userModel.findByIdAndUpdate({_id: managerId},
      { $set: { profileCreated: true }},
      { new: true }
    );
    return user
};

const updateUser = async (req) => {
  const { userId } = req.body;
  const updatedData = req.body
  console.log("first :", updatedData);
  if(req.file && req.file.filename){
      const imagePath = req.file.filename;
      const user = await userModel.findByIdAndUpdate({_id: userId}, 
        { $set: updatedData, profileImage: imagePath },
        { new: true }
      ).select("-password"); 
      return user;
  } else {
    const user = await userModel.findByIdAndUpdate({_id: userId}, 
      { $set: updatedData },
      { new: true}
    ).select("-password");
    return user
  }
};

const userProfile = async (req) => {
  const { userId } = req.query;
  const user = await userModel.findById(userId).select("-password");
  return user;
};

module.exports = {
  signUp,
  validiateEmail,
  getUser,
  resetPassword,
  comparePassword,
  isVerified,
  verify,
  deleteUser,
  profileCreated,
  updateUser,
  userProfile
};
