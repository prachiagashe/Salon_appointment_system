import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

function MeetStylists() {
  const stylists = [
    {
      name: 'LENA MORGAN',
      role: 'Master Stylist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'SOPHIA CHEN',
      role: 'Senior Stylist',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'EMMA ROSE',
      role: 'Color Specialist',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'JAMES WILSON',
      role: 'Stylist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    }
  ]

  return (
    <section className="meet-stylists">
      <div className="stylists-header">
        <h2 className="stylists-title">MEET OUR STYLISTS</h2>
        <Link to="/staff" className="view-all-link">VIEW ALL</Link>
      </div>
      
      <div className="stylists-grid">
        {stylists.map((stylist, index) => (
          <div key={index} className="stylist-card">
            <div className="stylist-image">
              <img src={stylist.image} alt={stylist.name} />
            </div>
            <h3 className="stylist-name">{stylist.name}</h3>
            <p className="stylist-role">{stylist.role}</p>
            <a href="#" className="instagram-link">
              <Instagram size={20} />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MeetStylists
