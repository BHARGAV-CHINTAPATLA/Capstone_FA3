const express = require('express');
const router = express.Router();
const { createReminder, getReminders, updateReminder, deleteReminder } = require('../controllers/reminder');
const authenticateJWT = require('../middleware/authenticateJWT');
const { validateReminder } = require('../middleware/validateRequest');

router.post('/reminders', authenticateJWT, validateReminder, createReminder);
router.get('/reminders', authenticateJWT, getReminders);
router.put('/reminders/:id', authenticateJWT, validateReminder, updateReminder);
router.delete('/reminders/:id', authenticateJWT, deleteReminder);

module.exports = router;
