const { User } = require('../utilities/connection');

/**
 * Creates a new user document
 * @param {Object} data 
 * @returns {Promise<Object>} Created user Mongoose document
 */
const createUser = async (data) => {
  const user = new User(data);
  return user.save();
};

/**
 * Finds user by email
 * @param {string} email 
 * @returns {Promise<Object|null>} User document
 */
const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Finds user by email and includes password
 * @param {string} email 
 * @returns {Promise<Object|null>} User document with password field selected
 */
const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select('+password');
};

/**
 * Finds a user by their Google subject identifier
 * @param {string} googleId
 * @returns {Promise<Object|null>} User document
 */
const findUserByGoogleId = async (googleId) => {
  return User.findOne({ googleId });
};

const findUserByFacebookId = async (facebookId) => {
  return User.findOne({ facebookId });
};

/**
 * Finds user by ID
 * @param {string} id 
 * @returns {Promise<Object|null>} User document
 */
const findUserById = async (id) => {
  return User.findById(id);
};

/**
 * Finds all users except the specified ID
 * @param {string} userId - User ID to exclude
 * @returns {Promise<Array>} List of users
 */
const findAllUsersExcept = async (userId) => {
  return User.find({ _id: { $ne: userId } });
};

/**
 * Saves a user Mongoose document
 * @param {Object} userDoc 
 * @returns {Promise<Object>} Saved user document
 */
const saveUser = async (userDoc) => {
  return userDoc.save();
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByGoogleId,
  findUserByFacebookId,
  findUserById,
  findAllUsersExcept,
  saveUser
};
