const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware that checks for validation errors from express-validator
 * and returns a 400 response if any are found.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw AppError.badRequest('Validation failed', messages);
  }
  next();
};

// ─── Auth Validators ───

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Transaction Validators ───

const transactionRules = [
  body('type')
    .notEmpty().withMessage('Transaction type is required')
    .isIn(['income', 'expense']).withMessage('Type must be "income" or "expense"'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isUUID().withMessage('Invalid category ID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
  body('transaction_date')
    .notEmpty().withMessage('Transaction date is required')
    .isISO8601().withMessage('Please provide a valid date'),
  body('payment_method')
    .optional()
    .isIn(['Cash', 'UPI', 'Debit Card', 'Bank Transfer', 'Other'])
    .withMessage('Invalid payment method'),
];

// ─── Budget Validators ───

const budgetRules = [
  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isUUID().withMessage('Invalid category ID'),
  body('amount')
    .notEmpty().withMessage('Budget amount is required')
    .isFloat({ gt: 0 }).withMessage('Budget amount must be a positive number'),
  body('month')
    .notEmpty().withMessage('Month is required')
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2020, max: 2100 }).withMessage('Year must be between 2020 and 2100'),
];

// ─── Savings Goal Validators ───

const savingsGoalRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Goal name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Goal name must be between 2 and 100 characters'),
  body('target_amount')
    .notEmpty().withMessage('Target amount is required')
    .isFloat({ gt: 0 }).withMessage('Target amount must be a positive number'),
  body('current_amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current amount cannot be negative'),
  body('deadline')
    .optional()
    .isISO8601().withMessage('Please provide a valid deadline date'),
];

// ─── Category Validators ───

const categoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('type')
    .notEmpty().withMessage('Category type is required')
    .isIn(['income', 'expense']).withMessage('Type must be "income" or "expense"'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('Icon must not exceed 10 characters'),
];

// ─── ID Param Validator ───

const idParamRule = [
  param('id')
    .isUUID().withMessage('Invalid ID format'),
];

// ─── Profile Validators ───

const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const changePasswordRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  transactionRules,
  budgetRules,
  savingsGoalRules,
  categoryRules,
  idParamRule,
  updateProfileRules,
  changePasswordRules,
};
