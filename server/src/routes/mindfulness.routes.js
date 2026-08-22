const express = require('express');
const router = express.Router();
const { getExercises } = require('../controllers/mindfulness');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/mindfulness-exercises', authenticateJWT, getExercises);

module.exports = router;
