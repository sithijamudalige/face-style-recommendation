const styles = require('../data/styles.json');

const toneThresholds = [
  { max: 85, tone: 'deep' },
  { max: 140, tone: 'medium' },
  { max: 255, tone: 'fair' },
];

const getNearestTone = (brightness) => {
  const matched = toneThresholds.find(({ max }) => brightness <= max);
  return matched ? matched.tone : 'medium';
};

const mapToFaceShape = (value) => {
  const shapes = ['oval', 'round', 'square', 'diamond', 'heart'];
  return shapes[value % shapes.length];
};

const mapToHairType = (value) => {
  const types = ['straight', 'wavy', 'curly', 'coily'];
  return types[value % types.length];
};

const fallback = {
  hairstyles: ['Textured crop'],
  beardStyles: ['Stubble'],
  fashionChoices: ['Neutral fitted basics'],
};

const getRecommendations = ({ faceShape, hairType, skinColor }) => {
  const shapeKey = String(faceShape || '').toLowerCase();
  const hairKey = String(hairType || '').toLowerCase();
  const toneKey = String(skinColor || '').toLowerCase();

  const shapeSet = styles.faceShapes[shapeKey] || fallback.hairstyles;
  const hairSet = styles.hairTypes[hairKey] || fallback.hairstyles;
  const beardSet = styles.beardByFaceShape[shapeKey] || fallback.beardStyles;
  const fashionSet = styles.fashionBySkinTone[toneKey] || fallback.fashionChoices;

  return {
    hairstyles: [...new Set([...shapeSet, ...hairSet])],
    beardStyles: beardSet,
    fashionChoices: fashionSet,
  };
};

module.exports = {
  getRecommendations,
  getNearestTone,
  mapToFaceShape,
  mapToHairType,
};
