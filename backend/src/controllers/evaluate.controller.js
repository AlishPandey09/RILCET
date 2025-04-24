import ReferenceValues from "../models/reference.model.js";

// Mean interpretation texts
const meanInterpretations = {
  within_95:
    "The value is within the 95% reference interval, indicating no relevant deviation from the expected range at this treatment stage.",
  within_99:
    "The value lies between the 95% and 99% reference intervals, suggesting a minor deviation that may still fall within acceptable clinical tolerance.",
  outside_99: {
    L: "The L* value lies outside the 99% reference interval, indicating a substantial deviation in brightness. This may reflect severe staining, over-bleaching, or loss of enamel translucency.",
    a: "The a* value lies outside the 99% reference interval, indicating a pronounced chromatic shift along the red–green axis. This deviation may impair visual integration with surrounding enamel.",
    b: "The b* value lies outside the 99% reference interval, indicating an exaggerated yellowish chroma or loss of blue content. This could result from pigment accumulation or infiltrant aging.",
  },
};

// SD interpretation texts
const sdInterpretations = {
  within_95: "Standard deviation is within expected variability.",
  within_99: "Slightly elevated SD – minor measurement variability.",
  outside_99: "High SD – possible inconsistency in color measurements.",
  fallback: "Standard deviation recorded for confidence interval estimation.",
};

// Cohen's d interpretation ranges
const dRanges = [
  {
    min: 0.0,
    max: 0.19,
    message:
      "Negligible color change typically observed at this treatment stage.",
  },
  {
    min: 0.2,
    max: 0.49,
    message:
      "Small but perceptible effect size. Color shifts are likely visible at conversational distance.",
  },
  {
    min: 0.5,
    max: 0.79,
    message:
      "Moderate effect size. Color differences are clearly perceivable and likely relevant to patients.",
  },
  {
    min: 0.8,
    max: 1.29,
    message:
      "Large color difference commonly observed. Typically seen after bleaching or staining interventions.",
  },
  {
    min: 1.3,
    max: 9.99,
    message:
      "Very large effect size. Strong aesthetic impact typically associated with advanced treatment transitions.",
  },
];

// Evaluate if value falls within 95%, 99%, or outside
function evaluateMean(val, ci95, ci99) {
  if (val >= ci95.lower && val <= ci95.upper) return "within_95";
  if (val >= ci99.lower && val <= ci99.upper) return "within_99";
  return "outside_99";
}

// Evaluate SD using ci95.sd and ci99.sd
function evaluateSD(userSD, ci95, ci99) {
  if (
    typeof userSD !== "number" ||
    typeof ci95?.lower !== "number" ||
    typeof ci95?.upper !== "number" ||
    typeof ci99?.lower !== "number" ||
    typeof ci99?.upper !== "number"
  ) {
    return "fallback";
  }

  if (userSD >= ci95.lower && userSD <= ci95.upper) return "within_95";
  if (userSD >= ci99.lower && userSD <= ci99.upper) return "within_99";
  return "outside_99";
}

// Interpret Cohen’s d
function interpretD(d) {
  if (typeof d !== "number" || isNaN(d)) return "Not available";
  const entry = dRanges.find(
    (r) => Math.abs(d) >= r.min && Math.abs(d) <= r.max
  );
  return entry ? entry.message : "Not available";
}

// Main evaluation endpoint
export async function evaluate(req, res) {
  const { treatmentGroup, treatmentStage, userValues } = req.body;

  if (!treatmentGroup || !treatmentStage || !userValues) {
    return res.status(400).json({
      error: "Missing treatmentGroup, treatmentStage, or userValues",
    });
  }

  const refDoc = await ReferenceValues.findOne({
    treatmentGroup,
    treatmentStage,
  });

  if (!refDoc) {
    return res.status(404).json({
      error: "Reference data not found for that group/stage",
    });
  }

  const rd = refDoc.referenceData;
  const paramKeys = ["L", "a", "b"];
  const individual = {};
  let worst = "within_95";

  paramKeys.forEach((key) => {
    const userMean = userValues[key].mean;
    const userSD = userValues[key].sd;
    const statusKey = evaluateMean(
      userMean,
      rd[key].ci95.mean,
      rd[key].ci99.mean
    );

    const symbol =
      statusKey === "within_95"
        ? "✅"
        : statusKey === "within_99"
        ? "🟧"
        : "❌";

    const interp =
      statusKey === "outside_99"
        ? meanInterpretations.outside_99[key]
        : meanInterpretations[statusKey];

    if (statusKey === "outside_99") worst = "outside_99";
    else if (statusKey === "within_99" && worst === "within_95")
      worst = "within_99";

    // Evaluate SD
    let sdStatusKey = "fallback";
    let sdInterp = sdInterpretations.fallback;

    if (rd[key]?.ci95?.sd && rd[key]?.ci99?.sd) {
      sdStatusKey = evaluateSD(userSD, rd[key].ci95.sd, rd[key].ci99.sd);
      sdInterp = sdInterpretations[sdStatusKey];
    }

    individual[key] = {
      mean: {
        value: userMean,
        ref95: rd[key].ci95.mean,
        ref99: rd[key].ci99.mean,
        status: symbol,
        interpretation: interp,
      },
      sd: {
        value: userSD,
        status: "–",
        ref95:
          sdStatusKey !== "fallback"
            ? rd[key].ci95.sd
            : { lower: null, upper: null },
        ref99:
          sdStatusKey !== "fallback"
            ? rd[key].ci99.sd
            : { lower: null, upper: null },
        interpretation: sdInterp,
      },
    };
  });

  const overall = {
    symbol: worst === "within_95" ? "🟢" : worst === "within_99" ? "🟧" : "❌",
    message:
      worst === "within_95"
        ? "✅ Color values are within the expected range for this treatment stage. No clinically relevant deviation detected."
        : worst === "within_99"
        ? "⚠️ Minor color deviation detected. One or more parameters lie between the 95% and 99% confidence interval. Monitor results or verify clinical context."
        : "❌ Significant color deviation detected. One or more parameters lie outside the 99% confidence interval.",
  };

  const refCohensD = {
    L: rd.L?.cohensD ?? null,
    a: rd.a?.cohensD ?? null,
    b: rd.b?.cohensD ?? null,
  };

  const refCohensDInterp = {
    L: refCohensD.L != null ? interpretD(refCohensD.L) : "Not available",
    a: refCohensD.a != null ? interpretD(refCohensD.a) : "Not available",
    b: refCohensD.b != null ? interpretD(refCohensD.b) : "Not available",
  };

  return res.json({
    selectedGroup: treatmentGroup,
    treatmentStage: treatmentStage,
    overallAssessment: overall,
    individualParameters: individual,
    referenceCohensD: {
      L: {
        value: refCohensD.L,
        interpretation: refCohensDInterp.L,
      },
      a: {
        value: refCohensD.a,
        interpretation: refCohensDInterp.a,
      },
      b: {
        value: refCohensD.b,
        interpretation: refCohensDInterp.b,
      },
    },
  });
}
