const Reminder = require('../models/Reminder');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReminder = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  
  const newReminder = await Reminder.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newReminder
  });
});

exports.getAllReminders = catchAsync(async (req, res, next) => {
  const reminders = await Reminder.find({ user: req.user.id }).sort('time');

  res.status(200).json({
    status: 'success',
    results: reminders.length,
    data: reminders
  });
});

exports.updateReminder = catchAsync(async (req, res, next) => {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!reminder) {
    return next(new AppError('No reminder found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: reminder
  });
});

exports.deleteReminder = catchAsync(async (req, res, next) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!reminder) {
    return next(new AppError('No reminder found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
