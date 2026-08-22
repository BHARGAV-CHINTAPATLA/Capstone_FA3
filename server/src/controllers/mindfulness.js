const MindfulnessExercise = require('../models/MindfulnessExercise');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Retrieve list of all mindfulness exercises
 * GET /api/v1/mindfulness-exercises
 */
const getExercises = asyncHandler(async (req, res) => {
  const exercises = await MindfulnessExercise.find();

  // Format to match the required spec structure
  const formattedExercises = exercises.map(ex => ({
    id: ex._id.toString(),
    title: ex.title,
    description: ex.description,
    instructions: ex.instructions || [],
    duration: ex.duration
  }));

  res.status(200).json({ mindfulnessExercises: formattedExercises });
});

module.exports = {
  getExercises
};
