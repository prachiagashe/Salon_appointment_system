import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'salonease_session'
const API_BASE = 'http://localhost:8000'

function readSession() {
  try {
    const session = localStorage.getItem(SESSION_KEY)
    if (!session) return { user: null, token: null }
    const parsed = JSON.parse(session)
    return { user: parsed.user || null, token: parsed.token || null }
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return { user: null, token: null }
  }
}

function mapUser(data) {
  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    phone: data.phone,
    role: data.role
  }
}

export function AuthProvider({ children }) {
  // Synchronously rehydrate from localStorage so protected routes never
  // see user === null on the first render after a refresh.
  const [initial] = useState(readSession)
  const [user, setUser] = useState(initial.user)
  const [token, setToken] = useState(initial.token)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!initial.token) {
      setLoading(false)
      return
    }

    let cancelled = false

    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${initial.token}` }
    })
      .then(async (res) => {
        if (res.status === 401) {
          // Token expired/invalid — clear session
          localStorage.removeItem(SESSION_KEY)
          if (!cancelled) {
            setUser(null)
            setToken(null)
          }
          return null
        }
        if (!res.ok) {
          // Transient server error — keep the cached session
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (cancelled || !data) return
        const freshUser = mapUser(data)
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: freshUser, token: initial.token }))
        setUser(freshUser)
      })
      .catch(() => {
        // Network error — do NOT log the user out
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const sessionUser = mapUser(data.user)
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
      const sessionUser = mapUser(data.user)
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
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
