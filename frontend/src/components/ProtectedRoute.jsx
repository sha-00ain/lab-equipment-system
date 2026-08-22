import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, managerOnly = false }) {
  const { user, isManager, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-ink/60">Loading…</div>
  }

  if (!user) return <Navigate to="/login" replace />
  if (managerOnly && !isManager) return <Navigate to="/" replace />

  return children
}
