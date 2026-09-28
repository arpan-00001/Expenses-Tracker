const express = require('express');
const router = express.Router();
const savingsGoalController = require('../controllers/savingsGoalController');
const { authenticate } = require('../middleware/auth');
const { savingsGoalRules, idParamRule, validate } = require('../validators');

router.use(authenticate);

router.get('/', savingsGoalController.getSavingsGoals);
router.get('/:id', idParamRule, validate, savingsGoalController.getSavingsGoal);
router.post('/', savingsGoalRules, validate, savingsGoalController.createSavingsGoal);
router.put('/:id', idParamRule, validate, savingsGoalController.updateSavingsGoal);
router.post('/:id/add-money', idParamRule, validate, savingsGoalController.addMoney);
router.delete('/:id', idParamRule, validate, savingsGoalController.deleteSavingsGoal);

module.exports = router;
