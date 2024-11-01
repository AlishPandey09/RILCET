// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const treatmentStageRoutes = require('./routes/treatmentStageRoutes');
const evaluationResultRoutes = require("./routes/evaluationResultRoutes");
const http = require("http");
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Use the treatment stages routes
app.use('/treatment-stages', treatmentStageRoutes);
app.use('/evaluation', evaluationResultRoutes);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log("New client connected");

  // handle disconnection
  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});