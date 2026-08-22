import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import EquipmentCard from '../components/EquipmentCard'

export default function EquipmentList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ quantity: 1, purpose: '', due_date: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await api.getEquipment(search ? { search } : {})
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
    setMessage('')
  }

  async function submitBorrow(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      await api.createBorrowRequest({
        equipment_id: selected.id,
        quantity: Number(form.quantity),
        purpose: form.purpose,
        due_date: form.due_date
      })
      setMessage('Request submitted! Track it under "My Borrows".')
      setTimeout(() => setSelected(null), 1200)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Lab Equipment</h1>
          <p className="text-ink/60 text-sm mt-1">Browse available equipment and request to borrow.</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); load() }}
          className="flex gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment…"
            className="border border-ink/15 rounded-md px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-brass"
          />
          <button className="px-4 py-2 rounded-md bg-ink text-paper text-sm font-medium">Search</button>
        </form>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading equipment…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/50">No equipment found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} onBorrow={openBorrowModal} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-20">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="font-display text-lg font-700 text-ink mb-1">Borrow {selected.name}</h2>
            <p className="text-sm text-ink/60 mb-4">{selected.available_quantity} unit(s) available</p>

            {message && <p className="text-sm text-ink/80 bg-ink/5 rounded-md p-2 mb-4">{message}</p>}

            <form onSubmit={submitBorrow}>
              <label className="block text-sm font-medium text-ink/80 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={selected.available_quantity}
                required
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="w-full border border-ink/15 rounded-md px-3 py-2 mb-3"
              />

              <label className="block text-sm font-medium text-ink/80 mb-1">Purpose</label>
              <textarea
                required
                value={form.purpose}
                onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                className="w-full border border-ink/15 rounded-md px-3 py-2 mb-3"
                rows={2}
                placeholder="e.g. Final year project demo"
              />

              <label className="block text-sm font-medium text-ink/80 mb-1">Return by</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                className="w-full border border-ink/15 rounded-md px-3 py-2 mb-5"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2 rounded-md border border-ink/15 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-md bg-ink text-paper text-sm font-medium disabled:opacity-50"
                >
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
