import React, { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import AdminTopbar from '../admin/AdminTopbar'
import './AdminWorkspace.css'

const AdminShellContext = createContext(null)

export function useAdminShell() {
  return useContext(AdminShellContext)
}

function AdminLayout() {
  const [tab, setTab] = useState('dashboard')
  const [badges, setBadges] = useState({ appointments: 0, inquiries: 0 })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <AdminShellContext.Provider value={{ tab, setTab, badges, setBadges, mobileNavOpen, setMobileNavOpen }}>
      <div className="admin-workspace">
        <AdminSidebar />
        <div className="admin-workspace-body">
          <AdminTopbar />
          <main className="admin-workspace-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminShellContext.Provider>
  )
}

export default AdminLayout
