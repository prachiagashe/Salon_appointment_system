import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Calendar, Clock, Scissors, Loader2, XCircle, CheckCircle, Sparkles } from 'lucide-react'
import './MyAppointments.css'

const API_BASE = 'http://localhost:8000'

const STATUS_STYLES = {
  Confirmed: 'status-confirmed',
  Pending: 'status-pending',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled'
}

function MyAppointments() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-appointments', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

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
        navigate('/login?redirect=/my-appointments', { replace: true })
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

  const handleCancel = async (appt) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setCancellingId(appt.id)
    try {
      await axios.put(`${API_BASE}/api/appointments/${appt.id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? { ...a, status: 'Cancelled' } : a))
      )
      showToast(`Appointment for ${appt.service_name} has been cancelled.`)
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to cancel appointment.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!isAuthenticated) return null

  const upcoming = appointments.filter((a) => ['Confirmed', 'Pending'].includes(a.status))
  const past = appointments.filter((a) => ['Completed', 'Cancelled'].includes(a.status))

  const renderCard = (appt) => (
    <div key={appt.id} className="myappt-card">
      <div className="myappt-card-top">
        <div className="myappt-icon">
          <Scissors size={20} />
        </div>
        <div className="myappt-info">
          <h3 className="myappt-service">{appt.service_name}</h3>
          <p className="myappt-stylist">with {appt.staff_name}</p>
        </div>
        <span className={`myappt-status ${STATUS_STYLES[appt.status] || ''}`}>
          {appt.status}
        </span>
      </div>

      <div className="myappt-details">
        <div className="myappt-detail">
          <Calendar size={15} />
          <span>{appt.appointment_date}</span>
        </div>
        <div className="myappt-detail">
          <Clock size={15} />
          <span>{appt.appointment_time}</span>
        </div>
        <div className="myappt-detail">
          <Sparkles size={15} />
          <span>Silken Atelier</span>
        </div>
      </div>

      {appt.notes && <p className="myappt-notes">Notes: "{appt.notes}"</p>}

      {['Confirmed', 'Pending'].includes(appt.status) && (
        <button
          className="myappt-cancel-btn"
          onClick={() => handleCancel(appt)}
          disabled={cancellingId === appt.id}
        >
          {cancellingId === appt.id ? (
            <Loader2 size={14} className="myappt-spinner" />
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
    <div className="myappt-page">
      <Navbar activePage="" />

      <div className="myappt-header">
        <div className="myappt-header-overlay"></div>
        <div className="myappt-header-content">
          <h1 className="myappt-header-title">My Appointments</h1>
          <p className="myappt-header-subtitle">
            Welcome back, {user.name.split(' ')[0]} — here's your booking history.
          </p>
        </div>
      </div>

      {toast && (
        <div className="myappt-toast">
          <CheckCircle size={18} />
          <span>{toast}</span>
        </div>
      )}

      <div className="myappt-body">
        {loading ? (
          <div className="myappt-state">
            <Loader2 size={32} className="myappt-spinner" />
            <p>Loading your appointments...</p>
          </div>
        ) : error ? (
          <div className="myappt-state">
            <p>{error}</p>
            <button className="myappt-retry" onClick={fetchAppointments}>Retry</button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="myappt-state">
            <Calendar size={44} />
            <h3>No Appointments Yet</h3>
            <p>Book your first appointment and it will appear here.</p>
            <Link to="/book" className="myappt-book-btn">Book Appointment</Link>
          </div>
        ) : (
          <>
            <section className="myappt-section">
              <h2 className="myappt-section-title">Upcoming Appointments</h2>
              {upcoming.length > 0 ? (
                <div className="myappt-grid">{upcoming.map(renderCard)}</div>
              ) : (
                <p className="myappt-none">No upcoming appointments.</p>
              )}
            </section>

            <section className="myappt-section">
              <h2 className="myappt-section-title">Past & Cancelled</h2>
              {past.length > 0 ? (
                <div className="myappt-grid">{past.map(renderCard)}</div>
              ) : (
                <p className="myappt-none">No past appointments.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default MyAppointments
