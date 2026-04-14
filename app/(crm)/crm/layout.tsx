'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GlobalSearch from '@/components/crm/GlobalSearch'
import NotificationBell from '@/components/crm/NotificationBell'
import '@/styles/crm.css'

const I = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  pipeline: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="18" y="5" width="4" height="16" rx="1"/></svg>,
  leads: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="17" cy="9" r="3"/><path d="M21 21v-1.5a3 3 0 00-3-3"/></svg>,
  forecast: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  schedule: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="1"/></svg>,
  tasks: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  documents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  campaigns: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  sequences: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>,
  templates: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  surveys: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  workflows: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  reports: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  signout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
}

const navSections = [
  { label: '', items: [{ href: '/crm', label: 'Dashboard', icon: I.dashboard }] },
  { label: 'Sales', items: [
    { href: '/crm/pipeline', label: 'Pipeline', icon: I.pipeline },
    { href: '/crm/leads', label: 'Leads', icon: I.leads },
    { href: '/crm/forecast', label: 'Forecast', icon: I.forecast },
    { href: '/crm/schedule', label: 'Schedule', icon: I.schedule },
    { href: '/crm/tasks', label: 'Tasks', icon: I.tasks },
    { href: '/crm/documents', label: 'Documents', icon: I.documents },
  ]},
  { label: 'Marketing', items: [
    { href: '/crm/campaigns', label: 'Campaigns', icon: I.campaigns },
    { href: '/crm/sequences', label: 'Sequences', icon: I.sequences },
    { href: '/crm/emails', label: 'Templates', icon: I.templates },
    { href: '/crm/surveys', label: 'Surveys', icon: I.surveys },
    { href: '/crm/forms', label: 'Forms', icon: I.documents },
  ]},
  { label: 'Automation', items: [{ href: '/crm/workflows', label: 'Workflows', icon: I.workflows }] },
  { label: 'Reporting', items: [
    { href: '/crm/analytics', label: 'Analytics', icon: I.analytics },
    { href: '/crm/reports', label: 'Reports', icon: I.reports },
    { href: '/crm/seo', label: 'SEO', icon: I.analytics },
    { href: '/crm/pages', label: 'Landing Pages', icon: I.documents },
  ]},
]

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  return (
    <div className="crm-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top header — search left, logo RIGHT */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #E6E6E6', background: '#fff', flexShrink: 0, zIndex: 150, position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="crm-hamburger" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <GlobalSearch />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <NotificationBell />
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 26 }} />
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 99, backdropFilter: 'blur(4px)' }} />}

        {/* Sidebar — pure navigation, no logo */}
        <aside className="crm-sidebar" style={{
          width: 200, background: '#fff', borderRight: '1px solid #E6E6E6',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          position: 'fixed', top: 49, left: mobileOpen ? 0 : -200, bottom: 0, zIndex: 100,
          transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)', overflowY: 'auto',
        }}>
          <nav style={{ padding: '6px 8px', flex: 1 }}>
            {navSections.map((section, si) => {
              const isCollapsed = collapsed[section.label]
              return (
                <div key={si}>
                  {section.label ? (
                    <div
                      onClick={() => setCollapsed(prev => ({ ...prev, [section.label]: !prev[section.label] }))}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px 4px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{section.label}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  ) : null}
                  <div style={{ overflow: 'hidden', maxHeight: isCollapsed ? 0 : 400, transition: 'max-height 0.25s ease' }}>
                    {section.items.map(item => {
                      const active = item.href === '/crm' ? pathname === '/crm' : pathname.startsWith(item.href)
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                          className={`crm-sidebar-item ${active ? 'active' : ''}`}>
                          <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#fff' : '#000' }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>
          <div style={{ padding: '8px 8px', borderTop: '1px solid #E6E6E6' }}>
            <Link href="/crm/settings" className={`crm-sidebar-item ${pathname === '/crm/settings' ? 'active' : ''}`}>
              <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pathname === '/crm/settings' ? '#fff' : '#000' }}>{I.settings}</span>
              Settings
            </Link>
            <button onClick={async () => { await fetch('/api/crm/auth', { method: 'DELETE' }); window.location.href = '/crm/login' }}
              className="crm-sidebar-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'Reddit Sans', sans-serif" }}>
              <span style={{ width: 18, display: 'flex', color: '#000' }}>{I.signout}</span> Sign Out
            </button>
            <Link href="/" className="crm-sidebar-item">
              <span style={{ width: 18, display: 'flex', color: '#000' }}>{I.back}</span> Back to Website
            </Link>
          </div>
        </aside>

        <main className="crm-main" style={{ marginLeft: 200, background: '#fff', minHeight: 'calc(100vh - 49px)', overflowX: 'hidden', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        html, body { overflow-x: hidden; }
        @media (min-width: 769px) { .crm-sidebar { left: 0 !important; } .crm-hamburger { display: none !important; } }
        @media (max-width: 768px) { .crm-hamburger { display: block !important; } .crm-main { margin-left: 0 !important; width: 100vw !important; } }
      `}</style>
    </div>
  )
}
