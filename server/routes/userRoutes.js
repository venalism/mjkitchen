// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Protect all routes
router.use(auth);

// --- ADMIN PROFILE ROUTES ---
router.get('/', [adminOnly], userController.getAllProfiles);
router.put('/:id', [adminOnly], userController.updateProfileById);
router.delete('/:id', [adminOnly], userController.deleteProfileById);

// --- ✨ NEW ADMIN ADDRESS ROUTES ---
// These routes allow admins to manage addresses for *any* user
router.get('/admin/:user_id/addresses', [adminOnly], userController.listAddresses);
router.post('/admin/:user_id/addresses', [adminOnly], userController.createAddress);
router.put('/admin/:user_id/addresses/:address_id', [adminOnly], userController.updateAddress);
router.delete('/admin/:user_id/addresses/:address_id', [adminOnly], userController.deleteAddress);


// --- USER PROFILE ROUTES ---
// (No changes here)
router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);
router.delete('/me', userController.deleteMe); // From previous step

// --- ✨ REFACTORED USER ADDRESS ROUTES ---
// These routes *only* affect the currently logged-in user
router.get('/me/addresses', userController.listAddresses);
router.post('/me/addresses', userController.createAddress);
router.put('/me/addresses/:address_id', userController.updateAddress);
router.delete('/me/addresses/:address_id', userController.deleteAddress);

module.exports = router;