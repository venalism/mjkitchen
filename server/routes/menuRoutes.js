// server/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth'); // Our auth middleware

// --- Public Routes ---

// GET /api/menu/categories
router.get('/categories', menuController.getCategories);

// GET /api/menu/items
router.get('/items', menuController.getMenu);

// GET /api/menu/items/:id
router.get('/items/:id', menuController.getMenuById);


// --- Protected (Admin) Routes ---
// These routes require a valid token.
// We can add admin-specific role checks later if needed.

// POST /api/menu/items
router.post('/items', auth, menuController.createMenu);

// PUT /api/menu/items/:id
router.put('/items/:id', auth, menuController.updateMenu);

// DELETE /api/menu/items/:id
router.delete('/items/:id', auth, menuController.deleteMenu);

// Category admin routes
router.post('/categories', auth, menuController.createCategory);
router.put('/categories/:id', auth, menuController.updateCategory);
router.delete('/categories/:id', auth, menuController.deleteCategory);

module.exports = router;