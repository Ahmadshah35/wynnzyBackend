const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DB Connected");
  } catch (error) {
    console.log("Unsucessful", error);
  }
};
module.exports = connectDb;
