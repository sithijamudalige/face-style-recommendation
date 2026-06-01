const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'

const faceApiReady = () =>
  typeof window !== 'undefined' && window.faceapi && window.tf

const tones = ['deep', 'medium', 'fair']

export const loadFaceApiModels = async () => {
  if (!faceApiReady()) {
    throw new Error('face-api scripts not loaded')
  }

  await Promise.all([
    window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    window.faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
  ])
}

const estimateFaceShape = (landmarks) => {
  const jaw = landmarks.getJawOutline()
  const width = Math.abs(jaw[0].x - jaw[16].x)
  const height = Math.abs(jaw[8].y - jaw[0].y)
  const ratio = width / Math.max(height, 1)

  if (ratio > 1.35) return 'round'
  if (ratio > 1.2) return 'square'
  if (ratio < 0.95) return 'diamond'
  return 'oval'
}

const estimateHairType = (landmarks) => {
  const nose = landmarks.getNose()
  const jaw = landmarks.getJawOutline()
  const variance = Math.abs(nose[0].x - jaw[8].x)

  if (variance < 5) return 'straight'
  if (variance < 11) return 'wavy'
  if (variance < 16) return 'curly'
  return 'coily'
}

const estimateSkinTone = (box) => {
  const brightness = (box.width + box.height) % 255
  if (brightness < 85) return tones[0]
  if (brightness < 140) return tones[1]
  return tones[2]
}

export const analyzeVideoFrame = async (videoElement) => {
  if (!faceApiReady()) {
    return null
  }

  const detection = await window.faceapi
    .detectSingleFace(videoElement, new window.faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true)

  if (!detection) {
    return null
  }

  return {
    faceShape: estimateFaceShape(detection.landmarks),
    hairType: estimateHairType(detection.landmarks),
    skinColor: estimateSkinTone(detection.detection.box),
    confidence: Number(detection.detection.score.toFixed(2)),
  }
}
