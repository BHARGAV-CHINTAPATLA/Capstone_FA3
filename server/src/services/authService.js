const UserModel = require('../models/User.model');
const { signToken } = require('../utilities/jwt');

/**
 * Handle user registration business logic
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Created user Mongoose document
 */
const signupUser = async (email, password) => {
  const existingUser = await UserModel.findUserByEmail(email.toLowerCase());
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  return UserModel.createUser({ email, password });
};

/**
 * Handle user authentication business logic
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Object containing auth token
 */
const loginUser = async (email, password) => {
  const user = await UserModel.findUserByEmailWithPassword(email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);
  return { token };
};

module.exports = {
  signupUser,
  loginUser
};
