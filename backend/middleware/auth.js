const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, "meow");
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      res.send(`Error:${err.message}`);
    }
  }
};
module.exports = protect;
