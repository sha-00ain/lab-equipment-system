import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  issued: 'bg-blue-100 text-blue-800',
  returned: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-200 text-slate-700'
}

export default function MyBorrows() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getMyBorrowRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-700 text-ink mb-1">My Borrows</h1>
      <p className="text-ink/60 text-sm mb-6">Track the status of your equipment requests.</p>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-ink/50">You haven't requested any equipment yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="border border-ink/10 rounded-xl p-4 bg-white flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{r.equipment?.name}</p>
                <p className="text-sm text-ink/60">
                  Qty {r.quantity} · Due {r.due_date} · Requested {new Date(r.created_at).toLocaleDateString()}
                </p>
                {r.purpose && <p className="text-sm text-ink/50 mt-1">"{r.purpose}"</p>}
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusColor[r.status] || 'bg-slate-100'}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
