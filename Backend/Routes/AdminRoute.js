const express = require('express');
const router = express.Router();
const { adminLogin, getDashboardStats } = require('../Controller/adminController');
const { adminProtect } = require('../middleware/authMiddleware');

// Get all Users (for admin panel)
const User = require('../models/UserModel');
router.get('/users', adminProtect, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', adminLogin);
router.get('/dashboard-stats', adminProtect, getDashboardStats);

module.exports = router;