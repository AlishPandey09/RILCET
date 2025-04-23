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
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

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

    const getParam = (prefix) => ({
      mean: parseFloat(row[`${prefix}_mean`]),
      sd: parseFloat(row[`${prefix}_sd`]),
      ci95: {
        mean: {
          lower: parseFloat(row[`${prefix}_mean_ci_95_lower`]),
          upper: parseFloat(row[`${prefix}_mean_ci_95_upper`]),
        },
        sd: {
          lower: parseFloat(row[`${prefix}_sd_ci_95_lower`]),
          upper: parseFloat(row[`${prefix}_sd_ci_95_upper`]),
        },
      },
      ci99: {
        mean: {
          lower: parseFloat(row[`${prefix}_mean_ci_99_lower`]),
          upper: parseFloat(row[`${prefix}_mean_ci_99_upper`]),
        },
        sd: {
          lower: parseFloat(row[`${prefix}_sd_ci_99_lower`]),
          upper: parseFloat(row[`${prefix}_sd_ci_99_upper`]),
        },
      },
      cohensD: isNaN(parseFloat(row[`cohensD_${prefix}`]))
        ? null
        : parseFloat(row[`cohensD_${prefix}`]),
    });

    const L = getParam("L");
    const a = getParam("a");
    const b = getParam("b");

    entries.push({
      treatmentGroup: groupName,
      treatmentStage: stageName,
      referenceData: { L, a, b },
    });
  });

  if (!entries.length) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: "No valid data to upload" });
  }

  try {
    await ReferenceValues.deleteMany({});
    await ReferenceValues.insertMany(entries);
    fs.unlinkSync(filePath);
    return res.json({ message: "Reference values uploaded and saved" });
  } catch (error) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: error.message });
  }
};
