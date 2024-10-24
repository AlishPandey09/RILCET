const express = require('express');
const { saveEvaluationResult } = require('../controllers/evaluaitonResultController');

const router = express.Router();

// POST route for saving evaluation results
router.post('/', saveEvaluationResult);

module.exports = router;