const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/UserModel');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * Generate a JWT token for the authenticated user.
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * POST /api/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email is already taken
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw AppError.conflict('An account with this email already exists');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Create user
  const user = await UserModel.create({ name, email, password_hash });

  // Generate token
  const token = generateToken(user.id);

  sendCreated(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }, 'Account created successfully');
});

/**
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user (including password hash for comparison)
  const user = await UserModel.findByEmail(email);
  if (!user) {
    // Generic message to prevent email enumeration
    throw AppError.unauthorized('Invalid email or password');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id);

  sendSuccess(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }, 'Logged in successfully');
});

/**
 * POST /api/auth/logout
 * With JWT, logout is handled client-side by removing the token.
 * This endpoint exists for API consistency.
 */
const logout = catchAsync(async (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's information.
 */
const getMe = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  sendSuccess(res, { user });
});

module.exports = { register, login, logout, getMe };
