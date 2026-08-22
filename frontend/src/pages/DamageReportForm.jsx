import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabaseClient'

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

      setMessage('Damage report submitted. Lab staff will review it shortly.')
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
      <h1 className="font-display text-2xl font-700 text-ink mb-1">Report Damage</h1>
      <p className="text-ink/60 text-sm mb-6">Let lab staff know if equipment is broken, faulty, or missing parts.</p>

      {message && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-md p-3 mb-4">{message}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6">
        <label className="block text-sm font-medium text-ink/80 mb-1">Equipment</label>
        <select
          required
          value={form.equipment_id}
          onChange={(e) => setForm((f) => ({ ...f, equipment_id: e.target.value }))}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4"
        >
          <option value="">Select equipment…</option>
          {equipmentList.map((eq) => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-ink/80 mb-1">What happened?</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4"
          placeholder="Describe the damage or fault in detail…"
        />

        <label className="block text-sm font-medium text-ink/80 mb-1">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm mb-6"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md bg-ink text-paper font-medium disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}
