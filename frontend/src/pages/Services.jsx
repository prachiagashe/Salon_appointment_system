import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import ServicesHero from '../components/ServicesHero'
import ServiceCategories from '../components/ServiceCategories'
import ServicesListing from '../components/ServicesListing'
import ServiceDetailsModal from '../components/ServiceDetailsModal'
import './Services.css'

const API_BASE = 'http://localhost:8000'

function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('name')
  const [selectedService, setSelectedService] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/services`)
        const mapped = res.data.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category || 'General',
          description: s.description || '',
          fullDescription: s.description || '',
          price: s.price != null ? Number(s.price) : 0,
          duration: s.duration_minutes ? `${s.duration_minutes} mins` : '—',
          image: s.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
          benefits: []
        }))
        setServices(mapped)
      } catch (err) {
        setError('Failed to load services. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))].sort()

  const handleBookNow = (service) => {
    const bookingPath = `/booking?service=${encodeURIComponent(service.name)}`
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`)
      return
    }
    navigate(bookingPath)
  }

  const handleViewDetails = (service) => {
    setSelectedService(service)
  }

  const handleCloseModal = () => {
    setSelectedService(null)
  }

  return (
    <div className="services-page">
      <Navbar activePage="services" />
      <ServicesHero />
      <ServiceCategories 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {loading ? (
        <section className="services-listing">
          <div className="listing-container">
            <div className="services-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="service-card service-card-skeleton" />
              ))}
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="services-listing">
          <div className="listing-container">
            <div className="no-results">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <ServicesListing
          services={services}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          priceRange={priceRange}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onPriceRangeChange={setPriceRange}
          onSortChange={setSortBy}
          onBookNow={handleBookNow}
          onViewDetails={handleViewDetails}
        />
      )}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={handleCloseModal}
          onBookNow={handleBookNow}
        />
      )}
    </div>
  )
}

export default Services
