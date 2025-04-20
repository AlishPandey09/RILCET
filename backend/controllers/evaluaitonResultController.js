const EvaluationResult = require('../models/EvaluationResultModels');
const ReferenceValue = require('../models/ReferenceValue');
const { io } = require("../server");

// Save result to DB
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

    // Emit event
    io.emit('newEvaluationResult', newEvaluation);

    res.status(201).json({ message: 'Evaluation result saved successfully', evaluation: newEvaluation });
  } catch (error) {
    res.status(500).json({ message: 'Error saving evaluation result', error });
  }
};

// Get all results
const getEvaluationResult = async (req, res) => {
  try {
    const results = await EvaluationResult.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Evaluate based on reference values
const evaluateColor = async (req, res) => {
  const { treatmentGroup, treatmentStage, L, a, b } = req.body;

  try {
    if (!treatmentGroup || !treatmentStage || !L || !a || !b) {
      return res.status(400).json({ message: "Missing required input fields." });
    }
    
    const reference = await ReferenceValue.findOne({
      treatmentGroup: treatmentGroup.trim(),
      treatmentStage: { $regex: new RegExp(`^${treatmentStage.trim()}`) } // Match anything starting with e.g. "T1"
  });
      

    if (!reference) {
      return res.status(404).json({ message: "Reference values not found for this group + stage." });
    }

    const interpretMean = (mean, ci95, ci99, channel) => {
      if (mean >= ci95[0] && mean <= ci95[1]) {
        return { status: "🟢", message: `The ${channel}* value is within the 95% reference interval, indicating no relevant deviation from the expected range at this treatment stage.` };
      } else if (mean >= ci99[0] && mean <= ci99[1]) {
        return { status: "🟧", message: `The ${channel}* value lies between the 95% and 99% reference intervals, suggesting a minor deviation that may still fall within acceptable clinical tolerance.` };
      } else {
        const redMsg = {
          L: "The L* value lies outside the 99% reference interval, indicating a substantial deviation in brightness. This may reflect severe staining, over-bleaching, or loss of enamel translucency.",
          a: "The a* value lies outside the 99% reference interval, indicating a pronounced chromatic shift along the red–green axis. This deviation may impair visual integration with surrounding enamel.",
          b: "The b* value lies outside the 99% reference interval, indicating an exaggerated yellowish chroma or loss of blue content. This could result from pigment accumulation or infiltrant aging."
        };
        return { status: "❌", message: redMsg[channel] };
      }
    };

    const interpretSD = (sd, sd95, sd99) => {
      if (sd <= sd95) return "Standard deviation is within expected variability.";
      else if (sd <= sd99) return "Slightly elevated SD – minor measurement variability.";
      else return "High SD – possible inconsistency in color measurements.";
    };

    const getDMessage = (d) => {
      const ranges = [
        { min: 0.0, max: 0.19, message: "Negligible color change typically observed at this treatment stage." },
        { min: 0.2, max: 0.49, message: "Small but perceptible effect size. Color shifts are likely visible at conversational distance." },
        { min: 0.5, max: 0.79, message: "Moderate effect size. Color differences are clearly perceivable and likely relevant to patients." },
        { min: 0.8, max: 1.29, message: "Large color difference commonly observed. Typically seen after bleaching or staining interventions." },
        { min: 1.3, max: 9.99, message: "Very large effect size. Strong aesthetic impact typically associated with advanced treatment transitions." }
      ];
      const range = ranges.find(r => d >= r.min && d <= r.max);
      return range ? range.message : "No interpretation available.";
    };

    const Lresult = interpretMean(L.mean, reference.values.L.ci95, reference.values.L.ci99, "L");
    const aResult = interpretMean(a.mean, reference.values.a.ci95, reference.values.a.ci99, "a");
    const bResult = interpretMean(b.mean, reference.values.b.ci95, reference.values.b.ci99, "b");

    const allStatuses = [Lresult.status, aResult.status, bResult.status];
    let overall;
    if (allStatuses.every(s => s === "🟢")) {
      overall = {
        status: "🟢",
        message: "✅ Color values are within the expected range for this treatment stage. No clinically relevant deviation detected."
      };
    } else if (allStatuses.includes("❌")) {
      overall = {
        status: "❌",
        message: "❌ One or more color values are outside the 99% confidence interval. This indicates a clinically significant deviation."
      };
    } else {
      overall = {
        status: "🟧",
        message: "⚠️ Minor color deviation detected. One or more parameters lie between the 95% and 99% confidence interval. Monitor results or verify clinical context."
      };
    }

    const response = {
      context: {
        treatmentGroup,
        treatmentStage
      },
      overallAssessment: overall,
      cohens_d: {
        value: reference.cohens_d ?? null,
        message: reference.cohens_d !== null ? getDMessage(reference.cohens_d) : "No reference Cohen’s d available."
      },
      results: [
        {
          parameter: "L* (Mean)",
          userValue: L.mean,
          ci95: reference.values.L.ci95,
          ci99: reference.values.L.ci99,
          status: Lresult.status,
          interpretation: Lresult.message
        },
        {
          parameter: "L* (SD)",
          userValue: L.sd,
          interpretation: interpretSD(L.sd, reference.values.L.sd95, reference.values.L.sd99)
        },
        {
          parameter: "a* (Mean)",
          userValue: a.mean,
          ci95: reference.values.a.ci95,
          ci99: reference.values.a.ci99,
          status: aResult.status,
          interpretation: aResult.message
        },
        {
          parameter: "a* (SD)",
          userValue: a.sd,
          interpretation: interpretSD(a.sd, reference.values.a.sd95, reference.values.a.sd99)
        },
        {
          parameter: "b* (Mean)",
          userValue: b.mean,
          ci95: reference.values.b.ci95,
          ci99: reference.values.b.ci99,
          status: bResult.status,
          interpretation: bResult.message
        },
        {
          parameter: "b* (SD)",
          userValue: b.sd,
          interpretation: interpretSD(b.sd, reference.values.b.sd95, reference.values.b.sd99)
        }
      ]
    };

    res.json(response);

  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ message: "Evaluation failed", error: err.message });
  }
};

module.exports = {
  saveEvaluationResult,
  getEvaluationResult,
  evaluateColor
};
