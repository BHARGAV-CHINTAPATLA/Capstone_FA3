const express = require('express');
const router = express.Router();
const reminderService = require('../services/reminderService');
const authenticateJWT = require('../utilities/authenticateJWT');
const { validateReminder } = require('../utilities/validateRequest');
const asyncHandler = require('../utilities/asyncHandler');

router.post('/reminders', authenticateJWT, validateReminder, asyncHandler(async (req, res) => {
  const reminder = await reminderService.createReminderForUser(req.user._id, req.body);
  res.status(201).json({ message: 'Reminder set successfully', reminder });
}));

router.get('/reminders', authenticateJWT, asyncHandler(async (req, res) => {
  const reminders = await reminderService.getUserReminders(req.user._id);
  res.status(200).json({ reminders });
}));

router.put('/reminders/:id', authenticateJWT, validateReminder, asyncHandler(async (req, res) => {
  const reminder = await reminderService.updateReminderForUser(req.params.id, req.user._id, req.body);
  res.status(200).json({ message: 'Reminder updated successfully', reminder });
}));

router.delete('/reminders/:id', authenticateJWT, asyncHandler(async (req, res) => {
  await reminderService.deleteReminderForUser(req.params.id, req.user._id);
  res.status(200).json({ message: 'Reminder deleted successfully' });
}));

module.exports = router;
