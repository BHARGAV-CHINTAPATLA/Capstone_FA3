const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 1. Connection Helper
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindmingle';
  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (
      error.message.includes('ECONNREFUSED') || 
      error.name === 'MongooseServerSelectionError' ||
      error.message.includes('connect ECONNREFUSED')
    ) {
      console.warn(`Local MongoDB connection failed at ${mongoUri}. Spinning up MongoDB Memory Server fallback...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        console.log(`MongoDB Memory Server started at: ${memoryUri}`);
        const conn = await mongoose.connect(memoryUri);
        console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      } catch (innerError) {
        console.error(`MongoDB Connection Error & Memory Server Failed: ${innerError.message}`);
        process.exit(1);
      }
    } else {
      console.error(`MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }
};

// 2. Schema Definitions

// Mood Schema (embedded in User Schema)
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

// User Schema
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

// Pre-save password hashing
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password compare method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Chat Schema
const ChatSchema = new mongoose.Schema({
  participants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    validate: [arrayLimit, 'Chat must have exactly 2 participants']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

function arrayLimit(val) {
  return val.length === 2;
}

// Message Schema
const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mindfulness Exercise Schema
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
    type: String,
    required: true
  }
});

// Reminder Schema
const ReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true
  },
  time: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 3. Compile Mongoose Models
const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);
const Message = mongoose.model('Message', MessageSchema);
const MindfulnessExercise = mongoose.model('MindfulnessExercise', MindfulnessExerciseSchema);
const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = {
  connectDB,
  User,
  Chat,
  Message,
  MindfulnessExercise,
  Reminder
};
