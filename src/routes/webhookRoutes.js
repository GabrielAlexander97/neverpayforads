const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Custom raw body middleware for webhook verification
const rawBodyMiddleware = (req, res, next) => {
    let data = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        req.rawBody = data;
        next();
    });
};

// Test endpoint to verify webhook URL is accessible
router.get('/shopify/test', webhookController.testWebhook);

// Shopify orders/paid webhook - uses raw body for HMAC verification
router.post('/shopify/orders', rawBodyMiddleware, webhookController.handleOrderPaid);

module.exports = router;
