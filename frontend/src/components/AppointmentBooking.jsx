import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState('Today May 24')
  const [selectedTime, setSelectedTime] = useState('10:30 AM')

  const dates = [
    'Today May 24',
    'Sun May 25',
    'Mon May 26',
    'Tue May 27',
    'Wed May 28',
    'Thu May 29',
    'Fri May 30'
  ]

  const times = [
    '9:00 AM',
    '10:30 AM',
    '12:00 PM',
    '1:30 PM',
    '3:00 PM',
    '4:30 PM',
    '6:00 PM'
  ]

  return (
    <section className="appointment-booking">
      <div className="booking-container">
        <h2 className="booking-title">BOOK YOUR APPOINTMENT</h2>
        <p className="booking-subtitle">When would you like to visit?</p>
        
        <div className="date-selector">
          {dates.map((date) => (
            <button
              key={date}
              className={`date-btn ${selectedDate === date ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </button>
          ))}
        </div>

        <div className="time-selector">
          {times.map((time) => (
            <button
              key={time}
              className={`time-btn ${selectedTime === time ? 'active' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <Link to="/booking" className="continue-btn">Continue to Booking</Link>
      </div>
    </section>
  )
}

export default AppointmentBooking
