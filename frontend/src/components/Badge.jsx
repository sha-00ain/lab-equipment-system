const styles = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-teal-50 text-teal-700',
  issued: 'bg-teal-50 text-teal-700',
  returned: 'bg-ink/5 text-ink/60',
  rejected: 'bg-danger/10 text-danger',
  cancelled: 'bg-ink/5 text-ink/50',
  under_repair: 'bg-amber-50 text-amber-600',
  resolved: 'bg-teal-50 text-teal-700',
  good: 'bg-teal-50 text-teal-700',
  fair: 'bg-amber-50 text-amber-600',
  damaged: 'bg-danger/10 text-danger'
}

export default function Badge({ status }) {
  const cls = styles[status] || 'bg-ink/5 text-ink/60'
  return (
    <span className={`tag font-medium capitalize ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
