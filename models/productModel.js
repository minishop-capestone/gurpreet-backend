const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
