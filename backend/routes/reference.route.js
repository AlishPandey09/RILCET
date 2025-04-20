// routes/reference.js
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadReferenceCSV } = require("../controllers/reference.controller");

const router = express.Router();

router.post("/upload", upload.single("referenceFile"), uploadReferenceCSV);

module.exports = router;
