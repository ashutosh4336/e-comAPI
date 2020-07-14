const express = require('express');
const router = express.Router();
// const checkAuths = require('../middleware/check-auth');

const { userAuth, authorize } = require('../middleware/auth');

const {
  getAllUser,
  getSingleUser,
  createUserByAdmin,
  loginUserAndAdmin,
  getMe,
} = require('../controllers/user');

// router.get('/is-admin', checkAuths.userAuth, UserController.isAdmin);
router.get('/', authorize, getAllUser);
router.get('/me', userAuth, getMe);
router.get('/:id', authorize, getSingleUser);
router.post('/', userAuth, authorize('admin'), createUserByAdmin);
router.post('/login', loginUserAndAdmin);

module.exports = router;
