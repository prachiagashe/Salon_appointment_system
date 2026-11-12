import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedLink({ to, children, className, ...props }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const target = isAuthenticated
    ? to
    : `/login?redirect=${encodeURIComponent(to + location.search)}`

  return (
    <Link to={target} className={className} {...props}>
      {children}
    </Link>
  )
}

export default ProtectedLink
