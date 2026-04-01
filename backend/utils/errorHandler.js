/**
 * Centralized error response handler
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Send error response
 */
const sendError = (res, error, defaultMessage = 'An error occurred') => {
  const statusCode = error.statusCode || 500;
  const message = error.message || defaultMessage;
  
  console.error('✗ Error:', message);
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  sendError,
  asyncHandler
};
