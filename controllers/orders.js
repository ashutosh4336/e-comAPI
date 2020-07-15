const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// TODO: Create Order (Buy Order)

// @desc        list Purchased Products from a User [Purcahsed]
// @route       Get /api/produscts
// @access      Private

exports.listAllOrderFromUser = async (req, res, next) => {
  try {
    let productData = [];
    const getCurUser = await User.findById(req.user);

    if (!getCurUser) {
      return next(new ErrorResponse(`Something Went Wrong....`, 404));
    }

    // TODO: - Partial complete
    for (let i of getCurUser.purchase) {
      const products = await Product.findById(i);
      // console.log(products);
      productData.push(products);
    }
    res.status(200).json({
      success: true,
      data: productData,
    });
  } catch (err) {
    return next(new ErrorResponse(`Something Went Wrong`, 404));
  }
};
