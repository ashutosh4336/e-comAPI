const mongoose = require('mongoose');
const path = require('path');
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
        new ErrorResponse(`No Course with the ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      msg: allProduct,
    });
  } catch (err) {
    return next(
      new ErrorResponse(`No Course with the ID of ${req.params.id}`, 404)
    );
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
    return next(
      new ErrorResponse(`No Course with the ID of ${req.params.id}`, 404)
    );
  }
};

// @desc        Get a Single Product Details
// @route       Get /api/produscts/:id
// @access      Private
exports.getSingleProdDeatil = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product);
    res.status(200).json({
      success: true,
      msg: product,
    });
  } catch (err) {
    return next(
      new ErrorResponse(`No product with the ID of ${req.params.id}`, 404)
    );
  }
};

// @desc        Upload Photo
// @route       PUT api/products/:id/photo
// @access      Private
exports.productPhotoUpload = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product Not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  // console.log(req.files);
  const file = req.files.file;

  // makesure image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please Upload a Image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an Image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // craete custom file name
  file.name = `photo_${file.md5}${path.parse(file.name).ext}`;
  // console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Something went wrong`, 500));
    }

    await Product.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
};
