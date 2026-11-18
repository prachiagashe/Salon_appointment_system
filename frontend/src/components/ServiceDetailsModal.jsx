import React from 'react'

const formatOfferEnds = (iso) => {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  const diffMs = d - new Date()
  if (diffMs <= 0) return ''
  const hours = Math.floor(diffMs / 3600000)
  if (hours < 48) {
    const days = Math.floor(hours / 24)
    const h = hours % 24
    const m = Math.floor((diffMs % 3600000) / 60000)
    return `Ends in ${days > 0 ? `${days}d ` : ''}${h}h ${m}m`
  }
  return `Offer ends ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`
}

function ServiceDetailsModal({ service, onClose, onBookNow }) {
  if (!service) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <div className="modal-image">
            <img src={service.image} alt={service.name} />
          </div>
          
          <div className="modal-details">
            <div className="modal-category">{service.category}</div>
            <h2 className="modal-title">{service.name}</h2>
            {service.hasOffer && (
              <span className="offer-badge offer-badge-lg">
                {service.offerLabel || `${service.discountPercent}% OFF`}
              </span>
            )}
            {service.hasOffer && service.offerExpiresAt && (
              <p className="offer-ends-note">{formatOfferEnds(service.offerExpiresAt)}</p>
            )}

            <div className="modal-meta">
              <div className="meta-item">
                <span className="meta-label">Price:</span>
                {service.hasOffer ? (
                  <span className="meta-value">
                    <span className="price-original">₹{service.price}</span>{' '}
                    <strong className="price-offer">₹{service.finalPrice}</strong>
                  </span>
                ) : (
                  <span className="meta-value">₹{service.price}</span>
                )}
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{service.duration}</span>
              </div>
            </div>

            <div className="modal-description">
              <h3>Description</h3>
              <p>{service.fullDescription}</p>
            </div>

            {(service.benefits || []).length > 0 && (
              <div className="modal-benefits">
                <h3>Benefits</h3>
                <ul>
                  {service.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-staff">
              <h3>Available Staff</h3>
              <div className="staff-list">
                <div className="staff-item">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face" alt="Staff" />
                  <span>Lena Morgan</span>
                </div>
                <div className="staff-item">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face" alt="Staff" />
                  <span>Sophia Chen</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onBookNow(service)}
              className="modal-book-btn"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailsModal
