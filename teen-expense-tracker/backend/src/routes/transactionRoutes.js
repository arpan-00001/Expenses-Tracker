const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');
const { transactionRules, idParamRule, validate } = require('../validators');

router.use(authenticate);

router.get('/', transactionController.getTransactions);
router.get('/:id', idParamRule, validate, transactionController.getTransaction);
router.post('/', transactionRules, validate, transactionController.createTransaction);
router.put('/:id', idParamRule, validate, transactionController.updateTransaction);
router.delete('/:id', idParamRule, validate, transactionController.deleteTransaction);

module.exports = router;
