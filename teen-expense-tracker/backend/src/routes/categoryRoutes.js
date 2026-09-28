const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { categoryRules, idParamRule, validate } = require('../validators');

router.use(authenticate);

router.get('/', categoryController.getCategories);
router.get('/:id', idParamRule, validate, categoryController.getCategory);
router.post('/', categoryRules, validate, categoryController.createCategory);
router.put('/:id', idParamRule, validate, categoryController.updateCategory);
router.delete('/:id', idParamRule, validate, categoryController.deleteCategory);

module.exports = router;
