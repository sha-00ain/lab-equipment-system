import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'

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
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <p className="tag bg-teal-50 text-teal-700 inline-block mb-3">Create account</p>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Get started</h1>
        <p className="text-sm text-ink/50 mb-6">Register to start borrowing lab equipment.</p>

        <Alert type="error">{error}</Alert>
        <Alert type="success">{success ? 'Account created! Check your email to confirm, then sign in.' : null}</Alert>

        <label className="block text-sm font-medium text-ink/70 mb-1">Full name</label>
        <input
          required
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          className="input-field mb-4"
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="input-field mb-4"
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          className="input-field mb-4"
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">I am a</label>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          className="input-field mb-2"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="staff">Lab Staff</option>
        </select>
        <p className="text-xs text-ink/40 mb-6">
          To create an admin account, sign up and promote yourself to "admin" in the database (see README).
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-ink/50 mt-5 text-center">
          Already have an account? <Link to="/login" className="text-teal-600 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
