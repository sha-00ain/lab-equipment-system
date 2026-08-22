import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName, role: form.role })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-ink/10 rounded-xl p-8">
        <h1 className="font-display text-2xl font-700 text-ink mb-1">Create your account</h1>
        <p className="text-sm text-ink/60 mb-6">Register to start borrowing lab equipment.</p>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2 mb-4">{error}</p>}
        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-md p-2 mb-4">
            Account created! Check your email to confirm, then sign in.
          </p>
        )}

        <label className="block text-sm font-medium text-ink/80 mb-1">Full name</label>
        <input
          required
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <label className="block text-sm font-medium text-ink/80 mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <label className="block text-sm font-medium text-ink/80 mb-1">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <label className="block text-sm font-medium text-ink/80 mb-1">I am a</label>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="staff">Lab Staff</option>
        </select>
        <p className="text-xs text-ink/40 -mt-4 mb-6">
          Note: for a real deployment, promote trusted accounts to "admin" directly in the database.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-ink text-paper font-medium hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-ink/60 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-brass font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
