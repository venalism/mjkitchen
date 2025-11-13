// server/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly'); // Admin middleware

// --- Public Routes ---
router.get('/categories', menuController.getCategories);
router.get('/items', menuController.getMenu);
router.get('/items/:id', menuController.getMenuById);

// --- Protected (Admin) Routes ---

// We chain the middleware: first check for login (auth), then check for admin (adminOnly)
router.post('/items', [auth, adminOnly], menuController.createMenu);
router.put('/items/:id', [auth, adminOnly], menuController.updateMenu);
router.delete('/items/:id', [auth, adminOnly], menuController.deleteMenu);

router.post('/categories', [auth, adminOnly], menuController.createCategory);
router.put('/categories/:id', [auth, adminOnly], menuController.updateCategory);
router.delete('/categories/:id', [auth, adminOnly], menuController.deleteCategory);

router.post('/:menu_id/gallery', [auth, adminOnly], menuController.addGalleryImage);
router.put('/gallery/:gallery_id', [auth, adminOnly], menuController.updateGalleryImage);
router.delete('/gallery/:gallery_id', [auth, adminOnly], menuController.deleteGalleryImage);

module.exports = router;