const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reminder must belong to a user']
  },
  medicine: {
    type: mongoose.Schema.ObjectId,
    ref: 'Medicine',
    required: [true, 'Reminder must be linked to a medicine']
  },
  title: {
    type: String,
    required: [true, 'Reminder must have a title']
  },
  time: {
    type: String, // E.g., '08:00 AM'
    required: [true, 'Reminder must have a time']
  },
  cronExpression: {
    type: String // Optional, for node-cron execution
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily'
  },
  notificationMethod: {
    type: String,
    enum: ['browser', 'email', 'sms'],
    default: 'browser'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastTriggered: Date
}, {
  timestamps: true
});

// Populate medicine data by default
reminderSchema.pre(/^find/, function() {
  this.populate({
    path: 'medicine',
    select: 'name dosage type instruction'
  });
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
