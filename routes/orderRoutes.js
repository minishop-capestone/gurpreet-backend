const express = require('express');
const { getOrdersByUserId, getAllOrders } = require('../controllers/orderController');
const router = express.Router();

router.get('/user/:userId', getOrdersByUserId);
router.get('/all', getAllOrders);

module.exports = router;
