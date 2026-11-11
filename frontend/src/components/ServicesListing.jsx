import React from 'react'
import { Link } from 'react-router-dom'

function ServicesListing({
  services,
  selectedCategory,
  searchTerm,
  priceRange,
  sortBy,
  onSearchChange,
  onPriceRangeChange,
  onSortChange,
  onBookNow,
  onViewDetails
}) {
  const filterAndSortServices = () => {
    let filtered = services

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by price range
    if (priceRange !== 'all') {
      if (priceRange === 'low') {
        filtered = filtered.filter(service => service.price <= 50)
      } else if (priceRange === 'medium') {
        filtered = filtered.filter(service => service.price > 50 && service.price <= 100)
      } else if (priceRange === 'high') {
        filtered = filtered.filter(service => service.price > 100)
      }
    }

    // Sort services
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }

  const filteredServices = filterAndSortServices()

  const handleClearFilters = () => {
    onSearchChange('')
    onPriceRangeChange('all')
    onSortChange('name')
  }

  return (
    <section className="services-listing">
      <div className="listing-container">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range:</label>
            <select
              value={priceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="low">Under $50</option>
              <option value="medium">$50 - $100</option>
              <option value="high">Over $100</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>

          <button onClick={handleClearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>

        <div className="results-count">
          Showing {filteredServices.length} services
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-image">
                <img src={service.image} alt={service.name} />
                <div className="service-category-badge">{service.category}</div>
              </div>
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-meta">
                  <span className="service-price">${service.price}</span>
                  <span className="service-duration">{service.duration}</span>
                </div>
                <div className="service-actions">
                  <button
                    onClick={() => onBookNow(service)}
                    className="book-now-btn"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => onViewDetails(service)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="no-results">
            <h3>No services found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesListing
