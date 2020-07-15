const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const { response } = require('express');

// exports.isAdmin = (req, res, next) => {
//   if (req.userData.userType === 'admin') return res.json(true);
//   else return res.json(false);
// };

// @desc        list All Users
// @route       Get /api/users
// @access      Private
exports.getAllUser = async (req, res, next) => {
  try {
    const getCurUser = await User.find();
    console.log(getCurUser);
    res.status(200).json({
      success: true,
      data: getCurUser,
    });
  } catch (err) {
    next(err);
  }
};

// @desc        list Single Users
// @route       Get /api/users/:id
// @access      Private
exports.getSingleUser = async (req, res, next) => {
  try {
    const getCurUser = await User.findById(req.params.id);
    // console.log(getCurUser);
    if (!getCurUser) {
      return next(
        new ErrorResponse(`User Not Found with ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: getCurUser,
    });
  } catch (err) {
    return next(
      new ErrorResponse(`No User with the ID of ${req.params.id}`),
      404
    );
  }
};

// @desc        Create Single User
// @route       POST /api/users/create
// @access      Private
exports.createUserByAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    // console.log(req.body);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(`s${err.message}`, 401));
  }
};

// @desc        Login User
// @route       POST /api/users/login
// @access      Public
exports.loginUserAndAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

    if (!email || !password) {
      return next(new ErrorResponse('Please Provide Email and Password', 400));
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);

    if (!user) return next(new ErrorResponse('Invalid Credentials', 401));

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) return next(new ErrorResponse('Invalid Credentials', 401));

    // const token = user.getSignedJwtToken();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse(`${err.message}`, 500));
  }
};

// Get token from Model, craete Cookie and Send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  console.log(options);
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// @desc        Get Current User
// @route       POST /api/users/login
// @access      Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(`${err.message}`, 500));
  }
};
// @desc        Log User Out / Clear cookie
// @route       GET /api/users/logout
// @access      Private
exports.logOut = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      msg: 'User logged Out',
    });
  } catch (err) {
    return next(new ErrorResponse(`${err.message}`, 500));
  }
};
