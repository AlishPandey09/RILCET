const mongoose = require("mongoose");

const referenceValuesSchema = new mongoose.Schema({
  treatmentGroup: String,
  treatmentStage: String,
  referenceData: {
    L: {
      mean: Number,
      sd: Number,
      ci95: {
        lower: Number,
        upper: Number,
      },
      ci99: {
        lower: Number,
        upper: Number,
      },
    },
    a: {
      mean: Number,
      sd: Number,
      ci95: {
        lower: Number,
        upper: Number,
      },
      ci99: {
        lower: Number,
        upper: Number,
      },
    },
    b: {
      mean: Number,
      sd: Number,
      ci95: {
        lower: Number,
        upper: Number,
      },
      ci99: {
        lower: Number,
        upper: Number,
      },
    },
    cohensD: Number,
  },
});

module.exports = mongoose.model("ReferenceValues", referenceValuesSchema);
