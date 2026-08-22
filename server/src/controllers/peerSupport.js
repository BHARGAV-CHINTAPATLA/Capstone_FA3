const User = require('../models/User');
const generateAnonymousUsername = require('../utils/anonymousUsernameGenerator');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get matches for peer support
 * GET /api/v1/peer-support/users
 * Query filters: mood, affectingMood
 */
const getPeers = asyncHandler(async (req, res) => {
  const { mood, affectingMood } = req.query;

  // Exclude current authenticated user
  const query = { _id: { $ne: req.user._id } };

  // Fetch candidate users
  const users = await User.find(query);
  const matchedPeers = [];

  for (const user of users) {
    if (!user.moods || user.moods.length === 0) continue;

    let filteredMoods = [...user.moods];

    // Filter by mood if provided
    if (mood) {
      filteredMoods = filteredMoods.filter(
        (m) => m.mood.toLowerCase() === mood.toLowerCase()
      );
    }

    // Filter by affectingMood (e.g. Exams, Career) if provided
    if (affectingMood) {
      const filters = Array.isArray(affectingMood) 
        ? affectingMood.map(f => f.toLowerCase()) 
        : [affectingMood.toLowerCase()];
      
      filteredMoods = filteredMoods.filter((m) =>
        m.affectingMood.some((tag) => filters.includes(tag.toLowerCase()))
      );
    }

    // If there is any mood entry matching criteria, include latest one
    if (filteredMoods.length > 0) {
      // Sort by date descending to get the latest
      filteredMoods.sort((a, b) => new Date(b.date) - new Date(a.date));
      const latestMood = filteredMoods[0];

      matchedPeers.push({
        anonymousUsername: generateAnonymousUsername(user._id),
        mood: latestMood.mood,
        affectingMood: latestMood.affectingMood,
        description: latestMood.description
      });
    }
  }

  res.status(200).json({ users: matchedPeers });
});

module.exports = {
  getPeers
};
