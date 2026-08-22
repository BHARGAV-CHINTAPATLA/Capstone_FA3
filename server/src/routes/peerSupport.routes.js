const express = require('express');
const router = express.Router();
const { getPeers } = require('../controllers/peerSupport');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/peer-support/users', authenticateJWT, getPeers);

module.exports = router;
