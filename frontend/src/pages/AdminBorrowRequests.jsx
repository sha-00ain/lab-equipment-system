import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setRequests(await api.getAllBorrowRequests(filter))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  async function runAction(id, fn) {
    setBusyId(id)
    setError('')
    try {
      await fn(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Borrow Requests</h1>
          <p className="text-ink/50 text-sm mt-1">Approve, reject, or mark equipment as returned.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingState />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests found" hint="Try a different status filter." />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium text-ink">{r.equipment?.name} <span className="text-ink/40 font-mono text-sm">× {r.quantity}</span></p>
                <p className="text-sm text-ink/50">
                  {r.profiles?.full_name} · {r.profiles?.department || 'N/A'} · due {r.due_date}
                </p>
                {r.purpose && <p className="text-sm text-ink/40 mt-1">"{r.purpose}"</p>}
              </div>

              <div className="flex items-center gap-2">
                <Badge status={r.status} />

                {r.status === 'pending' && (
                  <>
                    <button
                      disabled={busyId === r.id}
                      onClick={() => runAction(r.id, api.approveBorrowRequest)}
                      className="btn-accent"
                    >
                      Approve
                    </button>
                    <button
                      disabled={busyId === r.id}
                      onClick={() => runAction(r.id, api.rejectBorrowRequest)}
                      className="btn-secondary"
                    >
                      Reject
                    </button>
                  </>
                )}

                {r.status === 'issued' && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => runAction(r.id, (id) => api.createReturn({ borrow_request_id: id, condition_on_return: 'good' }))}
                    className="btn-primary"
                  >
                    Mark returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
