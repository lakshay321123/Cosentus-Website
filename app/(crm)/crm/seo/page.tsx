'use client'

import { useState } from 'react'

interface PageMeta { path: string; title: string; description: string; h1: string; status: 'good' | 'warning' | 'error' }

const sitePages: PageMeta[] = [
  { path: '/', title: 'Cosentus | Think Growth — Specialty RCM & Medical Billing', description: '25 years of specialty RCM expertise, amplified by Real + Artificial Intelligence. Up to 30% revenue growth.', h1: 'Think Growth', status: 'good' },
  { path: '/about', title: '25 Years of Expert-Led Revenue Cycle Management | Cosentus', description: 'Full-service practice growth partner and global healthcare RCM company. Independently owned.', h1: 'About Cosentus', status: 'good' },
  { path: '/cosentus-ai', title: 'R+A: Real + Artificial Intelligence | Cosentus', description: '8 AI voice agents plus specialty-trained human teams. Up to 30% revenue growth in 12 months.', h1: 'Real + Artificial Intelligence', status: 'good' },
  { path: '/specialties/anesthesia', title: 'Purpose Built for Anesthesia | Accreda by Cosentus', description: '23+ years anesthesia-specific RCM. Base units, time-unit accuracy, implant pass-throughs.', h1: 'Beyond Billing. Built for Anesthesia.', status: 'good' },
  { path: '/specialties/orthopedics', title: 'Orthopedic Billing & RCM | Cosentus', description: 'Surgical-grade coding for joint replacements, arthroscopy, spinal surgery, and implant cases.', h1: 'Your Dedicated Orthopedic Revenue Cycle Partner', status: 'good' },
  { path: '/specialties/pain-management', title: 'Pain Management Billing & RCM | Cosentus', description: 'Interventional procedure coding, pre-payment review defense, and payer scrutiny management.', h1: 'Pain Management Revenue', status: 'good' },
  { path: '/specialties/asc', title: 'ASC Billing & RCM | Cosentus', description: 'Facility + professional fee expertise. Case costing, implant billing, contract monitoring.', h1: 'ASC Revenue Cycle', status: 'good' },
  { path: '/specialties/behavioral-health', title: 'Behavioral Health Billing & RCM | Cosentus', description: 'Psychiatry, therapy, IOP/PHP, and telehealth billing. Time-based CPTs and authorization management.', h1: 'Behavioral Health Demand Is Surging', status: 'good' },
  { path: '/services', title: 'Services | Revenue Cycle, Billing, Practice Management | Cosentus', description: 'Four integrated services for specialty healthcare, powered by Real + Artificial Intelligence.', h1: 'Everything Your Practice Needs', status: 'warning' },
  { path: '/services/medical-billing-coding', title: 'Medical Billing & Coding Services | Cosentus', description: 'Expert-led billing across 20+ specialties. AI-powered accuracy and proactive denial prevention.', h1: 'Expert-Led Medical Billing', status: 'good' },
  { path: '/services/practice-management', title: 'Complete Practice Management Services | Cosentus', description: 'Front desk, credentialing, scheduling, and operational consulting.', h1: 'Run a More Profitable Practice', status: 'good' },
  { path: '/services/comprehensive-rcm', title: 'Comprehensive Revenue Cycle Management | Cosentus', description: 'End-to-end RCM from patient registration to final payment. One accountable team.', h1: 'End-to-End Revenue Cycle Management', status: 'warning' },
  { path: '/services/ehr-technology', title: 'EHR Agnostic Technology & Integration | Cosentus', description: 'Works with Epic, Athenahealth, eClinicalWorks, and more. Optional Medcloud platform.', h1: 'EHR Agnostic', status: 'good' },
  { path: '/contact', title: "Let's Talk About Your Revenue | Contact Cosentus", description: 'Get a complimentary Revenue Analysis. We respond within one business day.', h1: "Let's Talk About Your Revenue", status: 'good' },
  { path: '/careers', title: 'Careers | Join the Cosentus Team', description: 'Great Place to Work certified. Build a career that changes healthcare.', h1: 'Build a Career That Changes Healthcare', status: 'warning' },
  { path: '/blog', title: 'Blog | Cosentus', description: 'Insights on RCM, medical billing, practice management, and healthcare technology.', h1: 'Blog', status: 'good' },
  { path: '/case-studies', title: 'Client Results | Real Practices, Real Revenue Growth | Cosentus', description: 'Case studies demonstrating concrete impact of R+A and specialty expertise.', h1: 'Case Studies', status: 'warning' },
]

