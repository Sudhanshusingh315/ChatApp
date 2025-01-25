import jwt from "jsonwebtoken";
import { configFile } from "../constants.config.js";
// middleware for protection

export default function protectedMiddleware(req, res, next) {
  try {
    let token = req.headers["authorization"];
    token = token.split(" ")[1];
    if (token === null) {
      throw new Error("can not find token, login again");
    }
    if (!token) {
      throw new Error("Not Authorized, Login");
    }
    const decoded = jwt.verify(token,configFile.jwtSecrete);
    req.body.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      msg: err.message,
    });
  }
}
