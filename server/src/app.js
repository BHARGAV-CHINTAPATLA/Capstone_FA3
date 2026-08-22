const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import REST Route Modules
const authRoutes = require('./routes/auth.routes');
const moodRoutes = require('./routes/mood.routes');
const mindfulnessRoutes = require('./routes/mindfulness.routes');
const reminderRoutes = require('./routes/reminder.routes');
const peerSupportRoutes = require('./routes/peerSupport.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Apply global middlewares
app.use(cors());
app.use(express.json());

// Mount routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', moodRoutes);
app.use('/api/v1', mindfulnessRoutes);
app.use('/api/v1', reminderRoutes);
app.use('/api/v1', peerSupportRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1', notificationRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Centered catch-all error handling middleware
app.use(errorHandler);

module.exports = app;
