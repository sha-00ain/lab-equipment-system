import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive ? 'bg-ink text-paper' : 'text-ink/70 hover:text-ink hover:bg-ink/5'
  }`

export default function Navbar() {
  const { user, profile, isManager, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <NavLink to="/" className="font-display text-lg font-700 tracking-tight text-ink">
          Lab<span className="text-brass">Track</span>
        </NavLink>

        {user && (
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>Equipment</NavLink>
            <NavLink to="/my-borrows" className={linkClass}>My Borrows</NavLink>
            <NavLink to="/report-damage" className={linkClass}>Report Damage</NavLink>
            {isManager && (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/admin/requests" className={linkClass}>Requests</NavLink>
                <NavLink to="/admin/damage-reports" className={linkClass}>Damage Reports</NavLink>
                <NavLink to="/admin/equipment" className={linkClass}>Manage Equipment</NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-ink/60 hidden sm:inline">
                {profile?.full_name} · <span className="capitalize">{profile?.role}</span>
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium px-3 py-2 rounded-md border border-ink/15 hover:bg-ink/5"
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="text-sm font-medium px-3 py-2 rounded-md bg-ink text-paper">
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
