import { useMemo, useState } from 'react'
import WebcamAnalyzer from '../components/WebcamAnalyzer'
import ImageUploader from '../components/ImageUploader'
import ResultsDisplay from '../components/ResultsDisplay'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeInput, setActiveInput] = useState('webcam')

  const title = useMemo(
    () =>
      activeInput === 'webcam'
        ? 'Real-time webcam analyzer'
        : 'Upload image analyzer',
    [activeInput],
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 bg-slate-50 p-4 text-slate-900 md:p-8">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold md:text-4xl">Face Style Recommendation</h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Analyze face shape, hair type, and skin tone to get personalized hairstyle,
          beard, and fashion suggestions.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">{title}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveInput('webcam')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  activeInput === 'webcam'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Webcam
              </button>
              <button
                type="button"
                onClick={() => setActiveInput('upload')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  activeInput === 'upload'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Upload
              </button>
            </div>
          </div>

          {activeInput === 'webcam' ? (
            <WebcamAnalyzer
              apiBaseUrl={API_BASE_URL}
              onRecommendation={setAnalysisResult}
            />
          ) : (
            <ImageUploader
              apiBaseUrl={API_BASE_URL}
              onRecommendation={setAnalysisResult}
            />
          )}
        </article>

        <ResultsDisplay result={analysisResult} />
      </section>
    </main>
  )
}

export default Home
