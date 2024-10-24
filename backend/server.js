// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const treatmentStageRoutes = require('./routes/treatmentStageRoutes');
const evaluationResultRoutes = require("./routes/evaluationResultRoutes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Use the treatment stages routes
app.use('/treatment-stages', treatmentStageRoutes);
app.use('/evaluation', evaluationResultRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});