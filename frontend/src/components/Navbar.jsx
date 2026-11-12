import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProtectedLink from './ProtectedLink'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar({ activePage }) {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

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
            <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
            <button className="logout-link" onClick={() => { logout(); closeMenu() }}>LOGOUT</button>
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
