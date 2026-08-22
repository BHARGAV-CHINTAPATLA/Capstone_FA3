const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Handle user registration (Sign Up)
 */
const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Create new user
  const user = new User({ email, password });
  await user.save();

  res.status(201).json({ message: 'User created successfully' });
});

/**
 * Handle user authentication (Login)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Retrieve user including password field (which is select: false)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password validity
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = signToken(user._id);

  res.status(200).json({ token });
});

module.exports = {
  signup,
  login
};
