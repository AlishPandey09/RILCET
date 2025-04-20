const express = require('express');
const {
  saveEvaluationResult,
  getEvaluationResult,
  evaluateColor
} = require('../controllers/evaluaitonResultController');

const router = express.Router();

// POST route for saving evaluation results
router.post('/', saveEvaluationResult);
router.get('/e-results', getEvaluationResult);

// NEW: Route for evaluating color values
router.post('/evaluate', evaluateColor);

module.exports = router;
