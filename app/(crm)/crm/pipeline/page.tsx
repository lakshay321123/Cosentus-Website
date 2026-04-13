'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'
import Link from 'next/link'

const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
const stageLabels: Record<string, string> = { new: 'New Leads', qualified: 'Qualified', discovery: 'Discovery', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won' }

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterTemp, setFilterTemp] = useState('all')

  useEffect(() => {
    supabase.from('leads').select('*').not('status', 'eq', 'lost').order('ai_score', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  const filtered = leads.filter(l => {
    if (filterSpec !== 'all' && l.specialty !== filterSpec) return false
    if (filterTemp !== 'all' && l.temperature !== filterTemp) return false
    return true
  })

  const handleDrop = async (stage: string) => {
    if (!dragId) return
    setLeads(prev => prev.map(l => l.id === dragId ? { ...l, status: stage as Lead['status'] } : l))
    await supabase.from('leads').update({ status: stage }).eq('id', dragId)
    await supabase.from('activities').insert({ lead_id: dragId, type: 'status_change', description: `Moved to ${stage}` })
    setDragId(null)
  }

  const tempColor = (t: string) => t === 'hot' ? '#00B5D6' : t === 'warm' ? '#68D1E6' : '#E6E6E6'
  const scoreColor = (s: number) => s >= 80 ? '#00B5D6' : s >= 50 ? '#68D1E6' : '#E6E6E6'

  if (loading) return <div style={{ padding: 48, color: '#000000' }}>Loading pipeline...</div>

  return (
    <div style={{ padding: '32px 24px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000000', margin: 0 }}>Pipeline</h1>
          <p style={{ fontSize: 14, color: '#000000', margin: '4px 0 0' }}>Drag leads between stages</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} className="crm-select" style={{ fontSize: 13 }}>
            <option value="all">All Specialties</option>
            <option value="anesthesia">Anesthesia</option><option value="orthopedics">Orthopedics</option>
            <option value="pain_management">Pain Mgmt</option><option value="asc">ASC</option>
            <option value="behavioral_health">Behavioral</option>
          </select>
          <select value={filterTemp} onChange={e => setFilterTemp(e.target.value)} className="crm-select" style={{ fontSize: 13 }}>
            <option value="all">All Temps</option>
            <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`, gap: 8 }}>
        {stages.map(stage => {
          const stageLeads = filtered.filter(l => l.status === stage)
          const stageVal = stageLeads.reduce((s, l) => s + (l.revenue_potential || 0), 0)
          return (
            <div key={stage}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{stageLabels[stage]}</div>
                  <div style={{ fontSize: 12, color: '#000000', marginTop: 2 }}>{stageLeads.length} · ${Math.round(stageVal / 1000)}K</div>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{stageLeads.length}</div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100, padding: 6, borderRadius: 12, background: '#f5f5f5' }}>
                {stageLeads.map(lead => (
                  <Link href={`/crm/leads/${lead.id}`} key={lead.id} style={{ textDecoration: 'none' }}
                    draggable onDragStart={() => setDragId(lead.id)}>
                    <div style={{
                      background: '#fff', borderRadius: 12, padding: '16px', cursor: 'grab',
                      border: '1px solid #E6E6E6', transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                    >
                      {/* Name + temp dot */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{lead.first_name} {lead.last_name}</div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: tempColor(lead.temperature), flexShrink: 0, marginTop: 4 }} />
                      </div>
                      <div style={{ fontSize: 13, color: '#000000', marginBottom: 10 }}>{lead.practice_name}</div>

                      {/* Specialty + value */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#f7f7f7', color: '#000000' }}>{lead.specialty?.replace('_', ' ')}</span>
                        {lead.revenue_potential && <span style={{ fontSize: 14, fontWeight: 700, color: '#00B5D6' }}>${Math.round(lead.revenue_potential / 1000)}K</span>}
                      </div>

                      {/* Score bar + assigned */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 28, height: 3, borderRadius: 2, background: scoreColor(lead.ai_score) }} />
                          <span style={{ fontSize: 11, color: '#000000' }}>{lead.ai_score}</span>
                        </div>
                        {lead.assigned_to && <span style={{ fontSize: 11, color: '#E6E6E6' }}>{lead.assigned_to}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
