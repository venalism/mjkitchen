// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth'); // Our auth middleware

// All order routes are protected
router.use(auth);

// POST /api/orders (Place a new order)
router.post('/', orderController.placeOrder);

// GET /api/orders (Get all orders - for admin)
router.get('/', orderController.getAllOrders);

// GET /api/orders/mine/:userId (Get orders for a specific user)
router.get('/mine/:userId', orderController.getMyOrders);

// PUT /api/orders/:id/status (Update order status - for admin)
router.put('/:id/status', orderController.updateOrderStatus);

// POST /api/orders/:id/payment (Process a payment - for admin)
router.post('/:id/payment', orderController.processPayment);

module.exports = router;