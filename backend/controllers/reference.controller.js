// controllers/referenceController.js

const fs = require("fs");
const XLSX = require("xlsx");
const ReferenceValues = require("../models/reference.model");

const treatmentGroups = [
  "Control (no treatment before re-bleaching)",
  "Infiltration only (with re-bleaching)",
  "Infiltration + In-Office Bleaching (with re-bleaching)",
  "Infiltration + Home Bleaching (with re-bleaching)",
];

const treatmentStages = [
  { code: "T0", label: "Natural tooth" },
  { code: "T1", label: "After WSL creation" },
  { code: "T2", label: "After resin infiltration" },
  { code: "T3", label: "After bleaching" },
  { code: "T4", label: "After waiting period (14 Days)" },
  { code: "T5", label: "After thermocycling" },
  { code: "T6", label: "After coffee exposure (Day 6)" },
  { code: "T7", label: "After coffee exposure (Day 12)" },
  { code: "T8", label: "After re-bleaching" },
  { code: "T9", label: "After waiting period (14 Days)" },
];

function calculateCohensD(currentMean, currentSD, prevMean, prevSD) {
  const pooledSD = Math.sqrt((prevSD ** 2 + currentSD ** 2) / 2);
  return parseFloat(((currentMean - prevMean) / pooledSD).toFixed(2));
}

exports.uploadReferenceCSV = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded (check field name)" });
  }

  const filePath = req.file.path;
  let workbook;
  try {
    workbook = XLSX.readFile(filePath);
  } catch (err) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "Failed to read Excel file" });
  }

  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });

  if (!rows.length) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "Excel sheet is empty" });
  }

  const entries = [];

  rows.forEach((row) => {
    const rawGroup = (row.Group || "").toString().trim();
    const rawStage = (row.timepoint || "").toString().trim();
    if (!rawGroup || !rawStage) return;

    // Map to full group label
    const groupName =
      treatmentGroups.find((g) => g.startsWith(rawGroup)) || rawGroup;

    // Extract code from rawStage, then map to formatted "CODE - Label"
    let stageName = rawStage;
    const codeMatch = rawStage.match(/^T(\d+)/);
    if (codeMatch) {
      const code = `T${codeMatch[1]}`;
      const stageObj = treatmentStages.find((s) => s.code === code);
      if (stageObj) {
        stageName = `${stageObj.code} - ${stageObj.label}`;
      }
    }

    const L = {
      mean: parseFloat(row.L_mean),
      sd: parseFloat(row.L_sd),
      ci95: {
        lower: parseFloat(row.L_mean_ci_95_lower),
        upper: parseFloat(row.L_mean_ci_95_upper),
      },
      ci99: {
        lower: parseFloat(row.L_mean_ci_99_lower),
        upper: parseFloat(row.L_mean_ci_99_upper),
      },
    };
    const a = {
      mean: parseFloat(row.a_mean),
      sd: parseFloat(row.a_sd),
      ci95: {
        lower: parseFloat(row.a_mean_ci_95_lower),
        upper: parseFloat(row.a_mean_ci_95_upper),
      },
      ci99: {
        lower: parseFloat(row.a_mean_ci_99_lower),
        upper: parseFloat(row.a_mean_ci_99_upper),
      },
    };
    const b = {
      mean: parseFloat(row.b_mean),
      sd: parseFloat(row.b_sd),
      ci95: {
        lower: parseFloat(row.b_mean_ci_95_lower),
        upper: parseFloat(row.b_mean_ci_95_upper),
      },
      ci99: {
        lower: parseFloat(row.b_mean_ci_99_lower),
        upper: parseFloat(row.b_mean_ci_99_upper),
      },
    };

    entries.push({
      treatmentGroup: groupName,
      treatmentStage: stageName,
      L,
      a,
      b,
    });
  });

  if (!entries.length) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "No valid data to upload" });
  }

  entries.sort((x, y) => {
    const num = (s) => {
      const m = s.match(/^T(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    };
    return num(x.treatmentStage) - num(y.treatmentStage);
  });

  try {
    for (let i = 0; i < entries.length; i++) {
      const { treatmentGroup, treatmentStage, L, a, b } = entries[i];
      let cohensD = null;
      if (i > 0) {
        const prev = entries[i - 1];
        cohensD = parseFloat(
          (
            (calculateCohensD(L.mean, L.sd, prev.L.mean, prev.L.sd) +
              calculateCohensD(a.mean, a.sd, prev.a.mean, prev.a.sd) +
              calculateCohensD(b.mean, b.sd, prev.b.mean, prev.b.sd)) /
            3
          ).toFixed(2)
        );
      }

      await new ReferenceValues({
        treatmentGroup,
        treatmentStage,
        referenceData: { L, a, b, cohensD },
      }).save();
    }

    fs.unlinkSync(filePath);
    return res.json({ message: "Reference values uploaded and saved" });
  } catch (error) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: error.message });
  }
};
