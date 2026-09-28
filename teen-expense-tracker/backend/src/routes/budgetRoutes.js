const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authenticate } = require('../middleware/auth');
const { budgetRules, idParamRule, validate } = require('../validators');

router.use(authenticate);

router.get('/', budgetController.getBudgets);
router.get('/:id', idParamRule, validate, budgetController.getBudget);
router.post('/', budgetRules, validate, budgetController.createBudget);
router.put('/:id', idParamRule, validate, budgetController.updateBudget);
router.delete('/:id', idParamRule, validate, budgetController.deleteBudget);

module.exports = router;
