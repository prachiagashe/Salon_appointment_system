import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useAdminShell } from '../layouts/AdminLayout'

const PAGE_TITLES = {
  dashboard: 'Dashboard Overview',
  appointments: 'Appointments',
  services: 'Manage Services',
  staff: 'Staff Management',
  users: 'Registered Users',
  inquiries: 'Contact Inquiries'
}

function AdminTopbar() {
  const { tab, mobileNavOpen, setMobileNavOpen } = useAdminShell()
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          className="admin-topbar-menu"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
        <div>
          <h1 className="admin-topbar-title">{PAGE_TITLES[tab] || 'Admin'}</h1>
          <p className="admin-topbar-date">{today}</p>
        </div>
      </div>

      <div className="admin-topbar-right">
        <a
          className="admin-topbar-live"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Live Website <ExternalLink size={13} />
        </a>
        <div className="admin-topbar-profile">
          <span className="admin-topbar-avatar">S</span>
          <div className="admin-topbar-profile-info">
            <span className="admin-topbar-profile-name">Salon Admin</span>
            <span className="admin-topbar-profile-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
