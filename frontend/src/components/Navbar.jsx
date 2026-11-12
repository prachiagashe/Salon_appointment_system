import React from 'react'
import { Link } from 'react-router-dom'
import ProtectedLink from './ProtectedLink'
import { useAuth } from '../context/AuthContext'

function Navbar({ activePage }) {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="top-bar">
        <span className="offer-text">New Client Offer: Enjoy 20% off your first visit.</span>
        <ProtectedLink to="/booking" className="book-now-btn">Book Now</ProtectedLink>
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
          {isAuthenticated ? (
            <>
              <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
              <button className="logout-link" onClick={logout}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">LOGIN</Link>
              <Link to="/register" className="register-link">REGISTER</Link>
            </>
          )}
        </div>
        <ProtectedLink to="/booking" className="book-appointment-btn">BOOK APPOINTMENT</ProtectedLink>
      </div>
    </nav>
  )
}

export default Navbar
