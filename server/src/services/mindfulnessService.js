const MindfulnessExerciseModel = require('../models/MindfulnessExercise.model');

/**
 * Retrieve and format all mindfulness exercises
 * @returns {Promise<Array>} List of formatted exercises
 */
const getMindfulnessExercises = async () => {
  const exercises = await MindfulnessExerciseModel.findAllExercises();
  return exercises.map(ex => ({
    id: ex._id.toString(),
    title: ex.title,
    description: ex.description,
    instructions: ex.instructions || [],
    duration: ex.duration
  }));
};

module.exports = {
  getMindfulnessExercises
};
