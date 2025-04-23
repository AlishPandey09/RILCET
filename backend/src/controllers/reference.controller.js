import fs from "fs";
import XLSX from "xlsx";
import ReferenceValues from "../models/reference.model.js";

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

export const uploadReferenceCSV = async (req, res) => {
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

    const groupName =
      treatmentGroups.find((g) => g.startsWith(rawGroup)) || rawGroup;

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

    // Parse individual d values safely
    const dL = parseFloat(row.cohensD_L);
    const dA = parseFloat(row.cohensD_a);
    const dB = parseFloat(row.cohensD_b);

    let cohensD = null;
    if (!isNaN(dL) && !isNaN(dA) && !isNaN(dB)) {
      cohensD = parseFloat(((dL + dA + dB) / 3).toFixed(2));
    }

    entries.push({
      treatmentGroup: groupName,
      treatmentStage: stageName,
      referenceData: { L, a, b, cohensD },
    });
  });

  if (!entries.length) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "No valid data to upload" });
  }

  try {
    await ReferenceValues.deleteMany({}); // Optional: clear existing records
    await ReferenceValues.insertMany(entries);

    fs.unlinkSync(filePath);
    return res.json({ message: "Reference values uploaded and saved" });
  } catch (error) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: error.message });
  }
};
