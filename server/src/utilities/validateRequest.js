/**
 * Custom validation middleware for incoming request payloads
 */

const validateSignup = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  next();
};

const validateMood = (req, res, next) => {
  const { mood, affectingMood, description } = req.body;
  if (!mood) {
    return res.status(400).json({ error: 'Mood is required' });
  }
  
  const validMoods = ['Anxious', 'Happy', 'Sad', 'Angry', 'Neutral', 'Calm', 'Stressed', 'Tired'];
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood value. Must be Anxious, Happy, Sad, Angry, or Neutral' });
  }
  
  if (affectingMood && !Array.isArray(affectingMood)) {
    return res.status(400).json({ error: 'affectingMood must be an array of strings' });
  }
  next();
};

const validateReminder = (req, res, next) => {
  const { exercise, frequency, time } = req.body;
  if (!exercise || !frequency || !time) {
    return res.status(400).json({ error: 'Exercise, frequency, and time are required' });
  }
  
  const validFreqs = ['Daily', 'Weekly', 'Monthly'];
  if (!validFreqs.includes(frequency)) {
    return res.status(400).json({ error: 'Frequency must be Daily, Weekly, or Monthly' });
  }
  
  const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ error: 'Time must match HH:MM AM/PM format (e.g., 08:30 AM)' });
  }
  next();
};

const validateMessage = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateMood,
  validateReminder,
  validateMessage
};
