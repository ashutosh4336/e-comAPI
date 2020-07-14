const express = require('express');
const router = express.Router();
const multer = require('multer');

const { adminAuth, userAuth } = require('../middleware/check-auth');
const {
  getAllProducts,
  createOneProduct,
  listAllProductFromUser,
} = require('../controllers/products');

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

router.get('/', userAuth, getAllProducts);
router.post('/', adminAuth, upload.single('productImage'), createOneProduct);

router.get('/orders/:id', listAllProductFromUser);

module.exports = router;
