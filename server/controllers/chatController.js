const ChatSession = require('../models/ChatSession');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const aiService = require('../services/aiService');

exports.getChatSessions = catchAsync(async (req, res, next) => {
  const sessions = await ChatSession.find({ user: req.user.id })
    .select('-messages')
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    data: sessions
  });
});

exports.getChatSession = catchAsync(async (req, res, next) => {
  const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id });

  if (!session) {
    return next(new AppError('No chat session found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: session
  });
});

exports.createChatSession = catchAsync(async (req, res, next) => {
  const newSession = await ChatSession.create({
    user: req.user.id,
    title: req.body.title || 'New Conversation'
  });

  res.status(201).json({
    status: 'success',
    data: newSession
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;
  const { text } = req.body;

  if (!text) return next(new AppError('Message text is required', 400));

  const session = await ChatSession.findOne({ _id: sessionId, user: req.user.id });
  if (!session) return next(new AppError('Session not found', 404));

  // Add User Message
  session.messages.push({ text, sender: 'user' });
  await session.save();

  // Call Python AI Service — includes 5s timeout + fallback (never throws)
  const history = session.messages.slice(-10);
  const aiResponse = await aiService.analyzeChat(history, text);

  // Add AI Message & persist
  const aiMessage = { text: aiResponse.text || aiResponse.response, sender: 'ai' };
  session.messages.push(aiMessage);
  await session.save();

  res.status(200).json({
    status: 'success',
    data: aiMessage
  });
});
