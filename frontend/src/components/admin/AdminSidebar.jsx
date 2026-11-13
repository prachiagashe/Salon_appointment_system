import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, Users, Sparkles, Scissors, Mail,
  LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdminShell } from '../layouts/AdminLayout'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays, badge: 'appointments' },
  { id: 'services', label: 'Services', icon: Sparkles, badge: null },
  { id: 'staff', label: 'Staff', icon: Scissors, badge: null },
  { id: 'users', label: 'Users', icon: Users, badge: null },
  { id: 'inquiries', label: 'Inquiries', icon: Mail, badge: 'inquiries' }
]

function AdminSidebar() {
  const { tab, setTab, badges, mobileNavOpen, setMobileNavOpen } = useAdminShell()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSelect = (id) => {
    setTab(id)
    setMobileNavOpen(false)
  }

  return (
    <>
      <button
        className="admin-nav-toggle"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Toggle admin navigation"
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {mobileNavOpen && (
        <div className="admin-nav-overlay" onClick={() => setMobileNavOpen(false)} />
      )}
      <aside className={`admin-sidebar-new${mobileNavOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-name">SILKEN ATELIER</span>
          <span className="admin-sidebar-badge">ADMIN PORTAL</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const count = item.badge ? badges[item.badge] : 0
            return (
              <button
                key={item.id}
                className={`admin-nav-item${tab === item.id ? ' active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <item.icon size={17} />
                <span className="admin-nav-label">{item.label}</span>
                {count > 0 && <span className="admin-nav-count">{count}</span>}
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
