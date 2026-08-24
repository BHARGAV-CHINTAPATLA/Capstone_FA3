const UserModel = require('../models/User.model');
const generateAnonymousUsername = require('../utilities/anonymousUsernameGenerator');

/**
 * Get matches for peer support
 * @param {string} currentUserId - The authenticated user's ID
 * @param {Object} queryData - Filtering criteria { mood, affectingMood }
 * @returns {Promise<Array>} List of matched peer support users
 */
const getPeerSupportUsers = async (currentUserId, queryData) => {
  const { mood, affectingMood } = queryData;

  // Fetch candidate users (all except current user)
  const users = await UserModel.findAllUsersExcept(currentUserId);
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

  return matchedPeers;
};

module.exports = {
  getPeerSupportUsers
};
