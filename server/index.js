require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Uncaught Exception Handler
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

const app = require('./app');
const logger = require('./config/logger');
const socketHandler = require('./sockets');
const cronService = require('./services/cronService');

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
socketHandler(io);

// Database Connection
const DB = process.env.MONGO_URI || 'mongodb://localhost:27017/medimind';

mongoose
  .connect(DB)
  .then(() => {
    logger.info('DB connection successful!');
    
    // Initialize Cron Jobs after DB connects
    cronService.init(io);
  })
  .catch(err => {
    logger.error('DB Connection Error:', err);
  });

const port = process.env.PORT || 5000;
server.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

// Unhandled Rejection Handler
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
