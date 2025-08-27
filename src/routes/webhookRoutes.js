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

// Timeout middleware for webhooks (10 seconds)
const timeoutMiddleware = (req, res, next) => {
    const timeout = setTimeout(() => {
        console.log('⏰ Webhook timeout - responding 200 to prevent retries');
        res.status(200).json({
            success: false,
            message: 'Webhook timeout - processing may continue in background'
        });
    }, 10000); // 10 seconds

    res.on('finish', () => {
        clearTimeout(timeout);
    });

    next();
};

// Test endpoint to verify webhook URL is accessible
router.get('/shopify/test', webhookController.testWebhook);

// Shopify orders/paid webhook - uses raw body for HMAC verification with timeout
router.post('/shopify/orders', timeoutMiddleware, rawBodyMiddleware, webhookController.handleOrderPaid);

module.exports = router;
