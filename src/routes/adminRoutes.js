const express = require('express');
const adminController = require('../controllers/adminController');
const config = require('../config');

const router = express.Router();

// Basic auth middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [username, password] = credentials.split(':');

    if (password !== config.app.adminPassword) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    next();
};

// Apply basic auth to all admin routes
router.use(basicAuth);

// Admin routes
router.get('/users', adminController.getUsers);
router.post('/users/:email/extend30', adminController.extendMembership);
router.post('/users/:email/deactivate', adminController.deactivateUser);
router.post('/users/:email/resend-magic', adminController.resendMagicLink);
router.get('/webhooks', adminController.getWebhookLogs);

module.exports = router;
