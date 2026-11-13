import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import './Staff.css'

const staffData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    designation: 'Senior Hair Stylist',
    experience: 8,
    specialization: 'Hair Care',
    bio: 'With over 8 years of experience in hair styling, Sarah specializes in modern cuts, coloring, and hair treatments. She has trained at top salons in Paris and New York.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    skills: ['Hair Cutting', 'Hair Coloring', 'Hair Spa', 'Blow Dry', 'Hair Extensions'],
    services: ['Haircut & Styling', 'Hair Coloring', 'Hair Spa', 'Hair Straightening'],
    rating: 4.9,
    reviews: 127
  },
  {
    id: 2,
    name: 'Michael Chen',
    designation: 'Master Barber',
    experience: 12,
    specialization: 'Hair Care',
    bio: 'Michael is a certified master barber with 12 years of experience. He specializes in precision cuts, beard grooming, and classic barbering techniques.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    skills: ['Precision Cuts', 'Beard Grooming', 'Hot Towel Shaves', 'Hair Design', 'Fade Techniques'],
    services: ['Haircut & Styling', 'Beard Trim', 'Hot Towel Shave', 'Hair Design'],
    rating: 4.8,
    reviews: 203
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    designation: 'Makeup Artist',
    experience: 6,
    specialization: 'Makeup & Bridal',
    bio: 'Emily is a professional makeup artist specializing in bridal and party makeup. She has worked with numerous brides and celebrities for special events.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    skills: ['Bridal Makeup', 'Party Makeup', 'Engagement Makeup', 'Airbrush Makeup', 'Hair Styling'],
    services: ['Party Makeup', 'Bridal Makeup', 'Engagement Makeup', 'Hair Styling'],
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: 'David Kim',
    designation: 'Skin Specialist',
    experience: 10,
    specialization: 'Skin Care',
    bio: 'David is a licensed skin specialist with 10 years of experience in skincare treatments. He uses advanced techniques and premium products for optimal results.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    skills: ['Facial Treatments', 'Skin Analysis', 'Chemical Peels', 'Microdermabrasion', 'Anti-Aging'],
    services: ['Basic Facial', 'Advanced Facial', 'Cleanup', 'Skin Treatment'],
    rating: 4.7,
    reviews: 89
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    designation: 'Nail Technician',
    experience: 5,
    specialization: 'Nail Care',
    bio: 'Lisa is a certified nail technician with 5 years of experience. She specializes in nail art, gel manicures, and nail care treatments.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    skills: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Nails', 'Nail Extensions'],
    services: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Manicure'],
    rating: 4.8,
    reviews: 134
  },
  {
    id: 6,
    name: 'James Wilson',
    designation: 'Spa Therapist',
    experience: 7,
    specialization: 'Spa & Wellness',
    bio: 'James is a certified spa therapist with 7 years of experience in massage therapy and wellness treatments. He specializes in deep tissue and aromatherapy.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    skills: ['Deep Tissue Massage', 'Aromatherapy', 'Hot Stone Therapy', 'Swedish Massage', 'Reflexology'],
    services: ['Body Massage', 'Head Massage', 'Aromatherapy', 'Hot Stone Therapy'],
    rating: 4.9,
    reviews: 178
  },
  {
    id: 7,
    name: 'Amanda Foster',
    designation: 'Color Specialist',
    experience: 9,
    specialization: 'Hair Care',
    bio: 'Amanda is an expert color specialist with 9 years of experience. She specializes in balayage, ombre, and creative color techniques.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    skills: ['Balayage', 'Ombre', 'Color Correction', 'Highlights', 'Creative Coloring'],
    services: ['Hair Coloring', 'Balayage', 'Highlights', 'Color Correction'],
    rating: 4.8,
    reviews: 145
  },
  {
    id: 8,
    name: 'Robert Martinez',
    designation: 'Esthetician',
    experience: 11,
    specialization: 'Skin Care',
    bio: 'Robert is a licensed esthetician with 11 years of experience in skincare and beauty treatments. He specializes in advanced facial treatments.',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    skills: ['Advanced Facials', 'Chemical Peels', 'Microdermabrasion', 'LED Therapy', 'Anti-Aging'],
    services: ['Advanced Facial', 'Skin Treatment', 'Chemical Peel', 'LED Therapy'],
    rating: 4.7,
    reviews: 112
  }
]

