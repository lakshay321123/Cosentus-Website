'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'

type LeadStatus = 'new' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won'

const columns: { key: LeadStatus; label: string; color: string }[] = [
  { key: 'new', label: 'New Leads', color: '#CCCCCC' },
  { key: 'qualified', label: 'Qualified', color: '#68D1E6' },
  { key: 'discovery', label: 'Discovery', color: '#36C2DE' },
  { key: 'proposal', label: 'Proposal', color: '#00B5D6' },
  { key: 'negotiation', label: 'Negotiation', color: '#009BB8' },
  { key: 'won', label: 'Won', color: '#00B5D6' },
]

function TempDot({ temp }: { temp: string }) {
  const c = temp === 'hot' ? '#D85A30' : temp === 'warm' ? '#EF9F27' : '#85B7EB'
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} title={temp} />
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterTemp, setFilterTemp] = useState('all')

  useEffect(() => {
    supabase.from('leads').select('*').not('status', 'eq', 'lost').order('ai_score', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = async (status: LeadStatus) => {
    if (!dragging) return
    setLeads(prev => prev.map(l => l.id === dragging ? { ...l, status } : l))
    setDragging(null)
    await supabase.from('leads').update({ status }).eq('id', dragging)
  }

  const filtered = leads.filter(l => {
    if (filterSpec !== 'all' && l.specialty !== filterSpec) return false
    if (filterTemp !== 'all' && l.temperature !== filterTemp) return false
    return true
  })

  const getColumnLeads = (status: LeadStatus) => filtered.filter(l => l.status === status)
  const getColumnValue = (status: LeadStatus) => getColumnLeads(status).reduce((sum, l) => sum + (l.revenue_potential || 0), 0)

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading pipeline...</div>

  return (
    <div style={{ padding: '32px 40px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Pipeline</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Drag leads between stages — saves to database instantly</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
            <option value="all">All Specialties</option>
            <option value="anesthesia">Anesthesia</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pain_management">Pain Management</option>
            <option value="asc">ASC</option>
            <option value="behavioral_health">Behavioral Health</option>
          </select>
          <select value={filterTemp} onChange={e => setFilterTemp(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
            <option value="all">All Temps</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 12, flex: 1, overflow: 'auto' }}>
        {columns.map(col => {
          const colLeads = getColumnLeads(col.key)
          const colValue = getColumnValue(col.key)
          return (
            <div key={col.key} onDragOver={handleDragOver} onDrop={() => handleDrop(col.key)}
              style={{ background: '#F5F5F5', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px 12px', borderBottom: `2px solid ${col.color}`, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{col.label}</div>
                  <div style={{ fontSize: 11, color: '#616161', marginTop: 2 }}>{colLeads.length} · ${Math.round(colValue / 1000)}K</div>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{colLeads.length}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
                {colLeads.map(lead => (
                  <div key={lead.id} draggable onDragStart={() => handleDragStart(lead.id)}
                    style={{ background: 'white', borderRadius: 8, padding: 14, border: '1px solid #E6E6E6', cursor: 'grab', opacity: dragging === lead.id ? 0.5 : 1, transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{lead.first_name} {lead.last_name}</div>
                      <TempDot temp={lead.temperature} />
                    </div>
                    <div style={{ fontSize: 12, color: '#616161', marginBottom: 8 }}>{lead.practice_name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#616161', background: '#F5F5F5', padding: '2px 6px', borderRadius: 4 }}>{lead.specialty?.replace('_', ' ')}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6' }}>${lead.revenue_potential ? Math.round(lead.revenue_potential / 1000) + 'K' : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F5F5F5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 28, height: 3, borderRadius: 2, background: '#E6E6E6', overflow: 'hidden' }}>
                          <div style={{ width: `${lead.ai_score}%`, height: '100%', background: lead.ai_score >= 80 ? '#00B5D6' : '#EF9F27', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#616161' }}>{lead.ai_score}</span>
                      </div>
                      {lead.assigned_to && <span style={{ fontSize: 10, color: '#CCCCCC' }}>{lead.assigned_to}</span>}
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
