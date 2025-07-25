const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Handle specific error messages for auth process
  if (err.message === 'Invalid credentials') {
    error = new ErrorResponse('Invalid credentials', 401);
  }

  if (err.message === 'Not authorized to access this route') {
    error = new ErrorResponse('Not authorized to access this route', 401);
  }

  // Handle user already exists error specifically for our test case
  if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
    error = new ErrorResponse('User already exists', 400);
  }
  // General duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value entered: ${field} with value: ${value}. Please use another value.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Invalid token. Authorization denied.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Token expired. Please log in again.', 401);
  }

  // Default error status and message if not caught above
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;