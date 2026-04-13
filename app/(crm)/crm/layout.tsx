'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/crm', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '/crm/pipeline', label: 'Pipeline', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: '/crm/leads', label: 'Leads', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: '/crm/schedule', label: 'Schedule', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/crm/tasks', label: 'Tasks', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { href: '/crm/analytics', label: 'Analytics', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { href: '/crm/settings', label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
]

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Reddit Sans', sans-serif" }}>
      {/* Mobile header */}
      <div className="crm-mobile-header" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'white', borderBottom: '1px solid #E6E6E6', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 24 }} />
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d={mobileOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} className="crm-overlay" />}

      {/* Sidebar */}
      <aside className="crm-sidebar" style={{
        width: 240, background: '#fff', borderRight: '1px solid #E6E6E6',
        padding: '20px 0', display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'fixed', top: 0, left: mobileOpen ? 0 : -240, bottom: 0, zIndex: 100,
        transition: 'left 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #E6E6E6' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 28, width: 'auto' }} />
          </Link>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#00B5D6', marginTop: 8, textTransform: 'uppercase' }}>CRM Platform</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? '#00B5D6' : '#616161',
                background: active ? 'rgba(0,181,214,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                <span style={{ color: active ? '#00B5D6' : '#CCCCCC' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #E6E6E6' }}>
          <button onClick={async () => { await fetch('/api/crm/auth', { method: 'DELETE' }); window.location.href = '/crm/login' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#616161', width: '100%', fontFamily: "'Reddit Sans', sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Logout
          </button>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 8,
            textDecoration: 'none', fontSize: 13, color: '#616161',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="crm-main" style={{ flex: 1, marginLeft: 240, background: '#FAFAFA', minHeight: '100vh' }}>
        {children}
      </main>

      <style>{`
        @media (min-width: 769px) {
          .crm-sidebar { left: 0 !important; }
          .crm-mobile-header { display: none !important; }
          .crm-overlay { display: none !important; }
        }
        @media (max-width: 768px) {
          .crm-mobile-header { display: flex !important; }
          .crm-main { margin-left: 0 !important; padding-top: 56px !important; }
          .crm-main > div { padding: 16px !important; }
        }
      `}</style>
    </div>
  )
}
