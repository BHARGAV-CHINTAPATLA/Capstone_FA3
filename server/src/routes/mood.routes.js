const express = require('express');
const router = express.Router();
const moodService = require('../services/moodService');
const authenticateJWT = require('../utilities/authenticateJWT');
const { validateMood } = require('../utilities/validateRequest');
const asyncHandler = require('../utilities/asyncHandler');

router.post('/mood-tracking', authenticateJWT, validateMood, asyncHandler(async (req, res) => {
  await moodService.trackUserMood(req.user, req.body);
  res.status(201).json({ message: 'Mood tracked successfully' });
}));

router.get('/mood-history', authenticateJWT, asyncHandler(async (req, res) => {
  const sortedHistory = moodService.getUserMoodHistory(req.user);
  res.status(200).json({ moodHistory: sortedHistory });
}));

module.exports = router;
