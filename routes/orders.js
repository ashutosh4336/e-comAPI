const express = require('express');
const router = express.Router();

const { userAuth } = require('../middleware/auth');
const { listAllOrderFromUser } = require('../controllers/orders');

router.get('/', userAuth, listAllOrderFromUser);

module.exports = router;
