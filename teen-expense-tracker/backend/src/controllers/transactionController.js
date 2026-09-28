const TransactionModel = require('../models/TransactionModel');
const CategoryModel = require('../models/CategoryModel');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/transactions
 */
const getTransactions = catchAsync(async (req, res) => {
  const filters = {
    type: req.query.type,
    category_id: req.query.category_id,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    search: req.query.search,
    payment_method: req.query.payment_method,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    page: req.query.page,
    limit: req.query.limit,
  };

  const result = await TransactionModel.findByUserId(req.user.id, filters);
  sendSuccess(res, result);
});

/**
 * GET /api/transactions/:id
 */
const getTransaction = catchAsync(async (req, res) => {
  const transaction = await TransactionModel.findById(req.params.id, req.user.id);
  if (!transaction) {
    throw AppError.notFound('Transaction not found');
  }
  sendSuccess(res, { transaction });
});

/**
 * POST /api/transactions
 */
const createTransaction = catchAsync(async (req, res) => {
  const { type, amount, category_id, description, transaction_date, payment_method } = req.body;

  // Verify category belongs to user or is a default category
  const category = await CategoryModel.findById(category_id, req.user.id);
  if (!category) {
    throw AppError.badRequest('Invalid category');
  }

  const transaction = await TransactionModel.create({
    user_id: req.user.id,
    category_id,
    type,
    amount: parseFloat(amount),
    description: description || '',
    transaction_date,
    payment_method: payment_method || 'Cash',
  });

  sendCreated(res, { transaction }, 'Transaction created successfully');
});

/**
 * PUT /api/transactions/:id
 */
const updateTransaction = catchAsync(async (req, res) => {
  // Verify transaction exists and belongs to user
  const existing = await TransactionModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Transaction not found');
  }

  // Verify category if being updated
  if (req.body.category_id) {
    const category = await CategoryModel.findById(req.body.category_id, req.user.id);
    if (!category) {
      throw AppError.badRequest('Invalid category');
    }
  }

  const transaction = await TransactionModel.update(req.params.id, req.user.id, req.body);
  sendSuccess(res, { transaction }, 'Transaction updated successfully');
});

/**
 * DELETE /api/transactions/:id
 */
const deleteTransaction = catchAsync(async (req, res) => {
  const existing = await TransactionModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Transaction not found');
  }

  await TransactionModel.delete(req.params.id, req.user.id);
  sendSuccess(res, null, 'Transaction deleted successfully');
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
