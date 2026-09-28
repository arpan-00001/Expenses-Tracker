const RecommendationService = require('../services/recommendationService');
const { sendSuccess } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/recommendations
 */
const getRecommendations = catchAsync(async (req, res) => {
  const result = await RecommendationService.generateRecommendations(req.user.id);
  sendSuccess(res, result);
});

module.exports = { getRecommendations };
