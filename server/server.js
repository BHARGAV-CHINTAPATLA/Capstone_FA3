require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/utilities/connection');
const MindfulnessExerciseModel = require('./src/models/MindfulnessExercise.model');

const PORT = process.env.PORT || 5000;

// Seed data helper
const seedMindfulnessExercises = async () => {
  try {
    const { MindfulnessExercise } = require('./src/utilities/connection');
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
      },
      {
        title: 'Body Scan Meditation',
        description: 'Slowly bring attention through each part of your body to release tension and reconnect with the present.',
        instructions: [
          'Lie down comfortably on your back or sit in a relaxed position.',
          'Close your eyes and take a few slow, deep breaths, letting your body settle.',
          'Bring your awareness to your feet: notice any sensations, warmth, cold, or tension, then let it go.',
          'Slowly move your focus upward through your legs, torso, arms, neck, and head, pausing at each area to notice sensations.',
          'End with a general awareness of your entire body, breathing in peace and exhaling tension.'
        ],
        duration: '12 mins'
      },
      {
        title: 'Box Breathing',
        description: 'A steady 4-4-4-4 breathing pattern used to calm the nervous system and sharpen focus.',
        instructions: [
          'Sit upright comfortably and exhale all air from your lungs.',
          'Inhale slowly through your nose for a count of 4 seconds.',
          'Hold your breath for a count of 4 seconds.',
          'Exhale gently through your mouth for a count of 4 seconds.',
          'Hold your lungs empty for another count of 4 seconds.',
          'Repeat this box pattern for 3 to 5 minutes.'
        ],
        duration: '5 mins'
      },
      {
        title: 'Gratitude Reflection',
        description: 'Pause to notice and appreciate a few things you\'re grateful for today.',
        instructions: [
          'Sit quietly, close your eyes, and take a few relaxing breaths.',
          'Think of three things in your life you are truly grateful for, no matter how small they seem.',
          'Focus on one of these things, imagining it clearly and noting the positive feelings it brings.',
          'Mentally say "Thank you" to acknowledge and honor these positive aspects of your day.',
          'Carry this warm feeling of gratitude with you as you open your eyes.'
        ],
        duration: '6 mins'
      },
      {
        title: 'Mindful Stretching',
        description: 'Gentle stretches paired with slow breathing to ease physical and mental tension.',
        instructions: [
          'Stand or sit upright, relaxing your shoulders away from your ears.',
          'Slowly raise your arms overhead as you inhale deeply, reaching towards the sky.',
          'Exhale as you gently fold forward from your hips, letting your neck and shoulders hang loose.',
          'Inhale to lift your torso halfway up, then exhale into a gentle twist, looking over your shoulder.',
          'Perform these movements slowly, focusing entirely on the physical sensations of muscular release.'
        ],
        duration: '7 mins'
      }
    ];

    let seededCount = 0;
    for (const ex of seedData) {
      const existing = await MindfulnessExercise.findOne({ title: ex.title });
      if (!existing) {
        await new MindfulnessExercise(ex).save();
        seededCount++;
      }
    }

    if (seededCount > 0) {
      console.log(`Successfully seeded ${seededCount} new mindfulness exercises.`);
    } else {
      console.log('Mindfulness exercises database is up to date.');
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
  app.get('/health', (req, res, next) => {
    // Health check endpoint is defined in app.js, connectDB config is here
  });
  
  // Configure Web Push VAPID keys (relocated utility)
  const configureWebPush = require('./src/utilities/webpush');
  configureWebPush();

  // Start background reminder cron scheduler
  const startReminderScheduler = require('./src/services/reminderScheduler');
  startReminderScheduler();

  // Listen
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
