const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/summary', analyticsController.getSummary);
router.get('/categories', analyticsController.getCategoryBreakdown);
router.get('/monthly', analyticsController.getMonthlyData);
router.get('/trends', analyticsController.getTrends);
router.get('/budget-usage', analyticsController.getBudgetUsage);

module.exports = router;
