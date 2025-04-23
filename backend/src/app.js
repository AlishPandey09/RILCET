import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes

import evaluateRouter from "./routes/evaluate.route.js";
import referenceRouter from "./routes/reference.route.js";

// routes declaration

app.use("/api/v1/evaluate", evaluateRouter);
app.use("/api/v1/reference", referenceRouter);

export default app;
