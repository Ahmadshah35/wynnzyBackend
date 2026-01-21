const { default: mongoose } = require("mongoose");
const func = require("../functions/otp");
const jwt = require("jsonwebtoken");
const userFunc = require("../functions/user");
const mailer = require("../helper/mailer");

const verifyOtp = async (req, res) => {
  try {
    const verify = await func.verifyOtp(req);
    if (verify) {
      const { addSignUpToken } = req.body;
        const decode = jwt.verify(addSignUpToken, process.env.JWT_SECRET_TOKEN);
        const user = await userFunc.signUp(decode);
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            type: user.type,
          },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "1y" }
        );

        res.status(200).json({
          message: "successfully verify",
          success: true,
          data: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            type: user.type,
          },
          accessToken: token,
        });

        return;
      
    } else {
      res.status(200).json({ message: "invalid Otp", success: false });
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

const resendOtp = async (req, res) => {
  try {
    const resendOtp = await func.resendOtp(req);
    if (!resendOtp) {
      const email = req.body.email;
      const gen = await func.generateOtp(email);
      const userData = {
        email: req.body.email,
        Otp: gen.otp,
      };
      const send = await mailer.sendMail(userData);
      res
        .status(200)
        .json({ message: "successfully sent", success: true, data: userData });
    } else {
      res.status(200).json({ message: "already sent", success: false });
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
  verifyOtp,
  resendOtp,
};
