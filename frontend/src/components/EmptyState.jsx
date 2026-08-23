export default function EmptyState({ title, hint }) {
  return (
    <div className="card border-dashed py-14 flex flex-col items-center justify-center text-center px-6">
      <p className="font-display font-semibold text-ink mb-1">{title}</p>
      {hint && <p className="text-sm text-ink/50 max-w-sm">{hint}</p>}
    </div>
  )
}
