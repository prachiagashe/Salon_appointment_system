import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProtectedLink from './ProtectedLink'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar({ activePage }) {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'

  return (
    <nav className="navbar">
      <div className="main-nav">
        <div className="nav-logo">SILKEN ATELIER</div>
        <div className="nav-links">
          <Link to="/" className={activePage === 'home' ? 'active' : ''}>HOME</Link>
          <Link to="/services" className={activePage === 'services' ? 'active' : ''}>SERVICES</Link>
          <Link to="/staff" className={activePage === 'staff' ? 'active' : ''}>OUR STAFF</Link>
          <Link to="/about" className={activePage === 'about' ? 'active' : ''}>ABOUT US</Link>
          <Link to="/contact" className={activePage === 'contact' ? 'active' : ''}>CONTACT</Link>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <div className="nav-avatar-wrap" ref={dropdownRef}>
              <button
                className={`nav-avatar${dropdownOpen ? ' open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                {initial}
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-name">{user.name}</span>
                    <span className="nav-dropdown-email">{user.email}</span>
                  </div>
                  <div className="nav-dropdown-divider"></div>
                  <Link
                    to="/profile"
                    className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-appointments"
                    className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Booked Appointments
                  </Link>
                  <div className="nav-dropdown-divider"></div>
                  <button className="nav-dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="login-link">LOGIN</Link>
              <Link to="/register" className="register-link">REGISTER</Link>
            </div>
          )}
          <ProtectedLink to="/book" className="book-appointment-btn">BOOK APPOINTMENT</ProtectedLink>
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={closeMenu}>HOME</Link>
        <Link to="/services" onClick={closeMenu}>SERVICES</Link>
        <Link to="/staff" onClick={closeMenu}>OUR STAFF</Link>
        <Link to="/about" onClick={closeMenu}>ABOUT US</Link>
        <Link to="/contact" onClick={closeMenu}>CONTACT</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={closeMenu}>MY PROFILE</Link>
            <Link to="/my-appointments" onClick={closeMenu}>BOOKED APPOINTMENTS</Link>
            <button className="logout-link" onClick={handleLogout}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>LOGIN</Link>
            <Link to="/register" onClick={closeMenu}>REGISTER</Link>
          </>
        )}
        <ProtectedLink to="/book" className="book-appointment-btn" onClick={closeMenu}>BOOK APPOINTMENT</ProtectedLink>
      </div>
    </nav>
  )
}

export default Navbar
