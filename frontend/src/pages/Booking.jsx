import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import './Booking.css'

const services = [
  'Haircut & Styling',
  'Hair Coloring',
  'Balayage',
  'Highlights',
  'Hair Spa',
  'Basic Facial',
  'Advanced Facial',
  'Cleanup',
  'Manicure',
  'Pedicure',
  'Nail Art',
  'Gel Manicure',
  'Party Makeup',
  'Bridal Makeup',
  'Body Massage',
  'Head Massage',
  'Aromatherapy',
  'Hot Stone Therapy'
]

const staffList = [
  { id: 1, name: 'Sarah Johnson' },
  { id: 2, name: 'Michael Chen' },
  { id: 3, name: 'Emily Rodriguez' },
  { id: 4, name: 'David Kim' },
  { id: 5, name: 'Lisa Thompson' },
  { id: 6, name: 'James Wilson' },
  { id: 7, name: 'Amanda Foster' },
  { id: 8, name: 'Robert Martinez' }
]

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM'
]

function Booking() {
  const { isAuthenticated, user, token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [service, setService] = useState(searchParams.get('service') || '')
  const [staffId, setStaffId] = useState(searchParams.get('staff') || '')
  const [staffName, setStaffName] = useState(searchParams.get('staffName') || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [phone, setPhone] = useState(user?.phone || '')
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [smsSentTo, setSmsSentTo] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = `/booking${window.location.search}`
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!service || !staffId || !date || !time || !phone.trim()) {
      setError('Please select a service, staff member, date, time and enter your mobile number.')
      return
    }

    const booking = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: phone.trim(),
      service,
      staffId: Number(staffId),
      staffName,
      date,
      time,
      notes,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    }

    const bookings = JSON.parse(localStorage.getItem('salonease_bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('salonease_bookings', JSON.stringify(bookings))

    // Fire-and-forget POST to backend; SMS is queued server-side via BackgroundTasks
    try {
      await fetch('http://localhost:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          service_name: service,
          staff_name: staffName,
          appointment_date: date,
          appointment_time: time,
          customer_name: user.name,
          customer_email: user.email,
          phone: phone.trim(),
          notes
        })
      })
      setSmsSentTo(phone.trim())
    } catch (err) {
      // Backend unreachable — booking is still saved locally
      console.warn('Backend booking POST failed:', err)
    }

    setConfirmed(true)
  }

  if (!isAuthenticated) {
    return null
  }

  if (confirmed) {
    return (
      <div className="booking-page">
        <Navbar activePage="" />
        <div className="booking-confirmation">
          <div className="confirmation-card">
            <div className="confirmation-icon">✓</div>
            <h1 className="confirmation-title">Appointment Confirmed!</h1>
            <p className="confirmation-text">
              Thank you, {user.name}. Your appointment has been booked successfully.
            </p>
            <div className="confirmation-details">
              <p><strong>Service:</strong> {service}</p>
              <p><strong>Staff:</strong> {staffName}</p>
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Time:</strong> {time}</p>
            </div>
            {smsSentTo && (
              <p className="confirmation-sms-note">
                A confirmation message has been sent to {smsSentTo}.
              </p>
            )}
            <div className="confirmation-actions">
              <Link to="/" className="confirmation-btn secondary">Back to Home</Link>
              <button
                className="confirmation-btn primary"
                onClick={() => {
                  setConfirmed(false)
                  setService('')
                  setStaffId('')
                  setStaffName('')
                  setDate('')
                  setTime('')
                  setNotes('')
                  setSmsSentTo('')
                }}
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="booking-page">
      <Navbar activePage="" />

      <div className="booking-header">
        <div className="booking-header-overlay"></div>
        <div className="booking-header-content">
          <h1 className="booking-header-title">Book Your Appointment</h1>
          <p className="booking-header-subtitle">
            Logged in as {user.name} · {user.email}
          </p>
        </div>
      </div>

      <div className="booking-form-section">
        <form className="booking-form" onSubmit={handleSubmit}>
          {error && <div className="booking-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Service *</label>
              <select
                className="form-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              >
                <option value="">Choose a service...</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Staff Member *</label>
              <select
                className="form-select"
                value={staffId}
                onChange={(e) => {
                  setStaffId(e.target.value)
                  const selected = staffList.find(s => s.id === Number(e.target.value))
                  setStaffName(selected ? selected.name : '')
                }}
                required
              >
                <option value="">Choose a staff member...</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                className="form-input"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time *</label>
              <select
                className="form-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Choose a time...</option>
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Any special requests or preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number (for confirmation SMS) *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Information</label>
              <div className="contact-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          </div>

          <button type="submit" className="booking-submit-btn">
            CONFIRM APPOINTMENT
          </button>
        </form>
      </div>
    </div>
  )
}

export default Booking
