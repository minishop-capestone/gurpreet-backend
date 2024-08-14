const Product = require('../models/productModel');

const addReview = async (req, res) => {
  const { productId } = req.params;
  const { username, comment, star } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = { username, comment, star };
    product.reviews.push(newReview);

    // Calculate the new average rating
    const totalStars = product.reviews.reduce((acc, review) => acc + review.star, 0);
    product.rating = totalStars / product.reviews.length;
    product.reviewsCount = product.reviews.length;

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview };
