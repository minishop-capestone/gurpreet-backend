const Order = require('../models/orderModel');

// Fetch all orders by user ID
const getOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ user: userId }).populate('user').populate('cartItems.product');

    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('cartItems.product');

    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getOrdersByUserId,
  getAllOrders
};