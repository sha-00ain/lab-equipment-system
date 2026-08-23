import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <p className="tag bg-teal-50 text-teal-700 inline-block mb-3">Sign in</p>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-ink/50 mb-6">Sign in to borrow or manage lab equipment.</p>

        <Alert type="error">{error}</Alert>

        <label className="block text-sm font-medium text-ink/70 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4"
          placeholder="you@university.edu"
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-6"
          placeholder="••••••••"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-ink/50 mt-5 text-center">
          Don't have an account? <Link to="/register" className="text-teal-600 font-medium">Create one</Link>
        </p>
      </form>
    </div>
  )
}
