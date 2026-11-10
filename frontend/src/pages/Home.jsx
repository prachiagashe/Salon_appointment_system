import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AppointmentBooking from '../components/AppointmentBooking'
import MeetStylists from '../components/MeetStylists'
import BeyondBeauty from '../components/BeyondBeauty'
import '../components/Home.css'

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <AppointmentBooking />
      <MeetStylists />
      <BeyondBeauty />
    </div>
  )
}

export default Home
