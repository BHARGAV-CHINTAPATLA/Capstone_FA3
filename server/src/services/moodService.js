const UserModel = require('../models/User.model');

/**
 * Log a new mood entry for the user
 * @param {Object} user - User mongoose document
 * @param {Object} moodData - Mood entry payload
 * @returns {Promise<Object>} Saved user document
 */
const trackUserMood = async (user, moodData) => {
  const { mood, intensity, affectingMood, description, energyLevel, sleepQuality, needRightNow } = moodData;

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

  return UserModel.saveUser(user);
};

/**
 * Retrieve user's mood history sorted in descending chronological order
 * @param {Object} user - User mongoose document
 * @returns {Array} Sorted mood history
 */
const getUserMoodHistory = (user) => {
  return [...user.moods].sort((a, b) => new Date(b.date) - new Date(a.date));
};

module.exports = {
  trackUserMood,
  getUserMoodHistory
};
