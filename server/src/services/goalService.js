const GoalModel = require('../models/Goal.model');

/**
 * Get all goals for a user, automatically resetting isDoneToday to false 
 * if lastCheckedDate is not today (local server day).
 * @param {string} userId 
 * @returns {Promise<Array>} List of goals
 */
const getUserGoals = async (userId) => {
  const goals = await GoalModel.findGoalsByUserId(userId);
  const todayStr = new Date().toDateString();

  for (let goal of goals) {
    if (goal.isDoneToday) {
      const lastCheckedStr = goal.lastCheckedDate ? new Date(goal.lastCheckedDate).toDateString() : '';
      if (lastCheckedStr !== todayStr) {
        goal.isDoneToday = false;
        await GoalModel.saveGoal(goal);
      }
    }
  }

  // Refetch to return populated/updated array
  return GoalModel.findGoalsByUserId(userId);
};

/**
 * Create a new goal for a user
 * @param {string} userId 
 * @param {Object} data 
 * @returns {Promise<Object>} Created goal
 */
const createGoalForUser = async (userId, data) => {
  const { title, linkedExercise } = data;
  return GoalModel.createGoal({
    user: userId,
    title,
    linkedExercise: linkedExercise || null
  });
};

/**
 * Update an existing goal
 * @param {string} goalId 
 * @param {string} userId 
 * @param {Object} data 
 * @returns {Promise<Object>} Updated goal
 */
const updateGoalForUser = async (goalId, userId, data) => {
  const { title, linkedExercise } = data;
  const goal = await GoalModel.findGoalById(goalId);

  if (!goal) {
    const error = new Error('Goal not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  if (goal.user.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You cannot modify this goal');
    error.statusCode = 403;
    throw error;
  }

  // Update fields (allow unsetting linkedExercise by passing null/empty string)
  if (title !== undefined) goal.title = title;
  goal.linkedExercise = linkedExercise || null;

  await GoalModel.saveGoal(goal);
  
  // Return populated goal
  return GoalModel.findGoalById(goalId);
};

/**
 * Toggle the completion status of a goal for today
 * @param {string} goalId 
 * @param {string} userId 
 * @returns {Promise<Object>} Updated goal
 */
const toggleGoalForUser = async (goalId, userId) => {
  const goal = await GoalModel.findGoalById(goalId);

  if (!goal) {
    const error = new Error('Goal not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  if (goal.user.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You cannot toggle this goal');
    error.statusCode = 403;
    throw error;
  }

  // Toggle completion
  goal.isDoneToday = !goal.isDoneToday;
  if (goal.isDoneToday) {
    goal.lastCheckedDate = new Date();
  }

  await GoalModel.saveGoal(goal);
  
  return GoalModel.findGoalById(goalId);
};

/**
 * Delete a goal for a user
 * @param {string} goalId 
 * @param {string} userId 
 * @returns {Promise<void>}
 */
const deleteGoalForUser = async (goalId, userId) => {
  const goal = await GoalModel.findGoalById(goalId);

  if (!goal) {
    const error = new Error('Goal not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  if (goal.user.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You cannot delete this goal');
    error.statusCode = 403;
    throw error;
  }

  await GoalModel.deleteGoalById(goalId);
};

module.exports = {
  getUserGoals,
  createGoalForUser,
  updateGoalForUser,
  toggleGoalForUser,
  deleteGoalForUser
};
