const mongoose = require('mongoose');

const ReferenceValueSchema = new mongoose.Schema({
  treatmentGroup: {
    type: String,
    enum: [
      'Control',
      'Infiltration only',
      'Infiltration + In-Office Bleaching',
      'Infiltration + Home Bleaching'
    ],
    required: true
  },
  treatmentStage: { type: String, required: true },
  values: {
    L: {
      ci95: [Number],
      ci99: [Number],
      sd95: Number,
      sd99: Number
    },
    a: {
      ci95: [Number],
      ci99: [Number],
      sd95: Number,
      sd99: Number
    },
    b: {
      ci95: [Number],
      ci99: [Number],
      sd95: Number,
      sd99: Number
    }
  },
  cohens_d: Number
}, { collection: "reference-values" });

module.exports = mongoose.model('ReferenceValue', ReferenceValueSchema);
