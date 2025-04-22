import express from "express";
import multer from "multer";
import { uploadReferenceCSV } from "../controllers/reference.controller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("referenceFile"), uploadReferenceCSV);

export default router;
