const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');

// Public
router.get('/categories', getCategories);
router.get('/items', getMenu);
router.get('/items/:id', getMenuById);

// Protected (vendor/admin)
router.post('/categories', auth, createCategory);
router.put('/categories/:id', auth, updateCategory);
router.delete('/categories/:id', auth, deleteCategory);

router.post('/items', auth, createMenu);
router.put('/items/:id', auth, updateMenu);
router.delete('/items/:id', auth, deleteMenu);

module.exports = router;

