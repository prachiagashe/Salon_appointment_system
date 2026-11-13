import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/booking'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    const result = await login({ email, password })
    if (result.success) {
      const session = JSON.parse(localStorage.getItem('salonease_session') || '{}')
      const isAdmin = session?.user?.role?.toLowerCase() === 'admin'
      const hasExplicitRedirect = !!searchParams.get('redirect')
      if (isAdmin) {
        navigate(hasExplicitRedirect ? redirect : '/admin')
      } else {
        navigate(hasExplicitRedirect ? redirect : '/')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-page">
      <Navbar activePage="" />
      <div className="auth-container">
        <Link to="/" className="auth-back">← Back to Home</Link>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to book your appointment</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn">LOGIN</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
