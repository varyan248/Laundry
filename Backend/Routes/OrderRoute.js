const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, updateOrderStatus } = require('../Controller/orderController');
const { protect, adminProtect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createOrder)
    .get(adminProtect, getOrders); // admin can get all

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(adminProtect, updateOrderStatus);

module.exports = router;