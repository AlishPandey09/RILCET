const express = require("express");
const router = express.Router();
const { evaluate } = require("../controllers/evaluate.controller");

router.post("/evaluate", express.json(), evaluate);

module.exports = router;
