const mongoose = require('mongoose');

const EvaluationResultSchema = new mongoose.Schema({
    treatmentStage: { type: String, required: true },
    L: { type: Number, required: true },
    A: { type: Number, required: true },
    B: { type: Number, required: true },
    result: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

const EvaluationResult = mongoose.model('EvaluationResult', EvaluationResultSchema);

module.exports = EvaluationResult;
