const {
  getRecommendations,
  getNearestTone,
  getDominantFaceShape,
  getLikelyHairType,
} = require('../utils/recommendations');

const byteAverage = (buffer) => {
  if (!buffer || !buffer.length) {
    return 127;
  }

  let total = 0;
  for (const value of buffer.values()) {
    total += value;
  }

  return Math.round(total / buffer.length);
};

const buildAnalysisFromImage = (buffer) => {
  const average = byteAverage(buffer);
  const shape = getDominantFaceShape(average);
  const hairType = getLikelyHairType(average);

  return {
    faceShape: shape,
    hairType,
    skinColor: getNearestTone(average),
  };
};

const sendRecommendationResponse = (res, analysis) => {
  const recommendations = getRecommendations(analysis);

  return res.status(200).json({
    analysis,
    recommendations,
  });
};

const analyzeImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'Image file is required in field "image".',
    });
  }

  const analysis = buildAnalysisFromImage(req.file.buffer);
  return sendRecommendationResponse(res, analysis);
};

const analyzeRealtime = (req, res) => {
  const { faceShape, hairType, skinColor, confidence } = req.body || {};

  if (!faceShape || !hairType || !skinColor) {
    return res.status(400).json({
      message: 'faceShape, hairType and skinColor are required.',
    });
  }

  const analysis = {
    faceShape: String(faceShape).toLowerCase(),
    hairType: String(hairType).toLowerCase(),
    skinColor: String(skinColor).toLowerCase(),
    confidence: typeof confidence === 'number' ? confidence : undefined,
  };

  return sendRecommendationResponse(res, analysis);
};

module.exports = {
  analyzeImage,
  analyzeRealtime,
};
