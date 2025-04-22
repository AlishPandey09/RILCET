// server.js
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
  });

// // Middleware
// app.use(cors());
// app.use(express.json()); // For parsing application/json

// // API Routes
// app.use("/api/v1/reference", referenceRoutes);
// app.use("/api/v1/treatment-stages", treatmentStageRoutes);
// app.use("/api/v1/evaluation", evaluationResultRoutes);

// // Health Check Route
// app.get("/", (req, res) => {
//   res.send("✅ LAB Color Tool backend is running.");
// });
