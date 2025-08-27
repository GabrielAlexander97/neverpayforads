const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Send magic login link
router.post('/magic/send', authController.sendMagicLink);

// Verify magic login link
router.get('/magic/verify', authController.verifyMagicLink);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
