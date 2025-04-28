import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authoriztion &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get tocken from header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //attach user info to request
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorised,token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorised, no token" });
  }
};
export default protect;
