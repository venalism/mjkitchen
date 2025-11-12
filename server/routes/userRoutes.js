const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  bootstrapProfile,
  getMe,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/userController');

router.post('/bootstrap', auth, bootstrapProfile);
router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);

router.get('/:user_id/addresses', auth, listAddresses);
router.post('/:user_id/addresses', auth, createAddress);
router.put('/:user_id/addresses/:address_id', auth, updateAddress);
router.delete('/:user_id/addresses/:address_id', auth, deleteAddress);

module.exports = router;

