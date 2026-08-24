const express = require('express');
const router = express.Router();
const mindfulnessService = require('../services/mindfulnessService');
const authenticateJWT = require('../utilities/authenticateJWT');
const asyncHandler = require('../utilities/asyncHandler');

router.get('/mindfulness-exercises', authenticateJWT, asyncHandler(async (req, res) => {
  const formattedExercises = await mindfulnessService.getMindfulnessExercises();
  res.status(200).json({ mindfulnessExercises: formattedExercises });
}));

module.exports = router;
