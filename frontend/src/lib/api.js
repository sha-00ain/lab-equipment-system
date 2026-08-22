import { supabase } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, { method = 'GET', body } = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  // Equipment
  getEquipment: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/equipment${qs ? `?${qs}` : ''}`)
  },
  createEquipment: (payload) => request('/api/equipment', { method: 'POST', body: payload }),
  updateEquipment: (id, payload) => request(`/api/equipment/${id}`, { method: 'PUT', body: payload }),
  deleteEquipment: (id) => request(`/api/equipment/${id}`, { method: 'DELETE' }),

  // Borrow requests
  createBorrowRequest: (payload) => request('/api/borrow', { method: 'POST', body: payload }),
  getMyBorrowRequests: () => request('/api/borrow/my'),
  getAllBorrowRequests: (status) => request(`/api/borrow${status ? `?status=${status}` : ''}`),
  approveBorrowRequest: (id) => request(`/api/borrow/${id}/approve`, { method: 'PATCH' }),
  rejectBorrowRequest: (id) => request(`/api/borrow/${id}/reject`, { method: 'PATCH' }),

  // Returns
  createReturn: (payload) => request('/api/returns', { method: 'POST', body: payload }),
  getReturns: () => request('/api/returns'),

  // Damage reports
  createDamageReport: (payload) => request('/api/damage-reports', { method: 'POST', body: payload }),
  getMyDamageReports: () => request('/api/damage-reports/my'),
  getAllDamageReports: (status) => request(`/api/damage-reports${status ? `?status=${status}` : ''}`),
  updateDamageReport: (id, payload) => request(`/api/damage-reports/${id}`, { method: 'PATCH', body: payload }),

  // Dashboard
  getStats: () => request('/api/dashboard/stats')
}
