import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from 'lucide-react'
import './Contact.css'

const subjects = [
  'General Inquiry',
  'Bridal/Event Package',
  'Service Consultation',
  'Feedback'
]

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
}

function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    if (!form.full_name.trim()) next.full_name = 'Full name is required.'
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!form.subject) next.subject = 'Please select a subject.'
    if (!form.message.trim()) next.message = 'Message is required.'
    else if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await axios.post('http://localhost:8000/api/contact', {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject,
        message: form.message.trim()
      })
      setSubmitted(true)
      setForm(initialForm)
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail ||
        'Something went wrong. Please try again or call us directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <Navbar activePage="contact" />

      <section className="contact-hero">
        <div className="contact-hero-content">
          <p className="contact-eyebrow">Get In Touch</p>
          <h1 className="contact-hero-title">We'd Love to Hear From You</h1>
          <p className="contact-hero-subtitle">
            Questions about services, bridal packages, or your next appointment?
            Our team is here to help.
          </p>
        </div>
      </section>

      <section className="contact-body">
        {/* Left: details */}
        <div className="contact-info">
          <div className="contact-info-card">
            <h2 className="contact-info-title">Visit or Reach Us</h2>

            <div className="contact-detail">
              <MapPin size={20} className="contact-detail-icon" />
              <div>
                <h3>Address</h3>
                <p>Silken Atelier, 14th Floor, Orion Mall,<br />Koregaon Park, Pune, Maharashtra 411001</p>
              </div>
            </div>

            <div className="contact-detail">
              <Phone size={20} className="contact-detail-icon" />
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-detail">
              <Mail size={20} className="contact-detail-icon" />
              <div>
                <h3>Email</h3>
                <p>hello@silkenatelier.in</p>
              </div>
            </div>

            <div className="contact-detail">
              <Clock size={20} className="contact-detail-icon" />
              <div>
                <h3>Opening Hours</h3>
                <p>Monday – Sunday<br />10:00 AM – 8:30 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="Silken Atelier Location"
              src="https://www.google.com/maps?q=Koregaon+Park,+Pune,+Maharashtra&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right: form */}
        <div className="contact-form-wrapper">
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send Us a Message</h2>

            {submitted ? (
              <div className="contact-success">
                <CheckCircle size={48} className="contact-success-icon" />
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  className="contact-submit-btn"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                {submitError && <div className="contact-error">{submitError}</div>}

                <div className="contact-field">
                  <label className="contact-label">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    className={`contact-input${errors.full_name ? ' error' : ''}`}
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                  {errors.full_name && <span className="contact-field-error">{errors.full_name}</span>}
                </div>

                <div className="contact-field-row">
                  <div className="contact-field">
                    <label className="contact-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className={`contact-input${errors.email ? ' error' : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="contact-field-error">{errors.email}</span>}
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="contact-input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Subject *</label>
                  <select
                    name="subject"
                    className={`contact-input${errors.subject ? ' error' : ''}`}
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject...</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && <span className="contact-field-error">{errors.subject}</span>}
                </div>

                <div className="contact-field">
                  <label className="contact-label">Message *</label>
                  <textarea
                    name="message"
                    className={`contact-textarea${errors.message ? ' error' : ''}`}
                    placeholder="How can we help you?"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                  {errors.message && <span className="contact-field-error">{errors.message}</span>}
                </div>

                <button type="submit" className="contact-submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="contact-spinner" /> Sending...
                    </>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
