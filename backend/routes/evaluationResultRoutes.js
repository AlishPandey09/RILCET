const express = require('express');
const { saveEvaluationResult, getEvaluationResult } = require('../controllers/evaluaitonResultController');

const router = express.Router();

// POST route for saving evaluation results
router.post('/', saveEvaluationResult);
router.get('/e-results', getEvaluationResult);

module.exports = router;