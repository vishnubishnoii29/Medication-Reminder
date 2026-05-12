const mongoose = require('mongoose');

const adherenceLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Log must belong to a user']
  },
  reminder: {
    type: mongoose.Schema.ObjectId,
    ref: 'Reminder',
    required: [true, 'Log must be linked to a reminder']
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['taken', 'missed'],
    required: [true, 'Log must have a status']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate logs for the same reminder on the same day
// (assuming daily reminders for simplicity, or we can just rely on timestamps)
adherenceLogSchema.index({ user: 1, reminder: 1, date: 1 }, { unique: false });

const AdherenceLog = mongoose.model('AdherenceLog', adherenceLogSchema);
module.exports = AdherenceLog;
