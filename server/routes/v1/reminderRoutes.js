const express = require('express');
const reminderController = require('../../controllers/reminderController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(reminderController.getAllReminders)
  .post(reminderController.createReminder);

router
  .route('/:id')
  .put(reminderController.updateReminder)
  .patch(reminderController.updateReminder)
  .delete(reminderController.deleteReminder);

module.exports = router;
