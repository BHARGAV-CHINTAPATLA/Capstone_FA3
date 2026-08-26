const { Goal } = require('../utilities/connection');

/**
 * Creates and saves a new goal
 * @param {Object} data 
 * @returns {Promise<Object>} Created goal document
 */
const createGoal = async (data) => {
  const goal = new Goal(data);
  return goal.save();
};

/**
 * Get all goals of a specific user, sorted by creation date
 * @param {string} userId 
 * @returns {Promise<Array>} List of goals
 */
const findGoalsByUserId = async (userId) => {
  return Goal.find({ user: userId })
    .populate('linkedExercise')
    .sort({ createdAt: 1 });
};

/**
 * Get a goal by its ID
 * @param {string} goalId 
 * @returns {Promise<Object|null>} Goal document
 */
const findGoalById = async (goalId) => {
  return Goal.findById(goalId).populate('linkedExercise');
};

/**
 * Deletes a goal by its ID
 * @param {string} goalId 
 * @returns {Promise<Object|null>} Deleted goal document
 */
const deleteGoalById = async (goalId) => {
  return Goal.findByIdAndDelete(goalId);
};

/**
 * Saves an existing goal document
 * @param {Object} goalDoc 
 * @returns {Promise<Object>} Saved goal document
 */
const saveGoal = async (goalDoc) => {
  return goalDoc.save();
};

module.exports = {
  createGoal,
  findGoalsByUserId,
  findGoalById,
  deleteGoalById,
  saveGoal
};
