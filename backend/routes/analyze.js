const express = require('express');
const multer = require('multer');
const {
  analyzeImage,
  analyzeRealtime,
} = require('../controllers/faceController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), analyzeImage);
router.post('/realtime', analyzeRealtime);

module.exports = router;
