import React from 'react'
import { Link } from 'react-router-dom'
import ProtectedLink from './ProtectedLink'

function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop"
      >
        <source
          src="https://videos.pexels.com/video-files/7820146/7820146-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-eyebrow">Silken Atelier · Est. 2014</p>
        <h1 className="hero-title">Quiet luxury for every strand</h1>
        <p className="hero-description">
          At Silken Atelier, we believe that true beauty begins with self-care.
          Our expert stylists combine artistry with premium products to create
          an experience that transforms not just your hair, but your confidence.
        </p>
        <div className="hero-actions">
          <ProtectedLink to="/book" className="hero-btn">BOOK YOUR EXPERIENCE</ProtectedLink>
          <Link to="/services" className="hero-btn-secondary">EXPLORE SERVICES</Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  )
}

export default Hero
