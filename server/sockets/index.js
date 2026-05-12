const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Bug #1 Fix: Chat is now handled via REST API (chatController.js).
// This socket handler is only responsible for:
//   1. Authenticating the user on connect
//   2. Joining them to their private room (for real-time reminder_alert events from cronService)

module.exports = (io) => {
  // Middleware for Socket Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key-that-should-be-long', (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.id}`);

    // Join a private room unique to the user — cronService emits reminder_alert here
    socket.join(socket.user.id);

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });
};
