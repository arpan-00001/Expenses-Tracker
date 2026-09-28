const BudgetModel = require('../models/BudgetModel');
const CategoryModel = require('../models/CategoryModel');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/budgets
 */
const getBudgets = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const budgets = await BudgetModel.findByUserId(
    req.user.id,
    month ? parseInt(month) : undefined,
    year ? parseInt(year) : undefined
  );
  sendSuccess(res, { budgets });
});

/**
 * GET /api/budgets/:id
 */
const getBudget = catchAsync(async (req, res) => {
  const budget = await BudgetModel.findById(req.params.id, req.user.id);
  if (!budget) {
    throw AppError.notFound('Budget not found');
  }
  sendSuccess(res, { budget });
});

/**
 * POST /api/budgets
 */
const createBudget = catchAsync(async (req, res) => {
  const { category_id, amount, month, year } = req.body;

  // Verify category
  const category = await CategoryModel.findById(category_id, req.user.id);
  if (!category) {
    throw AppError.badRequest('Invalid category');
  }

  // Check for duplicate budget
  const existing = await BudgetModel.findByUserCategoryMonth(req.user.id, category_id, month, year);
  if (existing) {
    throw AppError.conflict('A budget already exists for this category and month');
  }

  const budget = await BudgetModel.create({
    user_id: req.user.id,
    category_id,
    amount: parseFloat(amount),
    month: parseInt(month),
    year: parseInt(year),
  });

  sendCreated(res, { budget }, 'Budget created successfully');
});

/**
 * PUT /api/budgets/:id
 */
const updateBudget = catchAsync(async (req, res) => {
  const existing = await BudgetModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Budget not found');
  }

  const budget = await BudgetModel.update(req.params.id, req.user.id, req.body);
  sendSuccess(res, { budget }, 'Budget updated successfully');
});

/**
 * DELETE /api/budgets/:id
 */
const deleteBudget = catchAsync(async (req, res) => {
  const existing = await BudgetModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Budget not found');
  }

  await BudgetModel.delete(req.params.id, req.user.id);
  sendSuccess(res, null, 'Budget deleted successfully');
});

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
