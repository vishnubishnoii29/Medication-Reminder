const express = require('express');
const analyticsController = require('../../controllers/analyticsController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', analyticsController.getDashboardStats);
router.post('/predict', analyticsController.getAIPrediction);

module.exports = router;
