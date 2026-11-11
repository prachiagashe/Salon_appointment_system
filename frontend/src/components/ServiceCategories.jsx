import React from 'react'

function ServiceCategories({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section className="service-categories">
      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}

export default ServiceCategories
