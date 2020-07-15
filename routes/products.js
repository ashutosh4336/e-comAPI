const express = require('express');
const router = express.Router();

// Import Middlewares and COntrollers
const { userAuth, authorize } = require('../middleware/auth');
const {
  getAllProducts,
  createOneProduct,
  getSingleProdDeatil,
  productPhotoUpload,
} = require('../controllers/products');

// Set Rouets
router.get('/', userAuth, getAllProducts);
router.put('/:id/photo', userAuth, authorize('admin'), productPhotoUpload);
router.get('/:id', userAuth, getSingleProdDeatil);
router.post('/', userAuth, authorize('admin'), createOneProduct);
module.exports = router;
