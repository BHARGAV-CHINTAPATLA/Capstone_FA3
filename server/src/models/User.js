const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MoodSchema = new mongoose.Schema({
  mood: {
    type: String,
    enum: ['Anxious', 'Happy', 'Sad', 'Angry', 'Neutral', 'Calm', 'Stressed', 'Tired'],
    required: true
  },
  intensity: { type: Number, min: 1, max: 5, default: null },
  affectingMood: [{ type: String }],
  description: { type: String, default: '' },
  energyLevel: { type: Number, min: 1, max: 5, default: null },
  sleepQuality: { type: Number, min: 1, max: 5, default: null },
  needRightNow: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  moods: [MoodSchema],
  pushSubscriptions: [mongoose.Schema.Types.Mixed],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hashing
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password compare method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
