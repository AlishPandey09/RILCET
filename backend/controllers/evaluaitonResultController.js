const EvaluationResult = require('../models/EvaluationResultModels');
const { io } = require("../server");

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

        // Emit an event to all connected clients
        io.emit('newEvaluationResult', newEvaluation);

        res.status(201).json({ message: 'Evaluation result saved successfully', evaluation: newEvaluation });
    } catch (error) {
        res.status(500).json({ message: 'Error saving evaluation result', error });
    }
};

const getEvaluationResult = async (req, res) => {
    try {
        const results = await EvaluationResult.find();
        res.json(results);
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
};

module.exports = { saveEvaluationResult, getEvaluationResult };
