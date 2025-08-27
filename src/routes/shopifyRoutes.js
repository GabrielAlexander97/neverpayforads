const express = require('express');
const shopifyController = require('../controllers/shopifyController');

const router = express.Router();

// GET /api/shopify-data
router.get('/data', shopifyController.getShopData);

module.exports = router;
