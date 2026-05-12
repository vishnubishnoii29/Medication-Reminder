const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const logger = require('../config/logger');

// Store the socket.io instance globally for cron use
let ioInstance;

const init = (io) => {
  ioInstance = io;
  
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Format time as '08:00 AM'
      const currentTimeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Find active reminders for the current time
      const dueReminders = await Reminder.find({
        status: 'active',
        time: currentTimeString
      }).populate('user', 'email name settings');

      if (dueReminders.length > 0) {
        logger.info(`Found ${dueReminders.length} reminders due at ${currentTimeString}`);
        
        for (const reminder of dueReminders) {
          try {
            // 1. Emit via WebSocket if user is online
            if (ioInstance) {
              const medName = reminder.medicine?.name || 'your medicine';
              const medDose = reminder.medicine?.dosage ? ` (${reminder.medicine.dosage})` : '';
              ioInstance.to(reminder.user._id.toString()).emit('reminder_alert', {
                reminderId: reminder._id,
                title: reminder.title,
                medicine: reminder.medicine,
                message: `It's time to take your ${medName}${medDose}`
              });
            }

            // 2. Trigger NodeMailer (Email Service)
            if (reminder.notificationMethod === 'email' || reminder.user.settings?.notifications?.email) {
              // sendEmail(reminder.user.email, 'Medication Reminder', ...);
              logger.info(`Email reminder triggered for ${reminder.user.email}`);
            }

            // 3. Update lastTriggered timestamp
            reminder.lastTriggered = now;
            await reminder.save();
          } catch (reminderErr) {
            logger.error(`Failed to process reminder ${reminder._id}:`, reminderErr);
          }
        }
      }
    } catch (err) {
      logger.error('Error in cron job execution:', err);
    }
  });

  logger.info('Cron Scheduler initialized.');
};

module.exports = { init };
