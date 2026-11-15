import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthLoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FAF7F2',
      gap: '18px'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '3px solid #E4DCCB',
        borderTopColor: '#2E4A3E',
        animation: 'auth-spin 0.8s linear infinite'
      }} />
      <p style={{
        fontSize: '12px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#5C6B63',
        margin: 0
      }}>
        Silken Atelier
      </p>
      <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/**
 * AdminRoute — renders children only for authenticated admin users.
 * Customers and guests are redirected away from the admin panel.
 */
export function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }
  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />
  }
  if (user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

/**
 * CustomerRoute — renders children only for authenticated customer users.
 * Admins are sent to the admin panel; guests to login.
 */
export function CustomerRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role?.toLowerCase() === 'admin') {
    return <Navigate to="/admin" replace />
  }
  return children
}
