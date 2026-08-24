const { MindfulnessExercise } = require('../utilities/connection');

/**
 * Counts total mindfulness exercises in DB
 * @returns {Promise<number>} Count of exercises
 */
const countExercises = async () => {
  return MindfulnessExercise.countDocuments();
};

/**
 * Seeds or inserts many mindfulness exercises
 * @param {Array<Object>} exercises 
 * @returns {Promise<Array>} Inserted documents
 */
const insertExercises = async (exercises) => {
  return MindfulnessExercise.insertMany(exercises);
};

/**
 * Retrieves all mindfulness exercises
 * @returns {Promise<Array>} List of exercise documents
 */
const findAllExercises = async () => {
  return MindfulnessExercise.find();
};

module.exports = {
  countExercises,
  insertExercises,
  findAllExercises
};
