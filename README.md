# Face Style Recommendation

A full-stack app that analyzes face characteristics from webcam or uploaded image and returns personalized style recommendations.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React (Hooks) + Vite
- **Face Detection:** face-api.js (browser loaded) + TensorFlow.js
- **Recommendations:** JSON-based style rules
- **UI:** Tailwind CSS

## Project Structure

```
backend/
  server.js
  routes/analyze.js
  controllers/faceController.js
  utils/recommendations.js
  data/styles.json
frontend/
  src/App.jsx
  src/components/
  src/pages/Home.jsx
  src/utils/faceDetection.js
  src/styles/App.css
```

## Setup

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and calls backend at `http://localhost:5000` by default.

To override backend URL:

```bash
VITE_API_URL=http://localhost:5000 npm run dev
```

## API Endpoints

- `POST /api/analyze/upload` (multipart field: `image`)
- `POST /api/analyze/realtime` with JSON:

```json
{
  "faceShape": "oval",
  "hairType": "wavy",
  "skinColor": "medium",
  "confidence": 0.91
}
```

## Features

- Real-time webcam analysis flow
- Image upload analysis flow
- Face shape, hair type, and skin tone extraction
- Hairstyle, beard style, and fashion recommendations
- Responsive Tailwind UI

## Notes

- Current face-shape, hair-type, and skin-tone scoring uses lightweight heuristic mapping for quick demos.
- For production-grade precision, replace these heuristics with trained ML classifiers and calibrated color sampling.
