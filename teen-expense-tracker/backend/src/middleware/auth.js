const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');
const UserModel = require('../models/UserModel');

/**
 * Authentication middleware.
 * Extracts JWT from Authorization header, verifies it,
 * and attaches the authenticated user to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication required. Please log in.');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw AppError.unauthorized('Authentication required. Please log in.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Your session has expired. Please log in again.');
      }
      throw AppError.unauthorized('Invalid authentication token.');
    }

    // Verify user still exists in database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw AppError.unauthorized('User account no longer exists.');
    }

    // Attach user to request (without password hash)
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
