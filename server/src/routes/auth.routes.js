const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validateSignup, validateLogin } = require('../utilities/validateRequest');
const asyncHandler = require('../utilities/asyncHandler');

router.post('/signup', validateSignup, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  await authService.signupUser(email, password);
  res.status(201).json({ message: 'User created successfully' });
}));

router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json(result);
}));

module.exports = router;
