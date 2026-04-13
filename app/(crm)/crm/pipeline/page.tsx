'use client'

import { useState } from 'react'

type LeadStatus = 'new' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost'

interface PipelineLead {
  id: string
  name: string
  practice: string
  specialty: string
  score: number
  value: number
  temp: 'hot' | 'warm' | 'cold'
  lastActivity: string
  status: LeadStatus
}

const columns: { key: LeadStatus; label: string; color: string }[] = [
  { key: 'new', label: 'New Leads', color: '#CCCCCC' },
  { key: 'qualified', label: 'Qualified', color: '#68D1E6' },
  { key: 'discovery', label: 'Discovery', color: '#36C2DE' },
  { key: 'proposal', label: 'Proposal', color: '#00B5D6' },
  { key: 'negotiation', label: 'Negotiation', color: '#009BB8' },
  { key: 'won', label: 'Won', color: '#00B5D6' },
]

const initialLeads: PipelineLead[] = [
  { id: '1', name: 'Dr. Sarah Chen', practice: 'Bay Area Anesthesia', specialty: 'Anesthesia', score: 92, value: 45000, temp: 'hot', lastActivity: '12m ago', status: 'discovery' },
  { id: '2', name: 'Michael Torres', practice: 'Spine & Pain Institute', specialty: 'Pain Mgmt', score: 78, value: 32000, temp: 'warm', lastActivity: '1h ago', status: 'qualified' },
  { id: '3', name: 'Dr. Priya Patel', practice: 'Summit Orthopedics', specialty: 'Orthopedics', score: 85, value: 58000, temp: 'hot', lastActivity: '2h ago', status: 'proposal' },
  { id: '4', name: 'James Wilson', practice: 'ClearMind Behavioral', specialty: 'Behavioral', score: 64, value: 28000, temp: 'warm', lastActivity: '4h ago', status: 'new' },
  { id: '5', name: 'Lisa Rodriguez', practice: 'Pacific Surgery Center', specialty: 'ASC', score: 45, value: 72000, temp: 'cold', lastActivity: '1d ago', status: 'new' },
  { id: '6', name: 'Dr. Robert Kim', practice: 'North Valley Ortho', specialty: 'Orthopedics', score: 88, value: 51000, temp: 'hot', lastActivity: '3h ago', status: 'negotiation' },
  { id: '7', name: 'Amanda Foster', practice: 'Sunrise ASC', specialty: 'ASC', score: 71, value: 65000, temp: 'warm', lastActivity: '6h ago', status: 'discovery' },
  { id: '8', name: 'Dr. David Lee', practice: 'Metro Anesthesia', specialty: 'Anesthesia', score: 56, value: 38000, temp: 'warm', lastActivity: '2d ago', status: 'qualified' },
  { id: '9', name: 'Karen Brooks', practice: 'Harmony Mental Health', specialty: 'Behavioral', score: 82, value: 24000, temp: 'hot', lastActivity: '5h ago', status: 'proposal' },
  { id: '10', name: 'Dr. Mark Evans', practice: 'Coastal Pain Clinic', specialty: 'Pain Mgmt', score: 91, value: 41000, temp: 'hot', lastActivity: '30m ago', status: 'won' },
]

function TempDot({ temp }: { temp: 'hot' | 'warm' | 'cold' }) {
  const c = temp === 'hot' ? '#D85A30' : temp === 'warm' ? '#EF9F27' : '#85B7EB'
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} title={temp} />
}

export default function PipelinePage() {
  const [leads, setLeads] = useState(initialLeads)
  const [dragging, setDragging] = useState<string | null>(null)

  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (status: LeadStatus) => {
    if (!dragging) return
    setLeads(prev => prev.map(l => l.id === dragging ? { ...l, status } : l))
    setDragging(null)
  }

  const getColumnLeads = (status: LeadStatus) => leads.filter(l => l.status === status)
  const getColumnValue = (status: LeadStatus) => getColumnLeads(status).reduce((sum, l) => sum + l.value, 0)

  return (
    <div style={{ padding: '32px 40px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>Pipeline</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Drag leads between stages</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
            <option>All Specialties</option>
            <option>Anesthesia</option>
            <option>Orthopedics</option>
            <option>Pain Management</option>
            <option>ASC</option>
            <option>Behavioral Health</option>
          </select>
          <select style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", color: '#616161', background: 'white' }}>
            <option>All Temps</option>
            <option>Hot</option>
            <option>Warm</option>
            <option>Cold</option>
          </select>
        </div>
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 12, flex: 1, overflow: 'auto' }}>
        {columns.map(col => {
          const colLeads = getColumnLeads(col.key)
          const colValue = getColumnValue(col.key)
          return (
            <div key={col.key}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.key)}
              style={{ background: '#F5F5F5', borderRadius: 12, padding: '12px', display: 'flex', flexDirection: 'column', minHeight: 200 }}
            >
              {/* Column header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px 12px', borderBottom: `2px solid ${col.color}`, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{col.label}</div>
                  <div style={{ fontSize: 11, color: '#616161', marginTop: 2 }}>{colLeads.length} leads · ${(colValue / 1000).toFixed(0)}K</div>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                  {colLeads.length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
                {colLeads.map(lead => (
                  <div key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    style={{
                      background: 'white', borderRadius: 8, padding: '14px',
                      border: '1px solid #E6E6E6', cursor: 'grab',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      opacity: dragging === lead.id ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{lead.name}</div>
                      <TempDot temp={lead.temp} />
                    </div>
                    <div style={{ fontSize: 12, color: '#616161', marginBottom: 8 }}>{lead.practice}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#616161', background: '#F5F5F5', padding: '2px 6px', borderRadius: 4 }}>{lead.specialty}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6' }}>${(lead.value / 1000).toFixed(0)}K</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F5F5F5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 28, height: 3, borderRadius: 2, background: '#E6E6E6', overflow: 'hidden' }}>
                          <div style={{ width: `${lead.score}%`, height: '100%', background: lead.score >= 80 ? '#00B5D6' : '#EF9F27', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#616161' }}>{lead.score}</span>
                      </div>
                      <span style={{ fontSize: 10, color: '#CCCCCC' }}>{lead.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
