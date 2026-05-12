const express = require('express');
const axios = require('axios');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// @desc    Get AI Analytics
// @route   GET /api/analytics
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Call Python AI Service
    const aiResponse = await axios.get('http://localhost:5001/api/analytics');
    
    res.status(200).json({
      success: true,
      data: aiResponse.data
    });
  } catch (err) {
    // Fallback if AI service is down
    res.status(200).json({
      success: true,
      data: {
        adherence_rate: 85.0,
        weekly_trends: [
          { name: 'Mon', percentage: 90 },
          { name: 'Tue', percentage: 80 },
          { name: 'Wed', percentage: 95 },
          { name: 'Thu', percentage: 70 },
          { name: 'Fri', percentage: 85 },
          { name: 'Sat', percentage: 100 },
          { name: 'Sun', percentage: 90 }
        ],
        best_time: "08:00 AM",
        worst_time: "09:00 PM",
        fallback: true
      }
    });
  }
});

// @desc    Predict missed dose risk
// @route   POST /api/analytics/predict
// @access  Private
router.post('/predict', async (req, res) => {
  try {
    const aiResponse = await axios.post('http://localhost:5001/api/predict', req.body);
    
    res.status(200).json({
      success: true,
      data: aiResponse.data.prediction
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      data: {
        missed_dose_probability: 0.25,
        risk_level: "Low",
        confidence: 0.75,
        recommendation: "Maintain your current schedule.",
        fallback: true
      }
    });
  }
});

module.exports = router;
