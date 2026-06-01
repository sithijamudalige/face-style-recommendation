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

const estimateSkinTone = (videoElement, box) => {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(Math.floor(box.width / 3), 1)
  canvas.height = Math.max(Math.floor(box.height / 4), 1)

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    return tones[1]
  }

  const sx = Math.max(Math.floor(box.x + box.width / 3), 0)
  const sy = Math.max(Math.floor(box.y + box.height * 0.15), 0)
  context.drawImage(
    videoElement,
    sx,
    sy,
    Math.max(Math.floor(box.width / 3), 1),
    Math.max(Math.floor(box.height / 4), 1),
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  let lumaTotal = 0
  let pixels = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    lumaTotal += 0.2126 * r + 0.7152 * g + 0.0722 * b
    pixels += 1
  }

  const brightness = lumaTotal / Math.max(pixels, 1)
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
    skinColor: estimateSkinTone(videoElement, detection.detection.box),
    confidence: Number(detection.detection.score.toFixed(2)),
  }
}
