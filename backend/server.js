// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const referenceRoutes = require("./routes/reference.route");
const treatmentStageRoutes = require("./routes/treatmentStageRoutes");
const evaluationResultRoutes = require("./routes/evaluate.route");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API Routes
app.use("/api/v1/reference", referenceRoutes);
app.use("/api/v1/treatment-stages", treatmentStageRoutes);
app.use("/api/v1/evaluation", evaluationResultRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ LAB Color Tool backend is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
