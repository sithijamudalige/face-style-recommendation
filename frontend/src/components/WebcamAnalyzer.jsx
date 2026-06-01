import { useEffect, useRef, useState } from 'react'
import { analyzeVideoFrame, loadFaceApiModels } from '../utils/faceDetection'

function WebcamAnalyzer({ apiBaseUrl, onRecommendation }) {
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const [status, setStatus] = useState('Loading models...')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    let stream

    const init = async () => {
      try {
        await loadFaceApiModels()
        setStatus('Models loaded. Start real-time analysis.')

        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        setStatus('Unable to access webcam or face models.')
      }
    }

    init()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const runRealtime = () => {
    if (!videoRef.current || running) {
      return
    }

    setRunning(true)
    setStatus('Analyzing webcam feed...')

    timerRef.current = setInterval(async () => {
      const metrics = await analyzeVideoFrame(videoRef.current)
      if (!metrics) {
        return
      }

      const response = await fetch(`${apiBaseUrl}/api/analyze/realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()
      onRecommendation(data)
    }, 2500)
  }

  const stopRealtime = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRunning(false)
    setStatus('Real-time analysis stopped.')
  }

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-xl bg-slate-100"
      />
      <p className="text-sm text-slate-600">{status}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={runRealtime}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Start Analysis
        </button>
        <button
          type="button"
          onClick={stopRealtime}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Stop
        </button>
      </div>
    </div>
  )
}

export default WebcamAnalyzer
