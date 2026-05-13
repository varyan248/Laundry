const express = require('express');
const router = express.Router();
const { getServices, createService, deleteService } = require('../Controller/serviceController');
const { adminProtect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getServices)
    .post(adminProtect, createService);

router.route('/:id')
    .delete(adminProtect, deleteService);

module.exports = router;
