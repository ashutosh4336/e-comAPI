const express = require('express');
const router = express.Router();

const { userAuth, authorize } = require('../middleware/auth');

const {
  getAllUser,
  getSingleUser,
  createUserByAdmin,
  loginUserAndAdmin,
  getMe,
  logOut,
} = require('../controllers/user');

router.get('/', userAuth, authorize('admin'), getAllUser);
router.get('/me', userAuth, getMe);
router.get('/logout', logOut);
router.get('/:id', userAuth, authorize('admin'), getSingleUser);
router.post('/', userAuth, authorize('admin'), createUserByAdmin);
router.post('/login', loginUserAndAdmin);

module.exports = router;
