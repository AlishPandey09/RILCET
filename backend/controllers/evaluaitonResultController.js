const EvaluationResult = require('../models/EvaluationResultModels');

// Controller function to save evaluation result
const saveEvaluationResult = async (req, res) => {
    const { treatmentStage, L, A, B, result, time } = req.body;

    try {
        const newEvaluation = new EvaluationResult({
            treatmentStage,
            L,
            A,
            B,
            result,
            time
        });

        await newEvaluation.save();
        res.status(201).json({ message: 'Evaluation result saved successfully', evaluation: newEvaluation });
    } catch (error) {
        res.status(500).json({ message: 'Error saving evaluation result', error });
    }
};

module.exports = { saveEvaluationResult };
