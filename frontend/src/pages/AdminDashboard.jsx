import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function StatCard({ label, value }) {
  return (
    <div className="border border-ink/10 rounded-xl p-5 bg-white">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="font-display text-3xl font-700 text-ink mt-1">{value}</p>
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
      <h1 className="font-display text-2xl font-700 text-ink mb-1">Dashboard</h1>
      <p className="text-ink/60 text-sm mb-6">Overview of lab equipment activity.</p>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Equipment" value={stats.total_equipment} />
            <StatCard label="Pending Requests" value={stats.pending_borrow_requests} />
            <StatCard label="Currently Issued" value={stats.currently_issued} />
            <StatCard label="Pending Damage Reports" value={stats.pending_damage_reports} />
          </div>

          <div className="border border-ink/10 rounded-xl p-5 bg-white">
            <h2 className="font-display font-600 text-ink mb-4">Most Borrowed Equipment</h2>
            {stats.most_borrowed.length === 0 ? (
              <p className="text-sm text-ink/50">No borrow activity yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.most_borrowed.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-sm text-ink/80 w-40 truncate">{item.name}</span>
                    <div className="flex-1 bg-ink/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-brass"
                        style={{ width: `${(item.count / stats.most_borrowed[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-ink/50 w-6 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