const specializations = ['All', 'Hair Care', 'Skin Care', 'Nail Care', 'Makeup & Bridal', 'Spa & Wellness']

function Staff() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = selectedSpecialization === 'All' || staff.specialization === selectedSpecialization
    const matchesAvailability = !showAvailableOnly || staff.availability === 'Available'
    return matchesSearch && matchesSpecialization && matchesAvailability
  })

  const handleBookAppointment = (staffId, staffName) => {
    const bookingPath = `/book?staffId=${staffId}&staffName=${encodeURIComponent(staffName)}`
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`)
      return
    }
    navigate(bookingPath)
  }

  const handleViewProfile = (staff) => {
    setSelectedStaff(staff)
  }

  const closeModal = () => {
    setSelectedStaff(null)
  }

  return (
    <div className="staff-page">
      <Navbar activePage="staff" />
      
      {/* Page Header */}
      <div className="staff-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1 className="header-title">Meet Our Professional Team</h1>
          <p className="header-subtitle">Our talented experts are here to make you look and feel your best.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search staff by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="filter-select"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="availability-filter">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Available Only</span>
            </label>
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('')
              setSelectedSpecialization('All')
              setShowAvailableOnly(false)
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="staff-grid-section">
        <div className="staff-grid-container">
          <div className="results-count">
            Showing {filteredStaff.length} staff member{filteredStaff.length !== 1 ? 's' : ''}
          </div>

          {filteredStaff.length > 0 ? (
            <div className="staff-grid">
              {filteredStaff.map(staff => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-image">
                    <img src={staff.image} alt={staff.name} />
                    <div className={`availability-badge ${staff.availability === 'Available' ? 'available' : 'busy'}`}>
                      {staff.availability}
                    </div>
                  </div>
                  
                  <div className="staff-content">
                    <h3 className="staff-name">{staff.name}</h3>
                    <p className="staff-designation">{staff.designation}</p>
                    <p className="staff-specialization">{staff.specialization}</p>
                    
                    <div className="staff-meta">
                      <span className="experience">{staff.experience} years experience</span>
                      <span className="rating">★ {staff.rating} ({staff.reviews})</span>
                    </div>

                    <p className="staff-bio">{staff.bio}</p>

                    <div className="staff-actions">
                      <button
                        className="view-profile-btn"
                        onClick={() => handleViewProfile(staff)}
                      >
                        View Profile
                      </button>
                      <button
                        className="book-appointment-btn"
                        onClick={() => handleBookAppointment(staff.id, staff.name)}
                      >
                        Book with Stylist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No Staff Found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Staff Profile Modal */}
      {selectedStaff && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-body">
              <div className="modal-header">
                <div className="modal-image">
                  <img src={selectedStaff.image} alt={selectedStaff.name} />
                </div>
                <div className="modal-info">
                  <h2 className="modal-name">{selectedStaff.name}</h2>
                  <p className="modal-designation">{selectedStaff.designation}</p>
                  <p className="modal-specialization">{selectedStaff.specialization}</p>
                  <div className="modal-meta">
                    <span className="experience">{selectedStaff.experience} years experience</span>
                    <span className="rating">★ {selectedStaff.rating} ({selectedStaff.reviews} reviews)</span>
                  </div>
                  <div className={`availability-status ${selectedStaff.availability === 'Available' ? 'available' : 'busy'}`}>
                    {selectedStaff.availability}
                  </div>
                </div>
              </div>

              <div className="modal-details">
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{selectedStaff.bio}</p>
                </div>

                <div className="modal-section">
                  <h3>Skills & Expertise</h3>
                  <div className="skills-list">
                    {selectedStaff.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Services Offered</h3>
                  <ul className="services-list">
                    {selectedStaff.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-actions">
                  <button
                    className="modal-book-btn"
                    onClick={() => {
                      handleBookAppointment(selectedStaff.id, selectedStaff.name)
                      closeModal()
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Staff
