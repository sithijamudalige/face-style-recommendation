import RecommendationCard from './RecommendationCard'

function ResultsDisplay({ result }) {
  if (!result) {
    return (
      <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-medium">Recommendations</h2>
        <p className="mt-2 text-sm text-slate-600">
          Run webcam or upload analysis to see your personalized styles.
        </p>
      </aside>
    )
  }

  const { analysis, recommendations } = result

  return (
    <aside className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-medium">Recommendations</h2>

      <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
        <p>
          Face Shape: <strong>{analysis.faceShape}</strong>
        </p>
        <p>
          Hair Type: <strong>{analysis.hairType}</strong>
        </p>
        <p>
          Skin Tone: <strong>{analysis.skinColor}</strong>
        </p>
      </div>

      <RecommendationCard title="Hairstyles" items={recommendations.hairstyles} />
      <RecommendationCard title="Beard Styles" items={recommendations.beardStyles} />
      <RecommendationCard
        title="Fashion Choices"
        items={recommendations.fashionChoices}
      />
    </aside>
  )
}

export default ResultsDisplay
