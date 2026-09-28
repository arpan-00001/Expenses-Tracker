const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsGoalRoutes = require('./routes/savingsGoalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// ─── Security Middleware ───
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ───
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Body Parsing ───
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Logging ───
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ─── API Routes ───
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/transactions', apiLimiter, transactionRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/budgets', apiLimiter, budgetRoutes);
app.use('/api/savings-goals', apiLimiter, savingsGoalRoutes);
app.use('/api/analytics', apiLimiter, analyticsRoutes);
app.use('/api/recommendations', apiLimiter, recommendationRoutes);

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TeenTrack API is running', timestamp: new Date().toISOString() });
});

// ─── Error Handling ───
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
