const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, processPayment } = require('../controllers/orderController');

// Customer
router.post('/', auth, placeOrder);
router.get('/mine/:userId', auth, getMyOrders);

// Vendor/Admin
router.get('/', auth, getAllOrders);
router.put('/:id/status', auth, updateOrderStatus);
router.post('/:id/payment', auth, processPayment);

module.exports = router;

