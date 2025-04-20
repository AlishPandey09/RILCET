const csv = require('csv-parser');
const fs = require('fs');
const ReferenceValue = require('../models/ReferenceValue');

const uploadReferenceValues = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No CSV file uploaded' });

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      try {
        const document = {
          treatmentGroup: data.treatmentGroup.trim(),
          treatmentStage: data.treatmentStage.trim(),
          values: {
            L: {
              ci95: [parseFloat(data.L_ci95_min), parseFloat(data.L_ci95_max)],
              ci99: [parseFloat(data.L_ci99_min), parseFloat(data.L_ci99_max)],
              sd95: parseFloat(data.L_sd95),
              sd99: parseFloat(data.L_sd99)
            },
            a: {
              ci95: [parseFloat(data.a_ci95_min), parseFloat(data.a_ci95_max)],
              ci99: [parseFloat(data.a_ci99_min), parseFloat(data.a_ci99_max)],
              sd95: parseFloat(data.a_sd95),
              sd99: parseFloat(data.a_sd99)
            },
            b: {
              ci95: [parseFloat(data.b_ci95_min), parseFloat(data.b_ci95_max)],
              ci99: [parseFloat(data.b_ci99_min), parseFloat(data.b_ci99_max)],
              sd95: parseFloat(data.b_sd95),
              sd99: parseFloat(data.b_sd99)
            }
          },
          cohens_d: data.cohens_d ? parseFloat(data.cohens_d) : null
        };
        results.push(document);
      } catch (error) {
        console.error("Data parse error:", error);
      }
    })
    .on('end', async () => {
      try {
        await ReferenceValue.insertMany(results);
        res.status(200).json({ message: 'Reference values uploaded successfully', count: results.length });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to insert data', error: err.message });
      }
    });
};

module.exports = { uploadReferenceValues };
