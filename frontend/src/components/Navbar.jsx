import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
    isActive ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
  }`

export default function Navbar() {
  const { user, profile, isManager, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16 gap-4">
        <NavLink to="/" className="font-display text-lg font-bold tracking-tight text-ink shrink-0">
          Lab<span className="text-teal-600">Track</span>
        </NavLink>

        {user && (
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            <NavLink to="/" end className={linkClass}>Equipment</NavLink>
            <NavLink to="/my-borrows" className={linkClass}>My Borrows</NavLink>
            <NavLink to="/report-damage" className={linkClass}>Report Damage</NavLink>
            {isManager && (
              <>
                <span className="w-px h-5 bg-line mx-1" />
                <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/admin/requests" className={linkClass}>Requests</NavLink>
                <NavLink to="/admin/damage-reports" className={linkClass}>Damage</NavLink>
                <NavLink to="/admin/equipment" className={linkClass}>Manage</NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <span className="text-sm text-ink/50 hidden lg:inline">
                {profile?.full_name} <span className="tag bg-ink/5 text-ink/60 ml-1">{profile?.role}</span>
              </span>
              <button onClick={handleSignOut} className="btn-secondary">Sign out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary">Sign in</NavLink>
          )}
        </div>
      </div>

      {user && (
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3">
          <NavLink to="/" end className={linkClass}>Equipment</NavLink>
          <NavLink to="/my-borrows" className={linkClass}>Borrows</NavLink>
          <NavLink to="/report-damage" className={linkClass}>Damage</NavLink>
          {isManager && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/admin/requests" className={linkClass}>Requests</NavLink>
              <NavLink to="/admin/equipment" className={linkClass}>Manage</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
