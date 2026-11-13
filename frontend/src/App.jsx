import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Services from './pages/Services'
import Staff from './pages/Staff'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import About from './pages/About'
import Profile from './pages/Profile'
import MyAppointments from './pages/MyAppointments'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
