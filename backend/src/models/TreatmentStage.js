const mongoose = require('mongoose');

const TreatmentStageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ranges: {
    '95%': {
      L: [Number],
      A: [Number],
      B: [Number]
    },
    '99%': {
      L: [Number],
      A: [Number],
      B: [Number]
    }
  }
}, { collection: "treatment-stages" });

module.exports = mongoose.model('TreatmentStage', TreatmentStageSchema);