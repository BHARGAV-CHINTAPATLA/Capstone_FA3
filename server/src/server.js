require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const configureWebPush = require('./config/webpush');
const startReminderScheduler = require('./services/reminderScheduler');
const MindfulnessExercise = require('./models/MindfulnessExercise');

const PORT = process.env.PORT || 5000;

// Seed data helper
const seedMindfulnessExercises = async () => {
  try {
    const count = await MindfulnessExercise.countDocuments();
    if (count === 0) {
      console.log('Seeding initial mindfulness exercises database...');
      const seedData = [
        {
          title: 'Deep Breathing Exercise',
          description: 'Practice rhythmic deep breathing to calm your nervous system and reduce stress.',
          instructions: [
            'Find a comfortable seated position with your back straight.',
            'Inhale deeply through your nose for 4 seconds.',
            'Hold your breath for a count of 4 seconds.',
            'Exhale slowly and completely through your mouth for 4 seconds.',
            'Repeat this cycle 5 to 10 times, concentrating on the sensation of air entering and leaving your body.'
          ],
          duration: '4 mins'
        },
        {
          title: '5-4-3-2-1 Grounding Method',
          description: 'An effective grounding exercise to manage anxiety and bring you back to the present moment.',
          instructions: [
            'Look around you and name 5 things you can see (e.g., a chair, a plant).',
            'Name 4 things you can physically touch or feel (e.g., your shirt, the table).',
            'Name 3 things you can hear in your environment (e.g., traffic, birds chirping).',
            'Name 2 things you can smell (e.g., coffee, flowers).',
            'Name 1 thing you can taste (e.g., toothpaste, mint).',
            'Take a deep breath and settle back into the present.'
          ],
          duration: '5 mins'
        },
        {
          title: 'Loving-Kindness Meditation',
          description: 'Cultivate self-compassion, empathy, and positive thoughts towards others.',
          instructions: [
            'Close your eyes, breathe naturally, and focus on your heart center.',
            'Repeat silently to yourself: "May I be happy. May I be healthy. May I be safe. May I live with ease."',
            'Visualize someone you love and send them these thoughts.',
            'Visualize a neutral person and repeat the phrases.',
            'Finally, extend this goodwill outward to all living beings.'
          ],
          duration: '10 mins'
        },
        {
          title: 'Progressive Muscle Relaxation',
          description: 'Sequentially tense and relax muscle groups to release physical tension.',
          instructions: [
            'Lie down or sit comfortably. Take a few deep breaths.',
            'Tense your toes and feet tightly for 5 seconds, then let go completely.',
            'Move up to your calves: tense for 5 seconds, then release.',
            'Continue this pattern up your body: thighs, stomach, chest, hands, shoulders, neck, and face.',
            'Notice the difference between tension and relaxation, enjoying the heavy feeling.'
          ],
          duration: '8 mins'
        },
        {
          title: 'Mindful Walk',
          description: 'Transform an ordinary walk into a calming awareness practice.',
          instructions: [
            'Walk at a steady, slow pace in a quiet setting.',
            'Focus on the physical sensations of walking: the heel strike, rolling onto the ball, and lifting off.',
            'Expand awareness to the air against your skin, and the sounds around you.',
            'Whenever your mind wanders, gently guide your focus back to the sensation of walking.'
          ],
          duration: '15 mins'
        }
      ];
      await MindfulnessExercise.insertMany(seedData);
      console.log('Successfully seeded mindfulness exercises database.');
    } else {
      console.log('Mindfulness exercises already seeded in database.');
    }
  } catch (error) {
    console.error('Error seeding mindfulness exercises:', error.message);
  }
};

// Start Server Wrapper
const startServer = async () => {
  // Connect database
  await connectDB();

  // Seed exercises
  await seedMindfulnessExercises();

  // Configure Web Push VAPID keys
  configureWebPush();

  // Start background reminder cron scheduler
  startReminderScheduler();

  // Listen
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
