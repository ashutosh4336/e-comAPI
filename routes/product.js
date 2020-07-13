const express = require('express');
const router = express.Router();
const multer = require('multer');

const auths = require('../middleware/check-auth');
const { getAllProducts, createOneProduct } = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.get('/', auths.userAuth, getAllProducts);

router.post(
  '/',
  auths.adminAuth,
  upload.single('productImage'),
  createOneProduct
);

module.exports = router;
