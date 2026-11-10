import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="top-bar">
        <span className="offer-text">New Client Offer: Enjoy 20% off your first visit.</span>
        <Link to="/booking" className="book-now-btn">Book Now</Link>
      </div>
      <div className="main-nav">
        <div className="nav-logo">SILKEN ATELIER</div>
        <div className="nav-links">
          <Link to="/services">SERVICES</Link>
          <Link to="/stylists">STYLISTS</Link>
          <Link to="/about">ABOUT</Link>
          <Link to="/gallery">GALLERY</Link>
          <Link to="/products">PRODUCTS</Link>
          <Link to="/contact">CONTACT</Link>
        </div>
        <Link to="/booking" className="book-appointment-btn">BOOK APPOINTMENT</Link>
      </div>
    </nav>
  )
}

export default Navbar
