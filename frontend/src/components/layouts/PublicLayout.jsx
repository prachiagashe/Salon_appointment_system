import React from 'react'
import { Outlet } from 'react-router-dom'

// Public customer layout. Individual public pages render their own
// Navbar (and page-specific chrome); this wrapper keeps the route
// tree explicit and reserves a single place for shared public chrome.
function PublicLayout() {
  return <Outlet />
}

export default PublicLayout
