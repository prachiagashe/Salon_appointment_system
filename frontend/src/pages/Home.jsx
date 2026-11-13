import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
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

const signatureServices = [
  {
    name: 'Bridal Makeup',
    price: 'From $250',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop'
  },
  {
    name: 'Balayage',
    price: 'From $180',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=800&fit=crop'
  },
  {
    name: 'Signature Facial',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=800&fit=crop'
  },
  {
    name: 'Gel Manicure',
    price: 'From $55',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=800&fit=crop'
  }
]

function Home() {
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
                <span className="home-service-name">{service.name}</span>
                <span className="home-service-price">{service.price}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="home-services-cta">
          <Link to="/services">VIEW ALL SERVICES</Link>
        </div>
      </section>

      <AppointmentBooking />
      <MeetStylists />
      <BeyondBeauty />
    </div>
  )
}

export default Home
