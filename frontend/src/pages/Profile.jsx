import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Calendar, Clock, User, Scissors, Phone, Mail, Loader2, XCircle } from 'lucide-react'
import './Profile.css'

const API_BASE = 'http://localhost:8000'

const STATUS_STYLES = {
  Confirmed: 'status-confirmed',
  Pending: 'status-pending',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled'
}

function Profile() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const fetchAppointments = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        navigate('/login?redirect=/profile', { replace: true })
        return
      }
      setError('Could not load your appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [token, logout, navigate])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setCancellingId(id)
    try {
      await axios.put(`${API_BASE}/api/appointments/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
      )
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel appointment.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!isAuthenticated) return null

  const upcoming = appointments.filter((a) => ['Confirmed', 'Pending'].includes(a.status))
  const past = appointments.filter((a) => ['Completed', 'Cancelled'].includes(a.status))

  const renderAppointmentCard = (appt) => (
    <div key={appt.id} className="profile-appt-card">
      <div className="profile-appt-main">
        <div className="profile-appt-icon">
          <Scissors size={20} />
        </div>
        <div className="profile-appt-info">
          <h3 className="profile-appt-service">{appt.service_name}</h3>
          <p className="profile-appt-stylist">with {appt.staff_name}</p>
          <div className="profile-appt-meta">
            <span><Calendar size={14} /> {appt.appointment_date}</span>
            <span><Clock size={14} /> {appt.appointment_time}</span>
          </div>
          {appt.notes && <p className="profile-appt-notes">"{appt.notes}"</p>}
        </div>
        <span className={`profile-status-badge ${STATUS_STYLES[appt.status] || ''}`}>
          {appt.status}
        </span>
      </div>
      {['Confirmed', 'Pending'].includes(appt.status) && (
        <button
          className="profile-cancel-btn"
          onClick={() => handleCancel(appt.id)}
          disabled={cancellingId === appt.id}
        >
          {cancellingId === appt.id ? (
            <Loader2 size={14} className="profile-spinner" />
          ) : (
            <>
              <XCircle size={14} /> Cancel Appointment
            </>
          )}
        </button>
      )}
    </div>
  )

  return (
    <div className="profile-page">
      <Navbar activePage="" />

      <div className="profile-header">
        <div className="profile-header-overlay"></div>
        <div className="profile-header-content">
          <h1 className="profile-header-title">My Profile</h1>
          <p className="profile-header-subtitle">Manage your details and appointments</p>
        </div>
      </div>

      <div className="profile-body">
        {/* Profile Information */}
        <div className="profile-info-card">
          <h2 className="profile-section-title">Profile Information</h2>
          <div className="profile-info-row">
            <User size={18} className="profile-info-icon" />
            <div>
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{user.name}</span>
            </div>
          </div>
          <div className="profile-info-row">
            <Mail size={18} className="profile-info-icon" />
            <div>
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
          </div>
          <div className="profile-info-row">
            <Phone size={18} className="profile-info-icon" />
            <div>
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">{user.phone || 'Not provided'}</span>
            </div>
          </div>
          <div className="profile-info-actions">
            <Link to="/book" className="profile-info-btn primary">Book New Appointment</Link>
            <button className="profile-info-btn secondary" onClick={logout}>Log Out</button>
          </div>
        </div>

        {/* Appointments */}
        <div className="profile-appts">
          {loading ? (
            <div className="profile-loading">
              <Loader2 size={32} className="profile-spinner" />
              <p>Loading your appointments...</p>
            </div>
          ) : error ? (
            <div className="profile-error-box">
              <p>{error}</p>
              <button onClick={fetchAppointments}>Retry</button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="profile-empty">
              <Calendar size={40} />
              <h3>No Appointments Yet</h3>
              <p>Book your first appointment and it will appear here.</p>
              <Link to="/book" className="profile-info-btn primary">Book Appointment</Link>
            </div>
          ) : (
            <>
              <div className="profile-appts-section">
                <h2 className="profile-section-title">Upcoming Appointments</h2>
                {upcoming.length > 0 ? (
                  upcoming.map(renderAppointmentCard)
                ) : (
                  <p className="profile-none-text">No upcoming appointments.</p>
                )}
              </div>

              <div className="profile-appts-section">
                <h2 className="profile-section-title">Past Appointments</h2>
                {past.length > 0 ? (
                  past.map(renderAppointmentCard)
                ) : (
                  <p className="profile-none-text">No past appointments.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
