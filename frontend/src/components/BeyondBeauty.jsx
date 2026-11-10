import React from 'react'
import { Link } from 'react-router-dom'

function BeyondBeauty() {
  return (
    <section className="beyond-beauty">
      <div className="beyond-image">
        <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1000&fit=crop" alt="Delicate flowers" />
      </div>
      <div className="beyond-content">
        <h2 className="beyond-title">BEYOND BEAUTY</h2>
        <h3 className="beyond-subtitle">Care that feels as good as it looks.</h3>
        <p className="beyond-description">
          We use premium products and mindful techniques to nourish your hair, 
          your well-being, and your natural confidence.
        </p>
        <Link to="/products" className="explore-btn">EXPLORE PRODUCTS</Link>
      </div>
    </section>
  )
}

export default BeyondBeauty
