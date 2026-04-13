'use client'

import { useState, useMemo } from 'react'

type Specialty = 'Anesthesia' | 'Orthopedics' | 'Pain Mgmt' | 'ASC' | 'Behavioral' | 'Urgent Care'
type Temp = 'hot' | 'warm' | 'cold'
type Status = 'new' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost'

interface Lead {
  id: string; name: string; practice: string; email: string; phone: string
  specialty: Specialty; score: number; temp: Temp; status: Status
  source: string; value: number; created: string; lastActivity: string
}

const allLeads: Lead[] = [
  { id: '1', name: 'Dr. Sarah Chen', practice: 'Bay Area Anesthesia Group', email: 'schen@bayareaanes.com', phone: '(415) 555-0134', specialty: 'Anesthesia', score: 92, temp: 'hot', status: 'discovery', source: 'Website Chat', value: 45000, created: '2026-04-10', lastActivity: '12m ago' },
  { id: '2', name: 'Michael Torres', practice: 'Spine & Pain Institute', email: 'mtorres@spinepain.com', phone: '(949) 555-0187', specialty: 'Pain Mgmt', score: 78, temp: 'warm', status: 'qualified', source: 'Voice Agent', value: 32000, created: '2026-04-09', lastActivity: '1h ago' },
  { id: '3', name: 'Dr. Priya Patel', practice: 'Summit Orthopedics', email: 'ppatel@summitortho.com', phone: '(602) 555-0156', specialty: 'Orthopedics', score: 85, temp: 'hot', status: 'proposal', source: 'Contact Form', value: 58000, created: '2026-04-08', lastActivity: '2h ago' },
  { id: '4', name: 'James Wilson', practice: 'ClearMind Behavioral', email: 'jwilson@clearmind.com', phone: '(512) 555-0198', specialty: 'Behavioral', score: 64, temp: 'warm', status: 'new', source: 'Referral', value: 28000, created: '2026-04-07', lastActivity: '4h ago' },
  { id: '5', name: 'Lisa Rodriguez', practice: 'Pacific Surgery Center', email: 'lrodriguez@pacificasc.com', phone: '(310) 555-0142', specialty: 'ASC', score: 45, temp: 'cold', status: 'new', source: 'LinkedIn', value: 72000, created: '2026-04-06', lastActivity: '1d ago' },
  { id: '6', name: 'Dr. Robert Kim', practice: 'North Valley Ortho', email: 'rkim@nvalleyortho.com', phone: '(818) 555-0167', specialty: 'Orthopedics', score: 88, temp: 'hot', status: 'negotiation', source: 'Website Chat', value: 51000, created: '2026-04-05', lastActivity: '3h ago' },
  { id: '7', name: 'Amanda Foster', practice: 'Sunrise ASC', email: 'afoster@sunriseasc.com', phone: '(714) 555-0123', specialty: 'ASC', score: 71, temp: 'warm', status: 'discovery', source: 'Contact Form', value: 65000, created: '2026-04-04', lastActivity: '6h ago' },
  { id: '8', name: 'Dr. David Lee', practice: 'Metro Anesthesia Partners', email: 'dlee@metroanes.com', phone: '(408) 555-0189', specialty: 'Anesthesia', score: 56, temp: 'warm', status: 'qualified', source: 'Event', value: 38000, created: '2026-04-03', lastActivity: '2d ago' },
  { id: '9', name: 'Karen Brooks', practice: 'Harmony Mental Health', email: 'kbrooks@harmonymh.com', phone: '(972) 555-0145', specialty: 'Behavioral', score: 82, temp: 'hot', status: 'proposal', source: 'Referral', value: 24000, created: '2026-04-02', lastActivity: '5h ago' },
  { id: '10', name: 'Dr. Mark Evans', practice: 'Coastal Pain Clinic', email: 'mevans@coastalpain.com', phone: '(858) 555-0176', specialty: 'Pain Mgmt', score: 91, temp: 'hot', status: 'won', source: 'Voice Agent', value: 41000, created: '2026-03-28', lastActivity: '30m ago' },
  { id: '11', name: 'Dr. Jennifer Wu', practice: 'Premier Anesthesia', email: 'jwu@premieranes.com', phone: '(213) 555-0198', specialty: 'Anesthesia', score: 73, temp: 'warm', status: 'new', source: 'Email', value: 55000, created: '2026-04-11', lastActivity: '8h ago' },
  { id: '12', name: 'Tom Richards', practice: 'Valley Urgent Care', email: 'trichards@valleyuc.com', phone: '(480) 555-0134', specialty: 'Urgent Care', score: 39, temp: 'cold', status: 'new', source: 'LinkedIn', value: 18000, created: '2026-04-12', lastActivity: '3d ago' },
]

