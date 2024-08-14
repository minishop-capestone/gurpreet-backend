const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel'); // Import the Product model

// Create a new checkout session
router.post('/create-checkout-session', async (req, res) => {
    const { items, userId } = req.body;

    const transformedItems = items.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.total * 100),
        },
        quantity: item.quantity,
    }));

    try {
        const order = new Order({
            user: userId,
            cartItems: items.map(item => ({
                product: item._id,
                qty: item.quantity,
                price: item.total,
            })),
            totalPrice: items.reduce((acc, item) => acc + item.total, 0),
            isPaid: false,
        });

        const savedOrder = await order.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: transformedItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                order_id: savedOrder._id.toString()
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/update-order', async (req, res) => {
    const { sessionId, orderId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: session.payment_intent,
                    status: session.payment_status,
                    update_time: session.created,
                    email_address: session.customer_details.email,
                };

                // Update inventory for each product in the order
                for (const item of order.cartItems) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        if (product.inventory >= item.qty) {
                            product.inventory -= item.qty;
                            await product.save();
                        } else {
                            console.error(`Insufficient inventory for product ${product.name}`);
                        }
                    } else {
                        console.error(`Product not found: ${item.product}`);
                    }
                }

                await order.save();
                return res.status(200).json({ message: 'Order updated successfully' });
            }
        }

        res.status(400).json({ message: 'Order update failed' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
