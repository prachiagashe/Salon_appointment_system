import React from 'react'
import ProtectedLink from './ProtectedLink'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Quiet luxury for every strand</h1>
        <p className="hero-description">
          At Silken Atelier, we believe that true beauty begins with self-care. 
          Our expert stylists combine artistry with premium products to create 
          an experience that transforms not just your hair, but your confidence.
        </p>
        <ProtectedLink to="/booking" className="hero-btn">BOOK YOUR EXPERIENCE</ProtectedLink>
      </div>
      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=1000&fit=crop" alt="Luxurious hair" />
      </div>
    </section>
  )
}

export default Hero
