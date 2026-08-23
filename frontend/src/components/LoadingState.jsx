export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-ink/50 text-sm py-10 justify-center">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-ink/20 border-t-teal-600 animate-spin" />
      {label}
    </div>
  )
}
