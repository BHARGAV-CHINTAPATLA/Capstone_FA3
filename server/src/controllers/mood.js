const asyncHandler = require('../utils/asyncHandler');

/**
 * Log a new mood entry for the user
 * POST /api/v1/mood-tracking
 */
const trackMood = asyncHandler(async (req, res) => {
  const { mood, intensity, affectingMood, description, energyLevel, sleepQuality, needRightNow } = req.body;
  const user = req.user;

  // Append new mood subdocument
  user.moods.push({
    mood,
    intensity: intensity || null,
    affectingMood: affectingMood || [],
    description: description || '',
    energyLevel: energyLevel || null,
    sleepQuality: sleepQuality || null,
    needRightNow: needRightNow || '',
    date: new Date()
  });

  await user.save();

  res.status(201).json({ message: 'Mood tracked successfully' });
});

/**
 * Retrieve current user's chronological mood history
 * GET /api/v1/mood-history
 */
const getMoodHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  
  // Sort history in descending chronological order (most recent first)
  const sortedHistory = [...user.moods].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({ moodHistory: sortedHistory });
});

module.exports = {
  trackMood,
  getMoodHistory
};
