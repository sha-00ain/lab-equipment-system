import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'

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
      <h1 className="font-display text-2xl font-bold text-ink mb-1">My Borrows</h1>
      <p className="text-ink/50 text-sm mb-6">Track the status of your equipment requests.</p>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingState />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests yet" hint="Borrow something from the Equipment page to see it here." />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{r.equipment?.name}</p>
                <p className="text-sm text-ink/50 font-mono">
                  qty {r.quantity} · due {r.due_date} · requested {new Date(r.created_at).toLocaleDateString()}
                </p>
                {r.purpose && <p className="text-sm text-ink/40 mt-1">"{r.purpose}"</p>}
              </div>
              <Badge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
