const express = require('express');
const chatController = require('../../controllers/chatController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(chatController.getChatSessions)
  .post(chatController.createChatSession);

router
  .route('/:id')
  .get(chatController.getChatSession);

router
  .route('/:sessionId/messages')
  .post(chatController.sendMessage);

module.exports = router;
