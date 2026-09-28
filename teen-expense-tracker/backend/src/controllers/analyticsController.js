const AnalyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/analytics/summary
 */
const getSummary = catchAsync(async (req, res) => {
  const summary = await AnalyticsService.getDashboardSummary(req.user.id);
  sendSuccess(res, summary);
});

/**
 * GET /api/analytics/categories
 */
const getCategoryBreakdown = catchAsync(async (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startDate = req.query.startDate || `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const endDate = req.query.endDate || new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

  const breakdown = await AnalyticsService.getCategoryBreakdown(req.user.id, startDate, endDate);
  sendSuccess(res, breakdown);
});

/**
 * GET /api/analytics/monthly
 */
const getMonthlyData = catchAsync(async (req, res) => {
  const months = parseInt(req.query.months) || 6;
  const data = await AnalyticsService.getMonthlyData(req.user.id, months);
  sendSuccess(res, { monthly: data });
});

/**
 * GET /api/analytics/trends
 */
const getTrends = catchAsync(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const trends = await AnalyticsService.getSpendingTrends(req.user.id, days);
  sendSuccess(res, { trends });
});

/**
 * GET /api/analytics/budget-usage
 */
const getBudgetUsage = catchAsync(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const usage = await AnalyticsService.getBudgetUsage(req.user.id, month, year);
  sendSuccess(res, { budgetUsage: usage });
});

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyData,
  getTrends,
  getBudgetUsage,
};
