const config = require('../config');

/**
 * Global error handling middleware.
 * Catches all errors passed via next(error) and returns
 * a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  }

  // Don't expose internal error details in production
  if (statusCode === 500 && config.nodeEnv === 'production') {
    message = 'Something went wrong. Please try again later.';
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace only in development
  if (config.nodeEnv === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler for undefined routes.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
