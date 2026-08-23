import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'

export default function AdminDamageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
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
    setError('')
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
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Damage Reports</h1>
      <p className="text-ink/50 text-sm mb-6">Review and update the status of reported equipment damage.</p>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingState />
      ) : reports.length === 0 ? (
        <EmptyState title="No damage reports yet" hint="Reports submitted by users will show up here." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card p-4 flex gap-4">
              {r.image_url && (
                <img src={r.image_url} alt="Damage" className="w-24 h-24 object-cover rounded-lg border border-line shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-medium text-ink">{r.equipment?.name}</p>
                    <p className="text-sm text-ink/50">
                      Reported by {r.profiles?.full_name} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge status={r.status} />
                </div>
                <p className="text-sm text-ink/70 mt-2">{r.description}</p>

                <div className="flex gap-2 mt-3">
                  {r.status === 'pending' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => updateStatus(r.id, 'under_repair')}
                      className="btn-secondary"
                    >
                      Mark under repair
                    </button>
                  )}
                  {r.status !== 'resolved' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => updateStatus(r.id, 'resolved')}
                      className="btn-accent"
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
