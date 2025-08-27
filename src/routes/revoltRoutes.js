const express = require('express');
const revoltController = require('../controllers/revoltController');

const router = express.Router();

// GET /api/revolt/messages
router.get('/messages', revoltController.getMessages);

// GET /api/revolt/test
router.get('/test', revoltController.testConfiguration);

// GET /api/revolt/join
router.get('/join', revoltController.joinCommunity);

module.exports = router;
