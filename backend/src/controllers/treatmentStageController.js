const TreatmentStage = require('../models/TreatmentStage');

// Fetch all treatment stages
const getTreatmentStages = async (req, res) => {
  try {
    const stages = await TreatmentStage.find().sort({ name: 1 });
    res.json(stages);
  } catch (error) {
    console.error('Error fetching treatment stages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific treatment stage by name
const getTreatmentStageByName = async (req, res) => {
  const { name } = req.params;
  try {
    const stage = await TreatmentStage.findOne({ treatmentStage: name }); // Use treatmentStage instead of name
    if (!stage) {
      return res.status(404).json({ message: 'Treatment stage not found' });
    }
    res.json(stage);
  } catch (error) {
    console.error('Error fetching treatment stage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a treatment stage
const updateTreatmentStage = async (req, res) => {
  const { name } = req.params; // name refers to treatmentStage
  const updateData = req.body;

  try {
    const updatedStage = await TreatmentStage.findOneAndUpdate(
      { treatmentStage: name },
      updateData,
      { new: true }
    );
    if (!updatedStage) {
      return res.status(404).json({ message: 'Treatment stage not found' });
    }
    res.json(updatedStage);
  } catch (error) {
    console.error('Error updating treatment stage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check value range for treatment stage
const checkValueRange = async (req, res) => {
  const { treatmentStage, L, A, B } = req.body;

  try {
    const stage = await TreatmentStage.findOne({ treatmentStage: treatmentStage });

    if (!stage) {
      return res.status(404).json({ message: 'Treatment stage not found' });
    }

    const ranges = stage.ranges;
    let status = 'out_of_range'; // Default to out of range

    const is95Percent = L >= ranges['95%'].L[0] && L <= ranges['95%'].L[1] &&
                       A >= ranges['95%'].A[0] && A <= ranges['95%'].A[1] &&
                       B >= ranges['95%'].B[0] && B <= ranges['95%'].B[1];

    const is99Percent = L >= ranges['99%'].L[0] && L <= ranges['99%'].L[1] &&
                       A >= ranges['99%'].A[0] && A <= ranges['99%'].A[1] &&
                       B >= ranges['99%'].B[0] && B <= ranges['99%'].B[1];

    if (is95Percent) {
      status = 'green'; // 95% range
    } else if (is99Percent) {
      status = 'yellow'; // 99% range
    }

    res.json({
      treatmentStage: stage.treatmentStage,
      status
    });
  } catch (error) {
    console.error('Error checking value range:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new treatment stage
const createTreatmentStage = async (req, res) => {
  const { name, ranges } = req.body;

  if (!name || !ranges || !ranges['95%'] || !ranges['99%']) {
    return res.status(400).json({ message: 'Missing required fields: name and both confidence intervals (95% and 99%)' });
  }

  try {
    const existing = await TreatmentStage.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Treatment stage with this name already exists' });
    }

    const newStage = new TreatmentStage({ name, ranges });
    await newStage.save();

    res.status(201).json({ message: 'Treatment stage created successfully', stage: newStage });
  } catch (error) {
    console.error('Error creating treatment stage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTreatmentStages,
  getTreatmentStageByName,
  updateTreatmentStage,
  checkValueRange,
  createTreatmentStage,
};