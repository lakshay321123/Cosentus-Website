'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GlobalSearch from '@/components/crm/GlobalSearch'

const navSections = [
  { label: '', items: [
    { href: '/crm', label: 'Dashboard', icon: '📊' },
  ]},
  { label: 'SALES', items: [
    { href: '/crm/pipeline', label: 'Pipeline', icon: '📈' },
    { href: '/crm/leads', label: 'Leads', icon: '👥' },
    { href: '/crm/forecast', label: 'Forecast', icon: '🎯' },
    { href: '/crm/schedule', label: 'Schedule', icon: '📅' },
    { href: '/crm/tasks', label: 'Tasks', icon: '✅' },
    { href: '/crm/documents', label: 'Documents', icon: '📄' },
  ]},
  { label: 'MARKETING', items: [
    { href: '/crm/campaigns', label: 'Campaigns', icon: '📢' },
    { href: '/crm/sequences', label: 'Sequences', icon: '⚡' },
    { href: '/crm/emails', label: 'Templates', icon: '✉️' },
    { href: '/crm/surveys', label: 'Surveys', icon: '📋' },
  ]},
  { label: 'AUTOMATION', items: [
    { href: '/crm/workflows', label: 'Workflows', icon: '🔄' },
  ]},
  { label: 'REPORTING', items: [
    { href: '/crm/analytics', label: 'Analytics', icon: '📉' },
  ]},
  { label: '', items: [
    { href: '/crm/settings', label: 'Settings', icon: '⚙️' },
  ]},
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

        {/* Search */}
        <GlobalSearch />

        {/* Nav */}
        <nav style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 4 }}>
              {section.label && <div style={{ fontSize: 10, fontWeight: 600, color: '#CCCCCC', letterSpacing: '0.1em', padding: '12px 14px 4px', textTransform: 'uppercase' }}>{section.label}</div>}
              {section.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 14px', borderRadius: 8, marginBottom: 1,
                    textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400,
                    color: active ? '#00B5D6' : '#616161',
                    background: active ? 'rgba(0,181,214,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
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
