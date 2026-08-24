const ReminderModel = require('../models/Reminder.model');

/**
 * Create a reminder for a user
 * @param {string} userId 
 * @param {Object} data 
 * @returns {Promise<Object>} Created reminder
 */
const createReminderForUser = async (userId, data) => {
  const { exercise, frequency, time } = data;
  return ReminderModel.createReminder({
    user: userId,
    exercise,
    frequency,
    time
  });
};

/**
 * Get all reminders of a user
 * @param {string} userId 
 * @returns {Promise<Array>} List of reminders
 */
const getUserReminders = async (userId) => {
  return ReminderModel.findRemindersByUserId(userId);
};

/**
 * Update an existing reminder
 * @param {string} reminderId 
 * @param {string} userId 
 * @param {Object} data 
 * @returns {Promise<Object>} Updated reminder
 */
const updateReminderForUser = async (reminderId, userId, data) => {
  const { exercise, frequency, time } = data;
  const reminder = await ReminderModel.findReminderById(reminderId);
  if (!reminder) {
    const error = new Error('Reminder not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  if (reminder.user.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You cannot modify this reminder');
    error.statusCode = 403;
    throw error;
  }

  // Update fields
  if (exercise) reminder.exercise = exercise;
  if (frequency) reminder.frequency = frequency;
  if (time) reminder.time = time;

  return ReminderModel.saveReminder(reminder);
};

/**
 * Delete a reminder
 * @param {string} reminderId 
 * @param {string} userId 
 * @returns {Promise<void>}
 */
const deleteReminderForUser = async (reminderId, userId) => {
  const reminder = await ReminderModel.findReminderById(reminderId);
  if (!reminder) {
    const error = new Error('Reminder not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  if (reminder.user.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You cannot delete this reminder');
    error.statusCode = 403;
    throw error;
  }

  await ReminderModel.deleteReminderById(reminderId);
};

module.exports = {
  createReminderForUser,
  getUserReminders,
  updateReminderForUser,
  deleteReminderForUser
};
