const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all Product
// @route       GET /api/produscts
// @access      Private
exports.getAllProducts = async (req, res, next) => {
  try {
    let allProduct = await Product.find();
    if (!allProduct) {
      return next(
        new ErrorResponse(`No Course with the ID of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      msg: allProduct,
    });
  } catch (err) {
    next(error);
  }
};

// @desc        Create Product
// @route       POST /api/produscts
// @access      Private

exports.createOneProduct = async (req, res, next) => {
  try {
    // console.log(req.body);
    const product = {
      name: req.body.name,
      price: req.body.price,
      productImage: req.body.image,
    };
    const createdProduct = await Product.create(product);
    res.status(200).json({
      success: true,
      data: createdProduct,
    });
  } catch (err) {
    next(err);
  }
};

// @desc        list Purchased Products from a User
// @route       Get /api/produscts
// @access      Private

exports.listAllProductFromUser = async (req, res, next) => {
  try {
    const getCurUser = await User.findById(req.params.id);
    // console.log(getCurUser.purchase);
    // TODO:
    if (!getCurUser) {
      return next(
        new ErrorResponse(`No User with the ID of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      data: getCurUser.purchase,
    });
  } catch (err) {
    return next(
      new ErrorResponse(`No User with the ID of ${req.params.id}`),
      404
    );
  }
};
