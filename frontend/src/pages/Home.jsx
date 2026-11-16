import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import OfferPopupModal from '../components/OfferPopupModal'
import Hero from '../components/Hero'
import AppointmentBooking from '../components/AppointmentBooking'
import MeetStylists from '../components/MeetStylists'
import BeyondBeauty from '../components/BeyondBeauty'
import '../components/Home.css'

const stats = [
  { value: '10+', label: 'Years of Excellence' },
  { value: '15+', label: 'Expert Stylists' },
  { value: '5,000+', label: 'Happy Clients' },
  { value: '100%', label: 'Premium Products' }
]

const API_BASE = 'http://localhost:8000'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=800&fit=crop'

function Home() {
  const [signatureServices, setSignatureServices] = useState([])
  const [offerServices, setOfferServices] = useState([])
  const [showOfferPopup, setShowOfferPopup] = useState(false)

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/services`)
      .then((res) => {
        const offers = res.data.filter((s) => s.has_offer && s.discount_percent > 0)
        setOfferServices(offers)
        const mapped = res.data.slice(0, 4).map((s) => ({
          name: s.name,
          price: s.price != null ? `₹${Number(s.price)}` : 'Price on request',
          finalPrice: s.final_price != null ? `₹${Number(s.final_price)}` : null,
          hasOffer: !!s.has_offer && s.discount_percent > 0 && s.price != null,
          offerLabel: s.offer_label || (s.discount_percent ? `${s.discount_percent}% OFF` : null),
          image: s.image_url || FALLBACK_IMAGE
        }))
        setSignatureServices(mapped)
      })
      .catch(() => setSignatureServices([]))
  }, [])

  useEffect(() => {
    if (offerServices.length === 0) return
    if (sessionStorage.getItem('silken_offer_popup_dismissed') === '1') return
    const timer = setTimeout(() => setShowOfferPopup(true), 1200)
    return () => clearTimeout(timer)
  }, [offerServices])

  const dismissOfferPopup = () => {
    sessionStorage.setItem('silken_offer_popup_dismissed', '1')
    setShowOfferPopup(false)
  }

  return (
    <div className="home">
      <Navbar activePage="home" />
      <Hero />

      <section className="home-stats">
        <div className="home-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="home-stat">
              <span className="home-stat-value">{stat.value}</span>
              <span className="home-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-services">
        <div className="home-services-header">
          <p className="home-services-eyebrow">Our Craft</p>
          <h2 className="home-services-title">Signature Services</h2>
          <p className="home-services-subtitle">
            Each treatment is tailored to you — premium products, expert hands, and an experience worth savoring.
          </p>
        </div>
        <div className="home-services-grid">
          {signatureServices.map((service) => (
            <Link key={service.name} to="/services" className="home-service-card">
              <img src={service.image} alt={service.name} loading="lazy" />
              <div className="home-service-overlay">
                {service.hasOffer && (
                  <span className="offer-badge offer-badge-home">{service.offerLabel}</span>
                )}
                <span className="home-service-name">{service.name}</span>
                {service.hasOffer ? (
                  <span className="home-service-price">
                    <span className="price-original">{service.price}</span>{' '}
                    <strong className="price-offer">{service.finalPrice}</strong>
                  </span>
                ) : (
                  <span className="home-service-price">{service.price}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="home-services-cta">
          <Link to="/services">VIEW ALL SERVICES</Link>
        </div>
        <div className="home-gender-links">
          <Link to="/services?gender=Ladies" className="home-gender-link ladies">
            <span className="home-gender-link-title">Explore Ladies Services</span>
            <span className="home-gender-link-sub">Hair, skin, bridal & more</span>
          </Link>
          <Link to="/services?gender=Gents" className="home-gender-link gents">
            <span className="home-gender-link-title">Explore Gents Services</span>
            <span className="home-gender-link-sub">Cuts, grooming & styling</span>
          </Link>
        </div>
      </section>

      <AppointmentBooking />
      <MeetStylists />
      <BeyondBeauty />
      {showOfferPopup && (
        <OfferPopupModal services={offerServices} onClose={dismissOfferPopup} />
      )}
    </div>
  )
}

export default Home
