import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Sparkles, Leaf, HeartHandshake, Award } from 'lucide-react'
import './About.css'

const stats = [
  { value: '10+', label: 'Years of Excellence' },
  { value: '15+', label: 'Certified Stylists' },
  { value: '5,000+', label: 'Happy Clients' },
  { value: '100%', label: 'Organic & Premium Products' }
]

const facilities = [
  {
    icon: Sparkles,
    title: 'Private Bridal Suites',
    description: 'Serene, dedicated spaces for brides and their party to relax and glow on their big day.'
  },
  {
    icon: Leaf,
    title: 'Complimentary Herbal Refreshments',
    description: 'Artisan teas, infused waters, and wellness shots served throughout your visit.'
  },
  {
    icon: HeartHandshake,
    title: 'Personalized Diagnostics',
    description: 'In-depth hair and skin analysis to craft treatments tailored uniquely to you.'
  },
  {
    icon: Award,
    title: 'Hygienic Sterilized Tools',
    description: 'Hospital-grade sterilization protocols for every tool, every client, every time.'
  }
]

function About() {
  return (
    <div className="about-page">
      <Navbar activePage="about" />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <p className="about-hero-eyebrow">Our Story</p>
          <h1 className="about-hero-title">Crafting Timeless Beauty & Modern Elegance</h1>
          <p className="about-hero-subtitle">
            Silken Atelier is where artistry meets wellness — a sanctuary dedicated to
            hair, skin, and self-care, guided by passion and perfected by expertise.
          </p>
          <Link to="/book" className="about-hero-cta">Book Appointment</Link>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="about-story">
        <div className="about-story-grid">
          <div className="about-story-image">
            <div className="about-story-img-placeholder">
              <span>Silken Atelier Interior</span>
            </div>
          </div>
          <div className="about-story-text">
            <p className="about-eyebrow">Heritage & Philosophy</p>
            <h2 className="about-section-title">A Legacy of Care, Reimagined</h2>
            <p>
              Founded over a decade ago, Silken Atelier began as a small neighborhood
              studio with a bold vision: beauty rituals should feel like therapy. Today,
              our team of certified stylists and therapists continues that tradition,
              blending time-honored techniques with the latest innovations in hair and
              skincare.
            </p>
            <p>
              Every treatment begins with listening. We take time to understand your
              lifestyle, your concerns, and your goals — then design an experience that
              is unmistakably yours.
            </p>
            <ul className="about-commitments">
              <li><strong>Hygiene First:</strong> Autoclave-sterilized tools and single-use disposables, always.</li>
              <li><strong>Sustainability:</strong> Refillable product stations and eco-conscious salon practices.</li>
              <li><strong>Cruelty-Free Luxury:</strong> We curate only premium, ethically sourced, cruelty-free brands.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="about-stats">
        <div className="about-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat-card">
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section className="about-facilities">
        <div className="about-section-header">
          <p className="about-eyebrow">The Silken Experience</p>
          <h2 className="about-section-title">Facilities & Amenities</h2>
        </div>
        <div className="about-facilities-grid">
          {facilities.map((f) => (
            <div key={f.title} className="about-facility-card">
              <div className="about-facility-icon">
                <f.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="about-facility-title">{f.title}</h3>
              <p className="about-facility-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="about-cta-banner">
        <h2 className="about-cta-title">Ready for your transformation?</h2>
        <p className="about-cta-text">Book your appointment today and experience the Silken Atelier difference.</p>
        <Link to="/book" className="about-cta-btn">Book Appointment</Link>
      </section>
    </div>
  )
}

export default About
