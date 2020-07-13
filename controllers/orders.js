const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAllOrders = (req, res, next) => {
  if (req.userData.userType == 'user') {
    // console.log(req.userData);
    Order.find({ user: req.userData.userId })
      .select()
      .sort('-created_at')
      .populate({
        path: 'product',
        populate: {
          path: 'category',
        },
      })
      .populate('user')
      .exec()
      .then((orders) => {
        return res.status(200).json({
          count: orders.length,
          orders: orders,
        });
      })
      .catch((error) => {
        next(error);
      });
    return;
  }

  let o;
  if (req.userData.userType == 'admin' && req.query.all) {
    o = Order.find();
  } else {
    o = Order.find({ user: req.userData.userId });
  }

  o.select()
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .populate('user')
    .sort('-created_at')
    .exec()
    .then((orders) => {
      res.status(200).json({
        count: orders.length,
        orders: orders,
      });
    })
    .catch((error) => {
      next(error);
    });
};

// exports.getAllOrdersForUser = async (req, res, next) {}

exports.saveOrders = (req, res, next) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let address = req.body.address;

  // console.log(req.body.products);

  let carts;
  try {
    carts = JSON.parse(JSON.stringify(req.body.products));
    if (!firstName.trim() || !lastName.trim() || !address.trim()) {
      res.status(400);
      res.json({
        error: {
          message: 'firstName , lastName , address Required..',
        },
      });
      return;
    }
  } catch (error) {
    res.status(400);
    if (!carts) {
      res.json({
        error: {
          message: 'Products Required..',
        },
      });
      return;
    }
    res.json({
      error: {
        message: 'firstName , lastName , address Required..',
      },
    });
    return;
  }

  let orders = [];
  for (let i = 0; i < carts.length; i++) {
    orders.push(createOrder(req, carts[i], firstName, lastName, address));
  }

  Order.create(orders)
    .then((orders) => {
      return res.status(201).json({
        message: 'Orders was created',
        orders,
      });
    })
    .catch((error) => {
      next(error);
    });
};

function createOrder(req, productInfo, firstName, lastName, address) {
  return new Order({
    _id: mongoose.Types.ObjectId(),
    product: productInfo.productId,
    quantity: productInfo.quantity,
    price: productInfo.price,
    user: req.userData.userId,
    firstName,
    lastName,
    address,
  });
}

async function getTotalOrdersCount() {
  return Order.aggregate([
    {
      $count: 'orderCount',
    },
  ]).then((r) => {
    console.log(r);

    return r[0].orderCount;
  });
}
