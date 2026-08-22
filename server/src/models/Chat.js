const mongoose = require('mongoose');

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

module.exports = mongoose.model('Chat', ChatSchema);
