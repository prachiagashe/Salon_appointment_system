import React from 'react'
import { Link } from 'react-router-dom'

function ServicesHero() {
  return (
    <section className="services-hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Services</span>
          </div>
          <h1 className="hero-title">Discover Our Beauty Services</h1>
          <p className="hero-subtitle">
            Experience exceptional beauty and wellness treatments delivered by our expert professionals.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ServicesHero
