const express = require('express');
const router = express.Router();
const checkAuths = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.logIn);
router.get('/is-admin', checkAuths.userAuth, UserController.isAdmin);

module.exports = router;
