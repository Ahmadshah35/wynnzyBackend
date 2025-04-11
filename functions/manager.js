const userModel = require("../models/user");

const createManager = async (req, session) => {
  const manager = new userModel(req.body);
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: "file must be needed" });
  }
  manager.image = req.file.path;
  const result = await manager.save(session);
  return result;
};

const updateManager = async (id, userData, session) => {
  const manager = await userModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true, session }
  );
  return manager;
};

const deleteManager = async (id) => {
  const manager = await userModel.findByIdAndDelete(id, { new: true });
  return manager;
};

const getManager = async (id) => {
  const manager = await userModel.findById(id);
  return manager;
};

module.exports = {
  createManager,
  updateManager,
  deleteManager,
  getManager,
};
