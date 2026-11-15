import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ExternalLink, Bell, BellOff, Volume2, VolumeX, CheckCheck, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdminShell } from '../layouts/AdminLayout'
import { playAlertChime, setAlertMuted, isAlertMuted, unlockAlertAudio } from '../../utils/alertSound'

const API_BASE = 'http://localhost:8000'
const POLL_INTERVAL = 5000

const PAGE_TITLES = {
  dashboard: 'Dashboard Overview',
  appointments: 'Appointments',
  services: 'Manage Services',
  staff: 'Staff Management',
  users: 'Registered Users',
  inquiries: 'Contact Inquiries'
}

function timeAgo(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function AdminTopbar() {
  const { tab, setTab, mobileNavOpen, setMobileNavOpen } = useAdminShell()
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(isAlertMuted())
  const [toast, setToast] = useState('')
  const latestIdRef = useRef(null)
  const wrapRef = useRef(null)
  const toastTimer = useRef(null)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  )

  const showToast = useCallback((msg) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 5000)
  }, [])

  const fetchNotifications = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/admin/notifications`, {
        headers: authHeaders()
      })
      if (!res.ok) return
      const data = await res.json()
      const list = data.notifications || []
      const maxId = list.length ? Math.max(...list.map((n) => n.id)) : 0

      if (latestIdRef.current === null) {
        // Initial load — record baseline, never alert for existing items
        latestIdRef.current = maxId
      } else if (maxId > latestIdRef.current) {
        latestIdRef.current = maxId
        playAlertChime()
        showToast('New Appointment Booked!')
      }

      setNotifications(list)
      setUnreadCount(data.unread_count || 0)
    } catch {
      // Network errors are ignored; next poll will retry
    }
  }, [token, authHeaders, showToast])

  // Poll every 5 seconds while admin is logged in
  useEffect(() => {
    if (!token) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [token, fetchNotifications])

  // Unlock AudioContext on first user interaction (browser autoplay policy)
  useEffect(() => {
    const handler = () => unlockAlertAudio()
    window.addEventListener('click', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [])

  // Click-outside-to-close
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setAlertMuted(next)
    if (!next) playAlertChime() // preview the chime when unmuting
  }

  const testSound = () => {
    unlockAlertAudio()
    playAlertChime()
  }

  const markAllRead = async () => {
    if (!token) return
    try {
      await fetch(`${API_BASE}/api/admin/notifications/read-all`, {
        method: 'PUT',
        headers: authHeaders()
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const handleNotificationClick = async (n) => {
    if (!n.is_read && token) {
      try {
        await fetch(`${API_BASE}/api/admin/notifications/${n.id}/read`, {
          method: 'PUT',
          headers: authHeaders()
        })
      } catch {
        // ignore
      }
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    }
    setOpen(false)
    setTab('appointments')
  }

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
          <span className="admin-topbar-live-text">View Live Website</span> <ExternalLink size={13} />
        </a>

        <div className="admin-notif" ref={wrapRef}>
          <button
            className="admin-notif-bell"
            onClick={() => setOpen((o) => !o)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className={`admin-notif-badge${toast ? ' pulse' : ''}`}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="admin-notif-dropdown">
              <div className="admin-notif-header">
                <span className="admin-notif-title">Notifications</span>
                <div className="admin-notif-header-actions">
                  <button
                    className="admin-notif-icon-btn"
                    onClick={toggleMute}
                    title={muted ? 'Unmute alerts' : 'Mute alerts'}
                    aria-label={muted ? 'Unmute alerts' : 'Mute alerts'}
                  >
                    {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <button
                    className="admin-notif-markall admin-notif-test"
                    onClick={testSound}
                    title="Test sound"
                  >
                    Test Sound
                  </button>
                  <button
                    className="admin-notif-markall"
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    title="Mark all as read"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                </div>
              </div>

              <div className="admin-notif-list">
                {notifications.length === 0 ? (
                  <div className="admin-notif-empty">
                    <BellOff size={26} />
                    <span>No new notifications</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      className={`admin-notif-item${n.is_read ? '' : ' unread'}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <span className={`admin-notif-dot${n.is_read ? ' read' : ''}`} />
                      <span className="admin-notif-item-body">
                        <span className="admin-notif-item-title">{n.title}</span>
                        <span className="admin-notif-item-msg">{n.message}</span>
                        <span className="admin-notif-item-time">{timeAgo(n.created_at)}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {toast && (
          <div className="admin-notif-toast">
            <Bell size={15} />
            <span>{toast}</span>
            <button onClick={() => setToast('')} aria-label="Dismiss">
              <X size={13} />
            </button>
          </div>
        )}

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
