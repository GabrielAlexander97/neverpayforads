const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Shopify orders/paid webhook
router.post('/shopify/orders', webhookController.handleOrderPaid);

module.exports = router;
