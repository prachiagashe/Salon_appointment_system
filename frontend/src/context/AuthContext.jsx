import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'salonease_users'
const SESSION_KEY = 'salonease_session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  }, [])

  const register = ({ name, email, phone, password }) => {
    const users = getUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    const newUser = { id: Date.now(), name, email, phone, password }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { success: true }
  }

  const login = ({ email, password }) => {
    const users = getUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, phone: found.phone }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
