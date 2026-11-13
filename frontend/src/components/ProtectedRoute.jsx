import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * AdminRoute — renders children only for authenticated admin users.
 * Customers and guests are redirected away from the admin panel.
 */
export function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />
  }
  if (user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

/**
 * CustomerRoute — renders children only for authenticated customer users.
 * Admins are sent to the admin panel; guests to login.
 */
export function CustomerRoute({ children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (user?.role?.toLowerCase() === 'admin') {
    return <Navigate to="/admin" replace />
  }
  return children
}
