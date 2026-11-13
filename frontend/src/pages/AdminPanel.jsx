import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, CalendarDays, Users, Sparkles, Scissors, Mail,
  Loader2, CheckCircle, XCircle, Trash2, Plus, Pencil, Ban, ShieldCheck
} from 'lucide-react'
import './AdminPanel.css'

const API_BASE = 'http://localhost:8000'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'services', label: 'Services', icon: Sparkles },
  { id: 'staff', label: 'Staff', icon: Scissors },
  { id: 'inquiries', label: 'Inquiries', icon: Mail }
]

const STATUS_STYLES = {
  Confirmed: 'status-confirmed',
  Pending: 'status-pending',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled'
}

const EMPTY_SERVICE = { name: '', category: 'General', description: '', price: '', duration: '', image: '' }
const EMPTY_STAFF = { name: '', title: '', specialization: '', bio: '', image: '', availability: 'Available' }

function AdminPanel() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [serviceForm, setServiceForm] = useState(null)
  const [staffForm, setStaffForm] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/admin', { replace: true })
    } else if (user && user.role !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handle401 = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      logout()
      navigate('/login?redirect=/admin', { replace: true })
      return true
    }
    return false
  }

  const fetchAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [s, a, u, sv, st, iq] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/stats`, { headers }),
        axios.get(`${API_BASE}/api/admin/appointments`, { headers }),
        axios.get(`${API_BASE}/api/admin/users`, { headers }),
        axios.get(`${API_BASE}/api/admin/services`, { headers }),
        axios.get(`${API_BASE}/api/admin/staff`, { headers }),
        axios.get(`${API_BASE}/api/contact`, { headers })
      ])
      setStats(s.data)
      setAppointments(a.data)
      setUsers(u.data)
      setServices(sv.data)
      setStaff(st.data)
      setInquiries(iq.data)
    } catch (err) {
      if (!handle401(err)) setError('Failed to load admin data.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ---------- Actions ----------

  const updateApptStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/api/admin/appointments/${id}/status`, { status }, { headers })
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      showToast(`Appointment marked ${status}.`)
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast('Failed to update status.')
    }
  }

  const updateUser = async (id, payload) => {
    try {
      await axios.put(`${API_BASE}/api/admin/users/${id}`, payload, { headers })
      showToast('User updated.')
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast(err.response?.data?.detail || 'Failed to update user.')
    }
  }

  const saveService = async () => {
    try {
      const payload = { ...serviceForm, price: serviceForm.price === '' ? null : Number(serviceForm.price) }
      if (serviceForm.id) {
        await axios.put(`${API_BASE}/api/admin/services/${serviceForm.id}`, payload, { headers })
      } else {
        await axios.post(`${API_BASE}/api/admin/services`, payload, { headers })
      }
      setServiceForm(null)
      showToast('Service saved.')
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast('Failed to save service.')
    }
  }

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      await axios.delete(`${API_BASE}/api/admin/services/${id}`, { headers })
      showToast('Service deleted.')
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast('Failed to delete service.')
    }
  }

  const saveStaff = async () => {
    try {
      if (staffForm.id) {
        await axios.put(`${API_BASE}/api/admin/staff/${staffForm.id}`, staffForm, { headers })
      } else {
        await axios.post(`${API_BASE}/api/admin/staff`, staffForm, { headers })
      }
      setStaffForm(null)
      showToast('Staff member saved.')
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast('Failed to save staff member.')
    }
  }

  const deleteStaff = async (id) => {
    if (!window.confirm('Delete this staff member?')) return
    try {
      await axios.delete(`${API_BASE}/api/admin/staff/${id}`, { headers })
      showToast('Staff member deleted.')
      fetchAll()
    } catch (err) {
      if (!handle401(err)) showToast('Failed to delete staff member.')
    }
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) return null

  return (
    <div className="admin-page">
      <Navbar activePage="" />
      {toast && <div className="admin-toast"><CheckCircle size={18} /><span>{toast}</span></div>}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2 className="admin-sidebar-title">Admin Panel</h2>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={17} /> {t.label}
            </button>
          ))}
          <button className="admin-tab back" onClick={() => navigate('/')}>
            ← Back to Site
          </button>
        </aside>

        <main className="admin-main">
          {loading ? (
            <div className="admin-state"><Loader2 size={32} className="admin-spinner" /><p>Loading...</p></div>
          ) : error ? (
            <div className="admin-state"><p>{error}</p><button onClick={fetchAll}>Retry</button></div>
          ) : (
            <>
              {/* DASHBOARD */}
              {tab === 'dashboard' && stats && (
                <div className="admin-section">
                  <h1 className="admin-title">Dashboard</h1>
                  <div className="admin-stats-grid">
                    <div className="admin-stat"><span className="admin-stat-num">{stats.total_appointments}</span><span className="admin-stat-label">Total Appointments</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{stats.today_appointments}</span><span className="admin-stat-label">Today</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{stats.upcoming_appointments}</span><span className="admin-stat-label">Upcoming</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{stats.pending_appointments}</span><span className="admin-stat-label">Pending</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{stats.total_users}</span><span className="admin-stat-label">Users</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{stats.unread_inquiries}</span><span className="admin-stat-label">Open Inquiries</span></div>
                  </div>
                  <h2 className="admin-subtitle">Recent Appointments</h2>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Customer</th><th>Service</th><th>Staff</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                      <tbody>
                        {appointments.slice(0, 8).map((a) => (
                          <tr key={a.id}>
                            <td>{a.customer_name}</td><td>{a.service_name}</td><td>{a.staff_name}</td>
                            <td>{a.appointment_date}</td><td>{a.appointment_time}</td>
                            <td><span className={`admin-badge ${STATUS_STYLES[a.status]}`}>{a.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* APPOINTMENTS */}
              {tab === 'appointments' && (
                <div className="admin-section">
                  <h1 className="admin-title">All Appointments</h1>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Customer</th><th>Contact</th><th>Service</th><th>Staff</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {appointments.map((a) => (
                          <tr key={a.id}>
                            <td>{a.customer_name}</td>
                            <td>{a.customer_email || a.phone || '—'}</td>
                            <td>{a.service_name}</td><td>{a.staff_name}</td>
                            <td>{a.appointment_date}</td><td>{a.appointment_time}</td>
                            <td><span className={`admin-badge ${STATUS_STYLES[a.status]}`}>{a.status}</span></td>
                            <td className="admin-actions">
                              {a.status !== 'Confirmed' && <button className="admin-mini-btn confirm" onClick={() => updateApptStatus(a.id, 'Confirmed')}><CheckCircle size={13} /> Confirm</button>}
                              {a.status !== 'Completed' && <button className="admin-mini-btn complete" onClick={() => updateApptStatus(a.id, 'Completed')}><CheckCircle size={13} /> Done</button>}
                              {a.status !== 'Cancelled' && <button className="admin-mini-btn cancel" onClick={() => updateApptStatus(a.id, 'Cancelled')}><XCircle size={13} /> Cancel</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* USERS */}
              {tab === 'users' && (
                <div className="admin-section">
                  <h1 className="admin-title">Users</h1>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.full_name}</td><td>{u.email}</td><td>{u.phone || '—'}</td>
                            <td><span className={`admin-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-pending'}`}>{u.role}</span></td>
                            <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                            <td className="admin-actions">
                              {u.id !== user.id && (
                                <>
                                  <button className="admin-mini-btn" onClick={() => updateUser(u.id, { role: u.role === 'admin' ? 'customer' : 'admin' })}>
                                    <ShieldCheck size={13} /> {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                  </button>
                                  <button className="admin-mini-btn cancel" onClick={() => updateUser(u.id, { is_active: !u.is_active })}>
                                    <Ban size={13} /> {u.is_active ? 'Deactivate' : 'Activate'}
                                  </button>
                                </>
                              )}
                              {u.id === user.id && <span className="admin-self">(you)</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {tab === 'services' && (
                <div className="admin-section">
                  <div className="admin-section-head">
                    <h1 className="admin-title">Services</h1>
                    <button className="admin-add-btn" onClick={() => setServiceForm({ ...EMPTY_SERVICE })}><Plus size={15} /> Add Service</button>
                  </div>
                  {serviceForm && (
                    <div className="admin-form-card">
                      <h3>{serviceForm.id ? 'Edit Service' : 'New Service'}</h3>
                      <div className="admin-form-grid">
                        <input placeholder="Name *" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} />
                        <input placeholder="Category" value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })} />
                        <input placeholder="Price (₹)" type="number" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />
                        <input placeholder="Duration (e.g. 60 min)" value={serviceForm.duration} onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} />
                        <input placeholder="Image URL" value={serviceForm.image} onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} className="admin-form-wide" />
                        <textarea placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="admin-form-wide" />
                      </div>
                      <div className="admin-form-actions">
                        <button className="admin-mini-btn confirm" onClick={saveService}>Save</button>
                        <button className="admin-mini-btn cancel" onClick={() => setServiceForm(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="admin-cards-grid">
                    {services.map((s) => (
                      <div key={s.id} className="admin-item-card">
                        <h3>{s.name}</h3>
                        <p className="admin-item-meta">{s.category} {s.price != null && `• ₹${s.price}`} {s.duration && `• ${s.duration}`}</p>
                        {s.description && <p className="admin-item-desc">{s.description}</p>}
                        <div className="admin-item-actions">
                          <button className="admin-mini-btn" onClick={() => setServiceForm({ ...s })}><Pencil size={13} /> Edit</button>
                          <button className="admin-mini-btn cancel" onClick={() => deleteService(s.id)}><Trash2 size={13} /> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STAFF */}
              {tab === 'staff' && (
                <div className="admin-section">
                  <div className="admin-section-head">
                    <h1 className="admin-title">Staff</h1>
                    <button className="admin-add-btn" onClick={() => setStaffForm({ ...EMPTY_STAFF })}><Plus size={15} /> Add Staff</button>
                  </div>
                  {staffForm && (
                    <div className="admin-form-card">
                      <h3>{staffForm.id ? 'Edit Staff' : 'New Staff Member'}</h3>
                      <div className="admin-form-grid">
                        <input placeholder="Name *" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
                        <input placeholder="Title (e.g. Senior Stylist)" value={staffForm.title} onChange={(e) => setStaffForm({ ...staffForm, title: e.target.value })} />
                        <input placeholder="Specialization" value={staffForm.specialization} onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })} />
                        <select value={staffForm.availability} onChange={(e) => setStaffForm({ ...staffForm, availability: e.target.value })}>
                          <option>Available</option><option>Busy</option><option>On Leave</option>
                        </select>
                        <input placeholder="Image URL" value={staffForm.image} onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })} className="admin-form-wide" />
                        <textarea placeholder="Bio" value={staffForm.bio} onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })} className="admin-form-wide" />
                      </div>
                      <div className="admin-form-actions">
                        <button className="admin-mini-btn confirm" onClick={saveStaff}>Save</button>
                        <button className="admin-mini-btn cancel" onClick={() => setStaffForm(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="admin-cards-grid">
                    {staff.map((m) => (
                      <div key={m.id} className="admin-item-card">
                        <h3>{m.name}</h3>
                        <p className="admin-item-meta">{m.title || 'Staff'} {m.specialization && `• ${m.specialization}`} • {m.availability}</p>
                        {m.bio && <p className="admin-item-desc">{m.bio}</p>}
                        <div className="admin-item-actions">
                          <button className="admin-mini-btn" onClick={() => setStaffForm({ ...m })}><Pencil size={13} /> Edit</button>
                          <button className="admin-mini-btn cancel" onClick={() => deleteStaff(m.id)}><Trash2 size={13} /> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INQUIRIES */}
              {tab === 'inquiries' && (
                <div className="admin-section">
                  <h1 className="admin-title">Contact Inquiries</h1>
                  {inquiries.length === 0 ? (
                    <p className="admin-none">No inquiries yet.</p>
                  ) : (
                    <div className="admin-inquiry-list">
                      {inquiries.map((iq) => (
                        <div key={iq.id} className="admin-inquiry-card">
                          <div className="admin-inquiry-head">
                            <div>
                              <h3>{iq.full_name}</h3>
                              <p className="admin-item-meta">{iq.email} {iq.phone && `• ${iq.phone}`}</p>
                            </div>
                            <span className="admin-item-meta">{iq.subject} • {iq.created_at ? new Date(iq.created_at).toLocaleDateString() : ''}</span>
                          </div>
                          <p className="admin-inquiry-msg">{iq.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel
