// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly'); // ✨ Import adminOnly

// Protect all routes
router.use(auth);

// --- ✨ NEW ADMIN ROUTES ---
// Must come before '/me' and other dynamic routes
router.get('/', [adminOnly], userController.getAllProfiles);
router.put('/:id', [adminOnly], userController.updateProfileById);
router.delete('/:id', [adminOnly], userController.deleteProfileById);

// --- Profile routes ---
router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);

// --- Address routes ---
router.get('/:user_id/addresses', userController.listAddresses);
router.post('/:user_id/addresses', userController.createAddress);
router.put('/:user_id/addresses/:address_id', userController.updateAddress);
router.delete('/:user_id/addresses/:address_id', userController.deleteAddress);

module.exports = router;