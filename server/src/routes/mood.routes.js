const express = require('express');
const router = express.Router();
const { trackMood, getMoodHistory } = require('../controllers/mood');
const authenticateJWT = require('../middleware/authenticateJWT');
const { validateMood } = require('../middleware/validateRequest');

router.post('/mood-tracking', authenticateJWT, validateMood, trackMood);
router.get('/mood-history', authenticateJWT, getMoodHistory);

module.exports = router;
