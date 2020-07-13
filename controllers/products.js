const mongoose = require('mongoose');
const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  try {
    let allProduct = await Product.find();
    res.status(200).json({
      success: true,
      msg: allProduct,
    });
  } catch (err) {
    next(error);
  }
};

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
