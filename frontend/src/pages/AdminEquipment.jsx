import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Alert from '../components/Alert'

const emptyForm = { name: '', category: '', description: '', total_quantity: 1, condition: 'good', location: '' }

export default function AdminEquipment() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
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
    setError('')
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

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setError('')
    try {
      await api.deleteEquipment(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Manage Equipment</h1>
          <p className="text-ink/50 text-sm mt-1">Add, edit, or remove inventory items.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Equipment</button>
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState title="No equipment yet" hint='Click "Add Equipment" to create your first inventory item.' />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/40">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Available</th>
                <th className="p-3 font-medium">Condition</th>
                <th className="p-3 font-medium">Location</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-medium text-ink">{item.name}</td>
                  <td className="p-3 text-ink/60">{item.category}</td>
                  <td className="p-3 text-ink/60 font-mono">{item.available_quantity}/{item.total_quantity}</td>
                  <td className="p-3 text-ink/60 capitalize">{item.condition.replace('_', ' ')}</td>
                  <td className="p-3 text-ink/60">{item.location}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-teal-600 font-medium mr-3">Edit</button>
                    <button onClick={() => setDeleteTarget(item)} className="text-danger font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-20">
          <form onSubmit={handleSubmit} className="card p-6 w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg font-bold text-ink mb-4">
              {editingId ? 'Edit Equipment' : 'Add Equipment'}
            </h2>

            <label className="block text-sm font-medium text-ink/70 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field mb-3"
            />

            <label className="block text-sm font-medium text-ink/70 mb-1">Category</label>
            <input
              required
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="input-field mb-3"
              placeholder="e.g. Electronics"
            />

            <label className="block text-sm font-medium text-ink/70 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field mb-3"
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Total Qty</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.total_quantity}
                  onChange={(e) => setForm((f) => ({ ...f, total_quantity: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  className="input-field"
                >
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="damaged">Damaged</option>
                  <option value="under_repair">Under repair</option>
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium text-ink/70 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="input-field mb-6"
              placeholder="e.g. Electronics Lab - Rack A"
            />

            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-30">
          <div className="card p-6 w-full max-w-sm bg-white">
            <h2 className="font-display text-lg font-bold text-ink mb-2">Delete equipment?</h2>
            <p className="text-sm text-ink/60 mb-6">
              This will permanently delete <span className="font-medium text-ink">{deleteTarget.name}</span>. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
