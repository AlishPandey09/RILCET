import mongoose from "mongoose";

const ciSchema = {
  lower: Number,
  upper: Number,
};

const colorParamSchema = {
  mean: Number,
  sd: Number,
  ci95: {
    mean: ciSchema,
    sd: ciSchema,
  },
  ci99: {
    mean: ciSchema,
    sd: ciSchema,
  },
  cohensD: Number,
};

const referenceValuesSchema = new mongoose.Schema({
  treatmentGroup: String,
  treatmentStage: String,
  referenceData: {
    L: colorParamSchema,
    a: colorParamSchema,
    b: colorParamSchema,
  },
});

const ReferenceValues = mongoose.model(
  "reference_values",
  referenceValuesSchema
);
export default ReferenceValues;
