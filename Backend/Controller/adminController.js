const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        let admin = await Admin.findOne({ email });

        // Auto-Seed an admin if none exists (Helpful for fresh deployments/tests)
        if (!admin && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            admin = await Admin.create({ email, password: hashedPassword });
        }

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid Admin Credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const User = require('../models/UserModel');
        const Order = require('../models/OrderModel');

        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find();
        const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        res.json({ totalUsers, totalOrders, revenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    adminLogin,
    getDashboardStats
};