import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  issued: 'bg-blue-100 text-blue-800',
  returned: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
}

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await api.getAllBorrowRequests(filter)
      setRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  async function handleApprove(id) {
    setBusyId(id)
    try {
      await api.approveBorrowRequest(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(id) {
    setBusyId(id)
    try {
      await api.rejectBorrowRequest(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleMarkReturned(id) {
    setBusyId(id)
    try {
      await api.createReturn({ borrow_request_id: id, condition_on_return: 'good' })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Borrow Requests</h1>
          <p className="text-ink/60 text-sm mt-1">Approve, reject, or mark equipment as returned.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-ink/50">No requests found.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="border border-ink/10 rounded-xl p-4 bg-white flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium text-ink">{r.equipment?.name} <span className="text-ink/40 font-normal">× {r.quantity}</span></p>
                <p className="text-sm text-ink/60">
                  {r.profiles?.full_name} · {r.profiles?.department || 'N/A'} · Due {r.due_date}
                </p>
                {r.purpose && <p className="text-sm text-ink/50 mt-1">"{r.purpose}"</p>}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[r.status] || 'bg-slate-100'}`}>
                  {r.status}
                </span>

                {r.status === 'pending' && (
                  <>
                    <button
                      disabled={busyId === r.id}
                      onClick={() => handleApprove(r.id)}
                      className="text-sm px-3 py-1.5 rounded-md bg-ink text-paper disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={busyId === r.id}
                      onClick={() => handleReject(r.id)}
                      className="text-sm px-3 py-1.5 rounded-md border border-ink/15 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {r.status === 'issued' && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => handleMarkReturned(r.id)}
                    className="text-sm px-3 py-1.5 rounded-md bg-brass text-white disabled:opacity-50"
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
