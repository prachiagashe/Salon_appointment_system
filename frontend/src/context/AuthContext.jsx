import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'salonease_session'
const API_BASE = 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try {
        const parsed = JSON.parse(session)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  }, [])

  const register = async ({ name, email, phone, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, phone, password })
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.detail || 'Registration failed.' }
      }
      const sessionUser = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: sessionUser, token: data.access_token }))
      setUser(sessionUser)
      setToken(data.access_token)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Could not reach the server. Please try again.' }
    }
  }

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.detail || 'Invalid email or password.' }
      }
      const sessionUser = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: sessionUser, token: data.access_token }))
      setUser(sessionUser)
      setToken(data.access_token)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Could not reach the server. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
