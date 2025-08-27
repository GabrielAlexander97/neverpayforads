const express = require('express');
const meController = require('../controllers/meController');

const router = express.Router();

// Get current user status
router.get('/', meController.getMe);

module.exports = router;
