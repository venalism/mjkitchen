// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// --- Profile routes ---
router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);

// --- Address routes ---
router.get('/:user_id/addresses', userController.listAddresses);
router.post('/:user_id/addresses', userController.createAddress);
router.put('/:user_id/addresses/:address_id', userController.updateAddress);
router.delete('/:user_id/addresses/:address_id', userController.deleteAddress);

module.exports = router;