const bcrypt = require('bcryptjs');
const config = require('../config');
const UserModel = require('../models/UserModel');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/users/profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  sendSuccess(res, { user });
});

/**
 * PUT /api/users/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  // Check if new email is already taken by another user
  if (email) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser && existingUser.id !== req.user.id) {
      throw AppError.conflict('This email is already in use');
    }
  }

  const updatedUser = await UserModel.updateProfile(req.user.id, { name, email });
  sendSuccess(res, { user: updatedUser }, 'Profile updated successfully');
});

/**
 * PUT /api/users/change-password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Verify current password
  const currentHash = await UserModel.getPasswordHash(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, currentHash);
  if (!isMatch) {
    throw AppError.unauthorized('Current password is incorrect');
  }

  // Hash and update new password
  const newHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
  await UserModel.updatePassword(req.user.id, newHash);

  sendSuccess(res, null, 'Password changed successfully');
});

module.exports = { getProfile, updateProfile, changePassword };
