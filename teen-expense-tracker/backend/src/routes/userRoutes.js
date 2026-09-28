const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { updateProfileRules, changePasswordRules, validate } = require('../validators');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileRules, validate, userController.updateProfile);
router.put('/change-password', changePasswordRules, validate, userController.changePassword);

module.exports = router;
