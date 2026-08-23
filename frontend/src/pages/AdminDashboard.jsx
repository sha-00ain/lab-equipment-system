import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="font-display text-3xl font-bold text-ink mt-1 font-mono">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getStats().then(setStats).catch((err) => setError(err.message))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-ink/50 text-sm mb-6">Overview of lab equipment activity.</p>

      <Alert type="error">{error}</Alert>

      {!stats && !error ? (
        <LoadingState />
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Equipment" value={stats.total_equipment} />
            <StatCard label="Pending Requests" value={stats.pending_borrow_requests} />
            <StatCard label="Currently Issued" value={stats.currently_issued} />
            <StatCard label="Pending Damage Reports" value={stats.pending_damage_reports} />
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-ink mb-4">Most Borrowed Equipment</h2>
            {stats.most_borrowed.length === 0 ? (
              <EmptyState title="No borrow activity yet" />
            ) : (
              <div className="space-y-2">
                {stats.most_borrowed.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-sm text-ink/70 w-40 truncate">{item.name}</span>
                    <div className="flex-1 bg-ink/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-teal-600"
                        style={{ width: `${(item.count / stats.most_borrowed[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-ink/50 w-6 text-right font-mono">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
