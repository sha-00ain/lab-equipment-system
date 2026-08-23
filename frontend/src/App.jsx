import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SetupNotice from './components/SetupNotice'
import { isSupabaseConfigured } from './lib/supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import EquipmentList from './pages/EquipmentList'
import MyBorrows from './pages/MyBorrows'
import DamageReportForm from './pages/DamageReportForm'
import AdminDashboard from './pages/AdminDashboard'
import AdminBorrowRequests from './pages/AdminBorrowRequests'
import AdminDamageReports from './pages/AdminDamageReports'
import AdminEquipment from './pages/AdminEquipment'

export default function App() {
  if (!isSupabaseConfigured) {
    return <SetupNotice />
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute><EquipmentList /></ProtectedRoute>
        } />
        <Route path="/my-borrows" element={
          <ProtectedRoute><MyBorrows /></ProtectedRoute>
        } />
        <Route path="/report-damage" element={
          <ProtectedRoute><DamageReportForm /></ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute managerOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/requests" element={
          <ProtectedRoute managerOnly><AdminBorrowRequests /></ProtectedRoute>
        } />
        <Route path="/admin/damage-reports" element={
          <ProtectedRoute managerOnly><AdminDamageReports /></ProtectedRoute>
        } />
        <Route path="/admin/equipment" element={
          <ProtectedRoute managerOnly><AdminEquipment /></ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
