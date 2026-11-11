import React from 'react'
import { Link } from 'react-router-dom'

function Navbar({ activePage }) {
  return (
    <nav className="navbar">
      <div className="top-bar">
        <span className="offer-text">New Client Offer: Enjoy 20% off your first visit.</span>
        <Link to="/booking" className="book-now-btn">Book Now</Link>
      </div>
      <div className="main-nav">
        <div className="nav-logo">SILKEN ATELIER</div>
        <div className="nav-links">
          <Link to="/" className={activePage === 'home' ? 'active' : ''}>HOME</Link>
          <Link to="/services" className={activePage === 'services' ? 'active' : ''}>SERVICES</Link>
          <Link to="/staff" className={activePage === 'staff' ? 'active' : ''}>OUR STAFF</Link>
          <Link to="/about" className={activePage === 'about' ? 'active' : ''}>ABOUT US</Link>
          <Link to="/contact" className={activePage === 'contact' ? 'active' : ''}>CONTACT</Link>
        </div>
        <div className="nav-auth">
          <Link to="/login" className="login-link">LOGIN</Link>
          <Link to="/register" className="register-link">REGISTER</Link>
        </div>
        <Link to="/booking" className="book-appointment-btn">BOOK APPOINTMENT</Link>
      </div>
    </nav>
  )
}

export default Navbar
