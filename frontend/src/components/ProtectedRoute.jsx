import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingState from './LoadingState'

export default function ProtectedRoute({ children, managerOnly = false }) {
  const { user, isManager, loading } = useAuth()

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center"><LoadingState label="Checking your session…" /></div>
  }

  if (!user) return <Navigate to="/login" replace />
  if (managerOnly && !isManager) return <Navigate to="/" replace />

  return children
}
