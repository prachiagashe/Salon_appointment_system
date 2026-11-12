import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import ServicesHero from '../components/ServicesHero'
import ServiceCategories from '../components/ServiceCategories'
import ServicesListing from '../components/ServicesListing'
import ServiceDetailsModal from '../components/ServiceDetailsModal'
import './Services.css'

function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('name')
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    // Hair Care
    {
      id: 1,
      name: 'Haircut & Styling',
      category: 'Hair Care',
      description: 'Professional haircut and styling tailored to your face shape and preferences.',
      fullDescription: 'Our expert stylists will create the perfect look for you with a personalized consultation, precision cutting, and professional styling. Includes wash and blow-dry.',
      price: 50,
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
      benefits: ['Personalized consultation', 'Precision cutting', 'Professional styling', 'Wash and blow-dry included']
    },
    {
      id: 2,
      name: 'Hair Coloring',
      category: 'Hair Care',
      description: 'Premium hair coloring services using high-quality products for vibrant, long-lasting results.',
      fullDescription: 'Transform your look with our premium hair coloring services. We use only the highest quality products to ensure vibrant, long-lasting color that nourishes your hair.',
      price: 120,
      duration: '2 hours',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      benefits: ['Premium color products', 'Expert colorists', 'Hair nourishing formula', 'Long-lasting results']
    },
    {
      id: 3,
      name: 'Hair Spa',
      category: 'Hair Care',
      description: 'Deep conditioning treatment to rejuvenate and nourish your hair.',
      fullDescription: 'Indulge in our luxurious hair spa treatment that includes deep conditioning, scalp massage, and hair mask application to rejuvenate and nourish your hair from root to tip.',
      price: 80,
      duration: '1 hour',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop',
      benefits: ['Deep conditioning', 'Scalp massage', 'Hair mask treatment', 'Rejuvenating experience']
    },
    {
      id: 4,
      name: 'Hair Straightening',
      category: 'Hair Care',
      description: 'Professional hair straightening for sleek, smooth, and manageable hair.',
      fullDescription: 'Achieve sleek, smooth, and manageable hair with our professional straightening treatment. We use advanced techniques and premium products for long-lasting results.',
      price: 200,
      duration: '3 hours',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop',
      benefits: ['Sleek smooth hair', 'Long-lasting results', 'Premium products', 'Expert application']
    },
    // Skin Care
    {
      id: 5,
      name: 'Basic Facial',
      category: 'Skin Care',
      description: 'Refreshing facial treatment to cleanse and rejuvenate your skin.',
      fullDescription: 'Our basic facial includes deep cleansing, exfoliation, toning, and moisturizing to leave your skin refreshed and glowing.',
      price: 60,
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
      benefits: ['Deep cleansing', 'Exfoliation', 'Toning', 'Moisturizing']
    },
    {
      id: 6,
      name: 'Advanced Facial',
      category: 'Skin Care',
      description: 'Intensive facial treatment with specialized products for specific skin concerns.',
      fullDescription: 'Our advanced facial addresses specific skin concerns with specialized products and techniques including anti-aging, brightening, or acne treatments.',
      price: 120,
      duration: '1.5 hours',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop',
      benefits: ['Specialized treatment', 'Customized products', 'Expert estheticians', 'Visible results']
    },
    {
      id: 7,
      name: 'Cleanup',
      category: 'Skin Care',
      description: 'Quick skin cleanup to remove impurities and refresh your complexion.',
      fullDescription: 'A quick yet effective skin cleanup that removes impurities, unclogs pores, and refreshes your complexion for a radiant glow.',
      price: 40,
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
      benefits: ['Quick treatment', 'Removes impurities', 'Unclogs pores', 'Radiant glow']
    },
    {
      id: 8,
      name: 'Skin Treatment',
      category: 'Skin Care',
      description: 'Specialized skin treatments for various skin conditions and concerns.',
      fullDescription: 'Our specialized skin treatments address various conditions including acne, pigmentation, aging, and sensitivity using advanced techniques and premium products.',
      price: 150,
      duration: '2 hours',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
      benefits: ['Specialized care', 'Advanced techniques', 'Premium products', 'Expert guidance']
    },
    // Nail Care
    {
      id: 9,
      name: 'Manicure',
      category: 'Nail Care',
      description: 'Professional manicure for beautiful, well-groomed hands and nails.',
      fullDescription: 'Pamper your hands with our professional manicure including nail shaping, cuticle care, hand massage, and polish application.',
      price: 35,
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      benefits: ['Nail shaping', 'Cuticle care', 'Hand massage', 'Polish application']
    },
    {
      id: 10,
      name: 'Pedicure',
      category: 'Nail Care',
      description: 'Relaxing pedicure treatment for soft, beautiful feet.',
      fullDescription: 'Indulge in our relaxing pedicure that includes foot soak, exfoliation, nail care, foot massage, and polish application.',
      price: 45,
      duration: '1 hour',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop',
      benefits: ['Foot soak', 'Exfoliation', 'Foot massage', 'Nail care']
    },
    {
      id: 11,
      name: 'Nail Art',
      category: 'Nail Care',
      description: 'Creative nail art designs to express your unique style.',
      fullDescription: 'Express your unique style with our creative nail art designs. From simple patterns to intricate artwork, our artists can create any look you desire.',
      price: 60,
      duration: '1 hour',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop',
      benefits: ['Creative designs', 'Custom patterns', 'Quality materials', 'Expert artists']
    },
    // Makeup & Bridal
    {
      id: 12,
      name: 'Party Makeup',
      category: 'Makeup & Bridal',
      description: 'Glamorous party makeup for special occasions and events.',
      fullDescription: 'Look stunning at your next event with our glamorous party makeup. Our artists create flawless looks that last all night.',
      price: 80,
      duration: '1 hour',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
      benefits: ['Flawless finish', 'Long-lasting', 'Premium products', 'Expert artists']
    },
    {
      id: 13,
      name: 'Bridal Makeup',
      category: 'Makeup & Bridal',
      description: 'Complete bridal makeup package for your special day.',
      fullDescription: 'Our complete bridal makeup package includes consultation, trial, and day-of makeup application to ensure you look absolutely stunning on your special day.',
      price: 250,
      duration: '2.5 hours',
      image: 'https://images.unsplash.com/photo-1457972729786-0411a7b2b426?w=400&h=300&fit=crop',
      benefits: ['Complete package', 'Trial included', 'Premium products', 'Expert bridal artists']
    },
    {
      id: 14,
      name: 'Engagement Makeup',
      category: 'Makeup & Bridal',
      description: 'Beautiful engagement makeup for pre-wedding celebrations.',
      fullDescription: 'Look radiant at your engagement with our beautiful makeup service. Perfect for pre-wedding celebrations and photos.',
      price: 150,
      duration: '1.5 hours',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      benefits: ['Radiant look', 'Photo-ready', 'Long-lasting', 'Customized style']
    },
    // Spa & Wellness
    {
      id: 15,
      name: 'Body Massage',
      category: 'Spa & Wellness',
      description: 'Relaxing full body massage to relieve stress and tension.',
      fullDescription: 'Relieve stress and tension with our relaxing full body massage. Our skilled therapists use various techniques to promote relaxation and wellness.',
      price: 100,
      duration: '1.5 hours',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
      benefits: ['Stress relief', 'Muscle relaxation', 'Improved circulation', 'Wellness promotion']
    },
    {
      id: 16,
      name: 'Head Massage',
      category: 'Spa & Wellness',
      description: 'Soothing head massage to promote relaxation and hair health.',
      fullDescription: 'Enjoy a soothing head massage that promotes relaxation, reduces stress, and improves hair health with essential oils.',
      price: 40,
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=300&fit=crop',
      benefits: ['Stress reduction', 'Hair health', 'Essential oils', 'Relaxation']
    },
    {
      id: 17,
      name: 'Aromatherapy',
      category: 'Spa & Wellness',
      description: 'Therapeutic aromatherapy session for mind and body wellness.',
      fullDescription: 'Experience the healing power of aromatherapy with our therapeutic session using essential oils to promote mind and body wellness.',
      price: 90,
      duration: '1 hour',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop',
      benefits: ['Mind wellness', 'Body relaxation', 'Essential oils', 'Therapeutic benefits']
    }
  ]

  const categories = ['All', 'Hair Care', 'Skin Care', 'Nail Care', 'Makeup & Bridal', 'Spa & Wellness']

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
