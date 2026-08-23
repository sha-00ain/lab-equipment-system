import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import EquipmentCard from '../components/EquipmentCard'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'

export default function EquipmentList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ quantity: 1, purpose: '', due_date: '' })
  const [submitting, setSubmitting] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  async function load(query) {
    setLoading(true)
    setError('')
    try {
      const data = await api.getEquipment(query ? { search: query } : {})
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openBorrowModal(item) {
    setSelected(item)
    setForm({ quantity: 1, purpose: '', due_date: '' })
    setModalMessage('')
  }

  async function submitBorrow(e) {
    e.preventDefault()
    setSubmitting(true)
    setModalMessage('')
    try {
      await api.createBorrowRequest({
        equipment_id: selected.id,
        quantity: Number(form.quantity),
        purpose: form.purpose,
        due_date: form.due_date
      })
      setModalMessage('Request submitted — track it under "My Borrows".')
      setTimeout(() => setSelected(null), 1200)
    } catch (err) {
      setModalMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Lab Equipment</h1>
          <p className="text-ink/50 text-sm mt-1">Browse what's available and request to borrow.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); load(search) }} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment…"
            className="input-field w-56"
          />
          <button className="btn-primary">Search</button>
        </form>
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingState label="Loading equipment…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No equipment found"
          hint={search ? 'Try a different search term.' : 'Ask lab staff to add equipment from the Manage Equipment page.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} onBorrow={openBorrowModal} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-20">
          <div className="card p-6 w-full max-w-sm bg-white">
            <h2 className="font-display text-lg font-bold text-ink mb-1">Borrow {selected.name}</h2>
            <p className="text-sm text-ink/50 mb-4 font-mono">{selected.available_quantity} unit(s) available</p>

            <Alert type="info">{modalMessage}</Alert>

            <form onSubmit={submitBorrow}>
              <label className="block text-sm font-medium text-ink/70 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={selected.available_quantity}
                required
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="input-field mb-3"
              />

              <label className="block text-sm font-medium text-ink/70 mb-1">Purpose</label>
              <textarea
                required
                value={form.purpose}
                onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                className="input-field mb-3"
                rows={2}
                placeholder="e.g. Final year project demo"
              />

              <label className="block text-sm font-medium text-ink/70 mb-1">Return by</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                className="input-field mb-5"
              />

              <div className="flex gap-2">
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Submitting…' : 'Submit request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
