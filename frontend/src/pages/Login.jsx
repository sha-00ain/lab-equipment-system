import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-ink/10 rounded-xl p-8">
        <h1 className="font-display text-2xl font-700 text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-ink/60 mb-6">Sign in to LabTrack to borrow or manage equipment.</p>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-md p-2 mb-4">{error}</p>}

        <label className="block text-sm font-medium text-ink/80 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brass"
          placeholder="you@university.edu"
        />

        <label className="block text-sm font-medium text-ink/80 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/15 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-brass"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-ink text-paper font-medium hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-ink/60 mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-brass font-medium">Create one</Link>
        </p>
      </form>
    </div>
  )
}
