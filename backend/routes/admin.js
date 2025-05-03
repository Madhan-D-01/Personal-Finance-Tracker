const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;