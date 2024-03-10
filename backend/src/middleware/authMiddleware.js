import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error('Not authorized, no token');
    }
  }
});
export {
    protect
};
