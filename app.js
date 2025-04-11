const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const connectDb = require("./config/configDb");
PORT = process.env.PORT;

const userRouter = require("./route/user");
const petRouter=require("./route/pet")
const managerRouter=require("./route/manager")
const bProfileRouter=require("./route/bProfile")
const serviceRouter=require("./route/service")
const reviewRouter=require("./route/review")
const locationRouter=require("./route/location")
const bookingRouter=require("./route/booking")
const adminRouter=require("./route/admin")

const bodyparser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use("/api", userRouter);
app.use("/api", petRouter);
app.use("/api", managerRouter);
app.use("/api", bProfileRouter);
app.use("/api",serviceRouter );
app.use("/api", reviewRouter);
app.use("/api",locationRouter );
app.use("/api", bookingRouter);
app.use("/api", adminRouter);

const start = () => {
  try {
    connectDb();
    app.listen(PORT, () => {
      console.log(`Server started on Port:${PORT}`);
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};
 
start();
