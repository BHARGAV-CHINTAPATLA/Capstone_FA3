const mongoose = require('mongoose');

const MindfulnessExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: [{
    type: String
  }],
  duration: {
    type: String, // e.g. "5 mins", "10 mins"
    required: true
  }
});

module.exports = mongoose.model('MindfulnessExercise', MindfulnessExerciseSchema);
