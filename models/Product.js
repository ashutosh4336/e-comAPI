const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide Product name'],
  },
  // description: {
  //   type: String,
  //   required: [true, 'Please add the description of the Product'],
  // },
  price: {
    type: Number,
    required: [true, 'Please provide the Price of the Product'],
  },

  photo: {
    type: String,
    default: 'no-photo.jpg',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
