const { Reminder } = require('../utilities/connection');

/**
 * Find reminders that match the scheduled time pattern
 * @param {RegExp} timeRegex 
 * @returns {Promise<Array>} List of reminders
 */
const findRemindersByTimeRegex = async (timeRegex) => {
  return Reminder.find({ time: { $regex: timeRegex } });
};

/**
 * Creates and saves a new reminder
 * @param {Object} data 
 * @returns {Promise<Object>} Created reminder document
 */
const createReminder = async (data) => {
  const reminder = new Reminder(data);
  return reminder.save();
};

/**
 * Get all reminders of a specific user
 * @param {string} userId 
 * @returns {Promise<Array>} List of reminders
 */
const findRemindersByUserId = async (userId) => {
  return Reminder.find({ user: userId });
};

/**
 * Get a reminder by its ID
 * @param {string} reminderId 
 * @returns {Promise<Object|null>} Reminder document
 */
const findReminderById = async (reminderId) => {
  return Reminder.findById(reminderId);
};

/**
 * Deletes a reminder by its ID
 * @param {string} reminderId 
 * @returns {Promise<Object|null>} Deleted reminder document
 */
const deleteReminderById = async (reminderId) => {
  return Reminder.findByIdAndDelete(reminderId);
};

/**
 * Saves an existing reminder document
 * @param {Object} reminderDoc 
 * @returns {Promise<Object>} Saved reminder document
 */
const saveReminder = async (reminderDoc) => {
  return reminderDoc.save();
};

module.exports = {
  findRemindersByTimeRegex,
  createReminder,
  findRemindersByUserId,
  findReminderById,
  deleteReminderById,
  saveReminder
};