export default function SEOPage() {
  const [pages, setPages] = useState(sitePages)
  const [editing, setEditing] = useState<string | null>(null)

  const good = pages.filter(p => p.status === 'good').length
  const warnings = pages.filter(p => p.status === 'warning').length

  const updatePage = (path: string, field: keyof PageMeta, value: string) => {
    setPages(prev => prev.map(p => p.path === path ? { ...p, [field]: value } : p))
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>SEO Tools</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>Manage page titles, descriptions, and meta tags</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <div className="crm-stat"><div className="crm-stat-label">Total Pages</div><div className="crm-stat-value">{pages.length}</div></div>
        <div className="crm-stat"><div className="crm-stat-label">Optimized</div><div className="crm-stat-value" style={{ color: '#00B5D6' }}>{good}</div></div>
        <div className="crm-stat"><div className="crm-stat-label">Need Attention</div><div className="crm-stat-value" style={{ color: '#68D1E6' }}>{warnings}</div></div>
      </div>

      <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="crm-table">
          <thead><tr><th>Page</th><th>Title Tag</th><th>Meta Description</th><th>H1</th><th>Status</th></tr></thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.path} onClick={() => setEditing(editing === p.path ? null : p.path)} style={{ cursor: 'pointer' }}>
                <td><div style={{ fontWeight: 500, fontSize: 13 }}>{p.path}</div></td>
                <td>
                  {editing === p.path ? <input value={p.title} onChange={e => updatePage(p.path, 'title', e.target.value)} onClick={e => e.stopPropagation()} className="crm-input" style={{ fontSize: 12 }} /> :
                  <div style={{ fontSize: 12 }}>{p.title.slice(0, 50)}{p.title.length > 50 ? '...' : ''} <span style={{ color: p.title.length > 60 ? '#00B5D6' : '#000', fontSize: 11 }}>({p.title.length})</span></div>}
                </td>
                <td>
                  {editing === p.path ? <input value={p.description} onChange={e => updatePage(p.path, 'description', e.target.value)} onClick={e => e.stopPropagation()} className="crm-input" style={{ fontSize: 12 }} /> :
                  <div style={{ fontSize: 12 }}>{p.description.slice(0, 60)}{p.description.length > 60 ? '...' : ''} <span style={{ color: p.description.length > 160 ? '#00B5D6' : '#000', fontSize: 11 }}>({p.description.length})</span></div>}
                </td>
                <td style={{ fontSize: 12 }}>{p.h1}</td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: p.status === 'good' ? '#00B5D6' : '#68D1E6', color: '#fff' }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="crm-card" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#000', margin: '0 0 12px' }}>SEO Checklist</h3>
        <div style={{ display: 'grid', gap: 6 }}>
          {[
            { label: 'All pages have unique title tags under 60 chars', done: true },
            { label: 'All pages have meta descriptions under 160 chars', done: true },
            { label: 'Every page has one H1 tag', done: true },
            { label: 'Images have alt text', done: false },
            { label: 'Internal linking between service pages', done: false },
            { label: 'Schema markup (Organization, LocalBusiness)', done: false },
            { label: 'XML sitemap generated', done: false },
            { label: 'Canonical URLs set', done: false },
            { label: 'Open Graph tags for social sharing', done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#000' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: item.done ? '#00B5D6' : '#E6E6E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: item.done ? '#fff' : '#000' }}>{item.done ? '✓' : ''}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
