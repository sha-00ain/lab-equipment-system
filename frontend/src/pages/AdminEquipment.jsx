import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const emptyForm = { name: '', category: '', description: '', total_quantity: 1, condition: 'good', location: '' }

export default function AdminEquipment() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setItems(await api.getEquipment())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      category: item.category,
      description: item.description || '',
      total_quantity: item.total_quantity,
      condition: item.condition,
      location: item.location || ''
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, total_quantity: Number(form.total_quantity) }
      if (editingId) {
        await api.updateEquipment(editingId, payload)
      } else {
        await api.createEquipment(payload)
      }
      setShowForm(false)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this equipment permanently?')) return
    try {
      await api.deleteEquipment(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Manage Equipment</h1>
          <p className="text-ink/60 text-sm mt-1">Add, edit, or remove inventory items.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-md bg-ink text-paper text-sm font-medium">
          + Add Equipment
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-ink/10 rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Available</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Location</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-3 font-medium text-ink">{item.name}</td>
                  <td className="p-3 text-ink/60">{item.category}</td>
                  <td className="p-3 text-ink/60">{item.available_quantity}/{item.total_quantity}</td>
                  <td className="p-3 text-ink/60 capitalize">{item.condition.replace('_', ' ')}</td>
                  <td className="p-3 text-ink/60">{item.location}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-brass font-medium mr-3">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-20">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="font-display text-lg font-700 text-ink mb-4">
              {editingId ? 'Edit Equipment' : 'Add Equipment'}
            </h2>

            <label className="block text-sm font-medium text-ink/80 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-ink/15 rounded-md px-3 py-2 mb-3"
            />

            <label className="block text-sm font-medium text-ink/80 mb-1">Category</label>
            <input
              required
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-ink/15 rounded-md px-3 py-2 mb-3"
              placeholder="e.g. Electronics"
            />

            <label className="block text-sm font-medium text-ink/80 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-ink/15 rounded-md px-3 py-2 mb-3"
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-ink/80 mb-1">Total Qty</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.total_quantity}
                  onChange={(e) => setForm((f) => ({ ...f, total_quantity: e.target.value }))}
                  className="w-full border border-ink/15 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/80 mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  className="w-full border border-ink/15 rounded-md px-3 py-2"
                >
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="damaged">Damaged</option>
                  <option value="under_repair">Under repair</option>
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium text-ink/80 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full border border-ink/15 rounded-md px-3 py-2 mb-6"
              placeholder="e.g. Electronics Lab - Rack A"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-md border border-ink/15 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-md bg-ink text-paper text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
