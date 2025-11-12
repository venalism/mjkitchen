// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Our auth middleware

// All user routes are protected
router.use(auth);

// POST /api/users/bootstrap (Syncs Supabase auth user with our DB)
router.post('/bootstrap', userController.bootstrapProfile);

// GET /api/users/me (Get current user's profile)
router.get('/me', userController.getMe);

// PUT /api/users/me (Update current user's profile)
router.put('/me', userController.updateProfile);

// --- Address Routes ---

// GET /api/users/:user_id/addresses
router.get('/:user_id/addresses', userController.listAddresses);

// POST /api/users/:user_id/addresses
router.post('/:user_id/addresses', userController.createAddress);

// PUT /api/users/:user_id/addresses/:address_id
router.put('/:user_id/addresses/:address_id', userController.updateAddress);

// DELETE /api/users/:user_id/addresses/:address_id
router.delete('/:user_id/addresses/:address_id', userController.deleteAddress);

module.exports = router;