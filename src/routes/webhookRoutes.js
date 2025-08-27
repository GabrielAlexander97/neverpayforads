const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Test endpoint to verify webhook URL is accessible
router.get('/shopify/test', webhookController.testWebhook);

// Shopify orders/paid webhook
router.post('/shopify/orders', webhookController.handleOrderPaid);

module.exports = router;
