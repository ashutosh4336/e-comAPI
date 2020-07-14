const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/auth');
// const { userAuth, adminAuth } = require('../middleware/check-auth');
// const { getAllOrders, saveOrders } = require('../controllers/orders');

const { getAllProducts } = require('../controllers/products');

router.route('/').get(userAuth, getAllProducts);

module.exports = router;
