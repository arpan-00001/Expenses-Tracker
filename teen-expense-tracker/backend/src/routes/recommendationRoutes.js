const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', recommendationController.getRecommendations);

module.exports = router;
