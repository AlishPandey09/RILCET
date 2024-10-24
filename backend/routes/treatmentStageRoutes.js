const express = require('express');
const router = express.Router();
const { getTreatmentStages, checkValueRange } = require('../controllers/treatmentStageController');

// Routes
router.get('/', getTreatmentStages);
router.post('/check', checkValueRange); // Keep this route for checking values

module.exports = router;