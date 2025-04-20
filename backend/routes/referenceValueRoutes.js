const express = require('express');
const multer = require('multer');
const { uploadReferenceValues } = require('../controllers/referenceValueController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadReferenceValues);

module.exports = router;
