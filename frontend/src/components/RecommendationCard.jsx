function RecommendationCard({ title, items }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default RecommendationCard