function TempBadge({ temp }: { temp: Temp }) {
  const c = { hot: { bg: '#FAECE7', text: '#993C1D' }, warm: { bg: '#FAEEDA', text: '#854F0B' }, cold: { bg: '#E6F1FB', text: '#185FA5' } }[temp]
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{temp}</span>
}

function StatusBadge({ status }: { status: Status }) {
  const c: Record<Status, { bg: string; text: string }> = {
    new: { bg: '#F5F5F5', text: '#616161' }, qualified: { bg: '#E1F5EE', text: '#0F6E56' },
    discovery: { bg: '#E6F1FB', text: '#185FA5' }, proposal: { bg: '#FAEEDA', text: '#854F0B' },
    negotiation: { bg: '#FAECE7', text: '#993C1D' }, won: { bg: '#E1F5EE', text: '#085041' },
    lost: { bg: '#FCEBEB', text: '#791F1F' },
  }
  const s = c[status]
  return <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: s.bg, color: s.text, textTransform: 'capitalize' }}>{status}</span>
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterTemp, setFilterTemp] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'created'>('score')

  const filtered = useMemo(() => {
    let result = allLeads
    if (search) result = result.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.practice.toLowerCase().includes(search.toLowerCase()))
    if (filterSpec !== 'all') result = result.filter(l => l.specialty === filterSpec)
    if (filterTemp !== 'all') result = result.filter(l => l.temp === filterTemp)
    if (filterStatus !== 'all') result = result.filter(l => l.status === filterStatus)
    result = [...result].sort((a, b) => sortBy === 'score' ? b.score - a.score : sortBy === 'value' ? b.value - a.value : b.created.localeCompare(a.created))
    return result
  }, [search, filterSpec, filterTemp, filterStatus, sortBy])

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>Leads</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>{filtered.length} of {allLeads.length} leads</p>
        </div>
        <button style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Reddit Sans', sans-serif" }}>
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", width: 240, outline: 'none' }}
        />
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
          <option value="all">All Specialties</option>
          <option value="Anesthesia">Anesthesia</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pain Mgmt">Pain Management</option>
          <option value="ASC">ASC</option>
          <option value="Behavioral">Behavioral Health</option>
          <option value="Urgent Care">Urgent Care</option>
        </select>
        <select value={filterTemp} onChange={e => setFilterTemp(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
          <option value="all">All Temps</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
          <option value="all">All Stages</option>
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="discovery">Discovery</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
          <option value="score">Sort: AI Score</option>
          <option value="value">Sort: Value</option>
          <option value="created">Sort: Newest</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialty</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Score</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temp</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MRR</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #F5F5F5', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFAFA' }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#000' }}>{lead.name}</div>
                  <div style={{ fontSize: 12, color: '#616161' }}>{lead.practice}</div>
                  <div style={{ fontSize: 11, color: '#CCCCCC' }}>{lead.email}</div>
                </td>
                <td style={{ padding: '14px 16px', color: '#616161' }}>{lead.specialty}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E6E6E6', overflow: 'hidden' }}>
                      <div style={{ width: `${lead.score}%`, height: '100%', background: lead.score >= 80 ? '#00B5D6' : lead.score >= 50 ? '#EF9F27' : '#CCCCCC', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: lead.score >= 80 ? '#00B5D6' : lead.score >= 50 ? '#EF9F27' : '#CCCCCC' }}>{lead.score}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><TempBadge temp={lead.temp} /></td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={lead.status} /></td>
                <td style={{ padding: '14px 16px', color: '#616161' }}>{lead.source}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#000' }}>${(lead.value / 1000).toFixed(0)}K</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#CCCCCC', fontSize: 12 }}>{lead.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
