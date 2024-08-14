require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.processPayment = async (req, res) => {
  const { paymentMethodId, cartItems, userId } = req.body;
  const amount = cartItems.reduce((acc, item) => acc + item.total, 0) * 100; 
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });

    const order = new Order({
      user: userId,
      cartItems: cartItems.map(item => ({
        product: item._id,
        qty: item.quantity,
        price: item.total
      })),
      totalPrice: amount / 100,
      isPaid: true,
      paidAt: new Date()
    });

    await order.save();

    // Update inventory
    await Promise.all(cartItems.map(async (item) => {
      await Product.findByIdAndUpdate(item._id, { $inc: { inventory: -item.quantity } });
    }));

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.raw.message });
  }
};
