const SavingsGoalModel = require('../models/SavingsGoalModel');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/savings-goals
 */
const getSavingsGoals = catchAsync(async (req, res) => {
  const goals = await SavingsGoalModel.findByUserId(req.user.id);

  // Enrich with progress info
  const enriched = goals.map((goal) => {
    const target = parseFloat(goal.target_amount);
    const current = parseFloat(goal.current_amount);
    const progress = target > 0 ? Math.round((current / target) * 10000) / 100 : 0;
    const remaining = Math.max(0, Math.round((target - current) * 100) / 100);

    return {
      ...goal,
      progress,
      remaining,
    };
  });

  sendSuccess(res, { goals: enriched });
});

/**
 * GET /api/savings-goals/:id
 */
const getSavingsGoal = catchAsync(async (req, res) => {
  const goal = await SavingsGoalModel.findById(req.params.id, req.user.id);
  if (!goal) {
    throw AppError.notFound('Savings goal not found');
  }

  const target = parseFloat(goal.target_amount);
  const current = parseFloat(goal.current_amount);
  const progress = target > 0 ? Math.round((current / target) * 10000) / 100 : 0;
  const remaining = Math.max(0, Math.round((target - current) * 100) / 100);

  sendSuccess(res, {
    goal: { ...goal, progress, remaining },
  });
});

/**
 * POST /api/savings-goals
 */
const createSavingsGoal = catchAsync(async (req, res) => {
  const { name, target_amount, current_amount, deadline } = req.body;

  const goal = await SavingsGoalModel.create({
    user_id: req.user.id,
    name,
    target_amount: parseFloat(target_amount),
    current_amount: current_amount ? parseFloat(current_amount) : 0,
    deadline,
  });

  sendCreated(res, { goal }, 'Savings goal created successfully');
});

/**
 * PUT /api/savings-goals/:id
 */
const updateSavingsGoal = catchAsync(async (req, res) => {
  const existing = await SavingsGoalModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Savings goal not found');
  }

  const goal = await SavingsGoalModel.update(req.params.id, req.user.id, req.body);
  sendSuccess(res, { goal }, 'Savings goal updated successfully');
});

/**
 * POST /api/savings-goals/:id/add-money
 */
const addMoney = catchAsync(async (req, res) => {
  const { amount } = req.body;

  if (!amount || parseFloat(amount) <= 0) {
    throw AppError.badRequest('Amount must be a positive number');
  }

  const goal = await SavingsGoalModel.addMoney(req.params.id, req.user.id, parseFloat(amount));
  if (!goal) {
    throw AppError.notFound('Savings goal not found');
  }

  sendSuccess(res, { goal }, `₹${parseFloat(amount).toFixed(2)} added to savings goal`);
});

/**
 * DELETE /api/savings-goals/:id
 */
const deleteSavingsGoal = catchAsync(async (req, res) => {
  const existing = await SavingsGoalModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Savings goal not found');
  }

  await SavingsGoalModel.delete(req.params.id, req.user.id);
  sendSuccess(res, null, 'Savings goal deleted successfully');
});

module.exports = {
  getSavingsGoals,
  getSavingsGoal,
  createSavingsGoal,
  updateSavingsGoal,
  addMoney,
  deleteSavingsGoal,
};
