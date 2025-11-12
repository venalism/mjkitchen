// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly'); // Admin middleware

// --- Routes for All Logged-in Users ---

// POST /api/orders (Place a new order)
router.post('/', auth, orderController.placeOrder);

// GET /api/orders/mine/:userId (Get orders for a specific user)
router.get('/mine/:userId', auth, orderController.getMyOrders);

// --- Routes for Admins Only ---

// GET /api/orders (Get all orders - for admin)
router.get('/', [auth, adminOnly], orderController.getAllOrders);

// PUT /api/orders/:id/status (Update order status - for admin)
router.put('/:id/status', [auth, adminOnly], orderController.updateOrderStatus);

// POST /api/orders/:id/payment (Process a payment - for admin)
router.post('/:id/payment', [auth, adminOnly], orderController.processPayment);

module.exports = router;