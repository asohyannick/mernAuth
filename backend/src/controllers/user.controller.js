import asyncHandler from "express-async-handler";
import User from '../models/user.model.js';
import { StatusCodes } from "http-status-codes";
import generateToken from "../utils/generateToken.js";
// @desc Auth user/set token
// route POST /api/user/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({ email });

  if(user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Invalid email or password credentials");
  }
});

// @desc Auth user/set token
// route POST /api/user/users
// @access Public
const registerUser = asyncHandler(async (req, res ) => {
  const {name, email, password} = req.body;
  const userExists = await User.findOne({email});
  if(userExists) {
    res.status(400);
    throw new Error('User already exist');
  }
  const user = await User.create({
    name,
    email,
    password
  });
  if(user) {
    generateToken(res, user._id);
    res.status(StatusCodes.CREATED).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    res.status(400)
    throw new Error("Invalid user credentials");
  }
});

// @desc Auth user/set token
// route POST /api/user/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('access_token', '', {
    httpOnly: true,
    expires: true,
    expires: new Date(0)
  });
  res.status(StatusCodes.OK).json({ message: "User logged out successfully" });
});
// @desc Get user profile
// route POST /api/user/profile
// @access Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }
  res.status(StatusCodes.OK).json(user);
});
// @desc Auth user/set token
// route POST /api/user/profle
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if(user) {
    user.name = req.body.name  || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email:updatedUser.email,
    })
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }
});
// @desc Auth user/set token
// route POST /api/user/delete
// @access Public
const deleteUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if(user) {
    await User.findByIdAndDelete(user._id);
    res.status(StatusCodes.OK).json('User has been deleted succesfully!');
  } else {
    throw new Error('User not found!')
  }
});
export default {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};


