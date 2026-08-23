import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabaseClient'
import Alert from '../components/Alert'

export default function DamageReportForm() {
  const [equipmentList, setEquipmentList] = useState([])
  const [form, setForm] = useState({ equipment_id: '', description: '' })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.getEquipment().then(setEquipmentList).catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      let image_url = null

      if (file) {
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('damage-reports')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('damage-reports')
          .getPublicUrl(fileName)

        image_url = publicUrlData.publicUrl
      }

      await api.createDamageReport({
        equipment_id: form.equipment_id,
        description: form.description,
        image_url
      })

      setMessage('Report submitted — lab staff will review it shortly.')
      setForm({ equipment_id: '', description: '' })
      setFile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Report Damage</h1>
      <p className="text-ink/50 text-sm mb-6">Let lab staff know if equipment is broken, faulty, or missing parts.</p>

      <Alert type="success">{message}</Alert>
      <Alert type="error">{error}</Alert>

      <form onSubmit={handleSubmit} className="card p-6">
        <label className="block text-sm font-medium text-ink/70 mb-1">Equipment</label>
        <select
          required
          value={form.equipment_id}
          onChange={(e) => setForm((f) => ({ ...f, equipment_id: e.target.value }))}
          className="input-field mb-4"
        >
          <option value="">Select equipment…</option>
          {equipmentList.map((eq) => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-ink/70 mb-1">What happened?</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="input-field mb-4"
          placeholder="Describe the damage or fault in detail…"
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm mb-6"
        />

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}
