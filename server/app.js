const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/v1/authRoutes');
const medicineRoutes = require('./routes/v1/medicineRoutes');
const reminderRoutes = require('./routes/v1/reminderRoutes');
const analyticsRoutes = require('./routes/v1/analyticsRoutes');
const chatRoutes = require('./routes/v1/chatRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Strict rate limit on auth endpoints to prevent brute force
const authLimiter = rateLimit({
  max: 20,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many login attempts from this IP, please try again in 15 minutes!'
});
// General API rate limit (disabled by default for development)
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection (Bug #19)
// Strips keys starting with '$' or containing '.' from req.body/params/query
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      });
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// Compression
app.use(compression());

// 2) ROUTES
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/reminders', reminderRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
