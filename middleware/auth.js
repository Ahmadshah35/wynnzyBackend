const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

      req.user = await userModel.findById(userId).select("-password");

      next();
    } catch (error) {
      res
        .status(300)
        .json({ status: "failed", message: "Unauthorized User,No token" });
    }
  }
  if (!token) {
    res
      .status(401)
      .json({ status: "failed", message: "Unauthorized User,No token" });
  }
};

module.exports = userAuth;
