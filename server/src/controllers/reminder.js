const Reminder = require('../models/Reminder');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a reminder for the current user
 * POST /api/v1/reminders
 */
const createReminder = asyncHandler(async (req, res) => {
  const { exercise, frequency, time } = req.body;
  const userId = req.user._id;

  const reminder = new Reminder({
    user: userId,
    exercise,
    frequency,
    time
  });

  await reminder.save();

  res.status(201).json({ message: 'Reminder set successfully', reminder });
});

/**
 * Get all reminders of the current user
 * GET /api/v1/reminders
 */
const getReminders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const reminders = await Reminder.find({ user: userId });

  res.status(200).json({ reminders });
});

/**
 * Update an existing reminder
 * PUT /api/v1/reminders/:id
 */
const updateReminder = asyncHandler(async (req, res) => {
  const reminderId = req.params.id;
  const { exercise, frequency, time } = req.body;
  const userId = req.user._id;

  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  // Ownership verification
  if (reminder.user.toString() !== userId.toString()) {
    return res.status(403).json({ error: 'Forbidden: You cannot modify this reminder' });
  }

  // Update fields
  if (exercise) reminder.exercise = exercise;
  if (frequency) reminder.frequency = frequency;
  if (time) reminder.time = time;

  await reminder.save();

  res.status(200).json({ message: 'Reminder updated successfully', reminder });
});

/**
 * Delete a reminder
 * DELETE /api/v1/reminders/:id
 */
const deleteReminder = asyncHandler(async (req, res) => {
  const reminderId = req.params.id;
  const userId = req.user._id;

  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  // Ownership verification
  if (reminder.user.toString() !== userId.toString()) {
    return res.status(403).json({ error: 'Forbidden: You cannot delete this reminder' });
  }

  await Reminder.findByIdAndDelete(reminderId);

  res.status(200).json({ message: 'Reminder deleted successfully' });
});

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
};
