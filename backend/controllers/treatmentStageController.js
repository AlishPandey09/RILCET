const TreatmentStage = require('../models/TreatmentStage');

// Fetch all treatment stages
const getTreatmentStages = async (req, res) => {
  try {
    const stages = await TreatmentStage.find();
    res.json(stages);
    // res.status(200).json({ message: "Fetching success." });
  } catch (error) {
    console.error('Error fetching treatment stages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkValueRange = async (req, res) => {
  const { treatmentStage, L, A, B } = req.body; // Expecting treatmentStage, L, A, B from the request body
  try {
    const stage = await TreatmentStage.findOne({ treatmentStage: treatmentStage }); // Ensure this matches your MongoDB schema

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


module.exports = {
  getTreatmentStages,
  checkValueRange,
};
