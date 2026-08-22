import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  under_repair: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800'
}

export default function AdminDamageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      setReports(await api.getAllDamageReports())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    setBusyId(id)
    try {
      await api.updateDamageReport(id, { status })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-700 text-ink mb-1">Damage Reports</h1>
      <p className="text-ink/60 text-sm mb-6">Review and update the status of reported equipment damage.</p>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : reports.length === 0 ? (
        <p className="text-ink/50">No damage reports yet.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="border border-ink/10 rounded-xl p-4 bg-white flex gap-4">
              {r.image_url && (
                <img src={r.image_url} alt="Damage" className="w-24 h-24 object-cover rounded-lg border border-ink/10" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{r.equipment?.name}</p>
                    <p className="text-sm text-ink/60">
                      Reported by {r.profiles?.full_name} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusColor[r.status]}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-ink/70 mt-2">{r.description}</p>

                <div className="flex gap-2 mt-3">
                  {r.status === 'pending' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => updateStatus(r.id, 'under_repair')}
                      className="text-sm px-3 py-1.5 rounded-md bg-ink text-paper disabled:opacity-50"
                    >
                      Mark under repair
                    </button>
                  )}
                  {r.status !== 'resolved' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => updateStatus(r.id, 'resolved')}
                      className="text-sm px-3 py-1.5 rounded-md bg-brass text-white disabled:opacity-50"
                    >
                      Mark resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
