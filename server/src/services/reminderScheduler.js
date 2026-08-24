const cron = require('node-cron');
const ReminderModel = require('../models/Reminder.model');
const { sendPushNotification } = require('./notificationService');

/**
 * Starts the background reminder scheduler cron job
 */
const startReminderScheduler = () => {
  // Execute every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Get current local hours and minutes
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 hour resolves to 12
      const formattedHours = hours.toString().padStart(2, '0');
      
      const currentTimeStr = `${formattedHours}:${minutes} ${ampm}`;

      console.log(`[Reminder Scheduler] Tick at ${currentTimeStr}. Searching due reminders.`);

      // Query reminders that match current time string (HH:MM AM/PM)
      const reminders = await ReminderModel.findRemindersByTimeRegex(new RegExp(`^${currentTimeStr}$`, 'i'));

      for (const reminder of reminders) {
        let isDue = false;

        if (reminder.frequency === 'Daily') {
          isDue = true;
        } else if (reminder.frequency === 'Weekly') {
          // Trigger if current day of week matches creation day of week
          const createdDay = new Date(reminder.createdAt).getDay();
          if (now.getDay() === createdDay) {
            isDue = true;
          }
        } else if (reminder.frequency === 'Monthly') {
          // Trigger if current date matches creation date of month
          const createdDate = new Date(reminder.createdAt).getDate();
          if (now.getDate() === createdDate) {
            isDue = true;
          }
        }

        if (isDue) {
          console.log(`[Reminder Scheduler] Dispatching reminder "${reminder.exercise}" to user ${reminder.user}`);
          await sendPushNotification(reminder.user, {
            title: 'Mindmingle Wellness Alert',
            body: `It is time for your scheduled mindfulness exercise: "${reminder.exercise}".`,
            data: {
              url: '/mindfulness-exercises'
            }
          });
        }
      }
    } catch (error) {
      console.error('[Reminder Scheduler Error]:', error);
    }
  });
  console.log('Reminder cron job scheduled successfully.');
};

module.exports = startReminderScheduler;
