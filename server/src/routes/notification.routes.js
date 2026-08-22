const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/notification');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/notifications/subscribe', authenticateJWT, subscribe);
router.delete('/notifications/subscribe', authenticateJWT, unsubscribe);

module.exports = router;
