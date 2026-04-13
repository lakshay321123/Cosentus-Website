'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GlobalSearch from '@/components/crm/GlobalSearch'
import '@/styles/crm.css'

const navSections = [
  { label: '', items: [
    { href: '/crm', label: 'Dashboard', icon: '◻️' },
  ]},
  { label: 'Sales', items: [
    { href: '/crm/pipeline', label: 'Pipeline', icon: '◈' },
    { href: '/crm/leads', label: 'Leads', icon: '◉' },
    { href: '/crm/forecast', label: 'Forecast', icon: '◎' },
    { href: '/crm/schedule', label: 'Schedule', icon: '▣' },
    { href: '/crm/tasks', label: 'Tasks', icon: '☐' },
    { href: '/crm/documents', label: 'Documents', icon: '▤' },
  ]},
  { label: 'Marketing', items: [
    { href: '/crm/campaigns', label: 'Campaigns', icon: '◧' },
    { href: '/crm/sequences', label: 'Sequences', icon: '⇶' },
    { href: '/crm/emails', label: 'Templates', icon: '▧' },
    { href: '/crm/surveys', label: 'Surveys', icon: '▨' },
  ]},
  { label: 'Automation', items: [
    { href: '/crm/workflows', label: 'Workflows', icon: '⟳' },
  ]},
  { label: 'Reporting', items: [
    { href: '/crm/analytics', label: 'Analytics', icon: '▥' },
    { href: '/crm/reports', label: 'Reports', icon: '▦' },
  ]},
  { label: '', items: [
    { href: '/crm/settings', label: 'Settings', icon: '⚙' },
  ]},
]

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="crm-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile header */}
      <div className="crm-mobile-header" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 24 }} />
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.5"><path d={mobileOpen ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
      </div>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 99, backdropFilter: 'blur(4px)' }} />}

      {/* Sidebar */}
      <aside className="crm-sidebar" style={{
        width: 240, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderRight: '0.5px solid rgba(0,0,0,0.06)',
        padding: '16px 0', display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'fixed', top: 0, left: mobileOpen ? 0 : -240, bottom: 0, zIndex: 100,
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Logo */}
        <div style={{ padding: '4px 20px 16px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 26, width: 'auto' }} />
          </Link>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#00B5D6', marginTop: 6 }}>CRM</div>
        </div>

        <GlobalSearch />

        {/* Nav */}
        <nav style={{ padding: '4px 10px', flex: 1, overflowY: 'auto' }}>
          {navSections.map((section, si) => (
            <div key={si}>
              {section.label && <div className="crm-sidebar-label">{section.label}</div>}
              {section.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={`crm-sidebar-item ${active ? 'active' : ''}`}>
                    <span style={{ fontSize: 13, width: 18, textAlign: 'center', opacity: active ? 1 : 0.5 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
          <button onClick={async () => { await fetch('/api/crm/auth', { method: 'DELETE' }); window.location.href = '/crm/login' }}
            className="crm-sidebar-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'Reddit Sans', sans-serif" }}>
            <span style={{ fontSize: 13, width: 18, textAlign: 'center', opacity: 0.5 }}>↪</span>
            Sign Out
          </button>
          <Link href="/" className="crm-sidebar-item">
            <span style={{ fontSize: 13, width: 18, textAlign: 'center', opacity: 0.5 }}>←</span>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="crm-main" style={{ flex: 1, marginLeft: 240, background: '#F2F2F7', minHeight: '100vh' }}>
        {children}
      </main>

      <style>{`
        @media (min-width: 769px) {
          .crm-sidebar { left: 0 !important; }
          .crm-mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .crm-mobile-header { display: flex !important; }
          .crm-main { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  )
}
