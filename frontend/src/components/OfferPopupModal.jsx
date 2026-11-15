import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import './OfferPopupModal.css'

function OfferPopupModal({ services, onClose }) {
  const navigate = useNavigate()

  if (!services || services.length === 0) return null

  const handleBook = (service) => {
    onClose()
    navigate(`/book?serviceId=${service.id}`)
  }

  return (
    <div className="offer-popup-overlay" onClick={onClose}>
      <div className="offer-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="offer-popup-close" onClick={onClose} aria-label="Close offer">
          <X size={18} />
        </button>

        <p className="offer-popup-eyebrow">LIMITED TIME SALON OFFER</p>
        <h2 className="offer-popup-title">Special Offers Await You</h2>
        <p className="offer-popup-subtitle">
          Treat yourself to premium services at exclusive prices — available for a limited time only.
        </p>

        <div className="offer-popup-list">
          {services.map((s) => (
            <div key={s.id} className="offer-popup-item">
              <div className="offer-popup-item-head">
                <span className="offer-popup-label">
                  {s.offer_label || 'SPECIAL OFFER'}
                </span>
                <span className="offer-popup-discount">{s.discount_percent}% OFF</span>
              </div>
              <h3 className="offer-popup-service-name">{s.name}</h3>
              {s.description && (
                <p className="offer-popup-desc">
                  {s.description.length > 110 ? `${s.description.slice(0, 110)}…` : s.description}
                </p>
              )}
              <div className="offer-popup-prices">
                {s.price != null && (
                  <span className="price-original">₹{Number(s.price)}</span>
                )}
                {s.final_price != null && (
                  <strong className="price-offer">₹{Number(s.final_price)}</strong>
                )}
              </div>
              <button
                className="offer-popup-cta"
                onClick={() => handleBook(s)}
              >
                Claim Offer & Book Now
              </button>
            </div>
          ))}
        </div>

        <button className="offer-popup-later" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  )
}

export default OfferPopupModal
