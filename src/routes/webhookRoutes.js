const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Raw body parsing middleware for webhook verification
const rawBodyMiddleware = express.raw({
    type: 'application/json',
    limit: '10mb'
});

// Test endpoint to verify webhook URL is accessible
router.get('/shopify/test', webhookController.testWebhook);

// Shopify orders/paid webhook - uses raw body for HMAC verification
router.post('/shopify/orders', rawBodyMiddleware, webhookController.handleOrderPaid);

module.exports = router;
