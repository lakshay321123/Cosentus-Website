'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'

const metrics = [
  { id: 'total_leads', label: 'Total Leads', calc: (leads: Lead[]) => leads.length },
  { id: 'hot_leads', label: 'Hot Leads', calc: (leads: Lead[]) => leads.filter(l => l.temperature === 'hot').length },
  { id: 'pipeline_value', label: 'Pipeline Value ($)', calc: (leads: Lead[]) => leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.revenue_potential || 0), 0) },
  { id: 'won_revenue', label: 'Won Revenue ($)', calc: (leads: Lead[]) => leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.revenue_potential || 0), 0) },
  { id: 'avg_score', label: 'Avg AI Score', calc: (leads: Lead[]) => leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.ai_score, 0) / leads.length) : 0 },
  { id: 'conversion_rate', label: 'Conversion Rate (%)', calc: (leads: Lead[]) => leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0 },
  { id: 'lost_rate', label: 'Lost Rate (%)', calc: (leads: Lead[]) => leads.length > 0 ? Math.round((leads.filter(l => l.status === 'lost').length / leads.length) * 100) : 0 },
]

const dimensions = [
  { id: 'specialty', label: 'By Specialty', group: (l: Lead) => l.specialty?.replace('_', ' ') || 'other' },
  { id: 'source', label: 'By Source', group: (l: Lead) => l.source?.replace('_', ' ') || 'other' },
  { id: 'status', label: 'By Stage', group: (l: Lead) => l.status },
  { id: 'temperature', label: 'By Temperature', group: (l: Lead) => l.temperature },
  { id: 'assigned_to', label: 'By Rep', group: (l: Lead) => l.assigned_to || 'Unassigned' },
]

export default function ReportsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['total_leads', 'pipeline_value', 'conversion_rate'])
  const [selectedDimension, setSelectedDimension] = useState('specialty')
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [filterSource, setFilterSource] = useState('all')

  useEffect(() => {
    supabase.from('leads').select('*').then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  const filtered = leads.filter(l => {
    if (filterSpecialty !== 'all' && l.specialty !== filterSpecialty) return false
    if (filterSource !== 'all' && l.source !== filterSource) return false
    return true
  })

  const dim = dimensions.find(d => d.id === selectedDimension) || dimensions[0]
  const groups: Record<string, Lead[]> = {}
  filtered.forEach(l => {
    const key = dim.group(l)
    if (!groups[key]) groups[key] = []
    groups[key].push(l)
  })

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  const activeMetrics = metrics.filter(m => selectedMetrics.includes(m.id))

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading report data...</div>

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Report Builder</h1>
        <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Build custom reports from your CRM data</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Metrics */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Select Metrics</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {metrics.map(m => (
              <button key={m.id} onClick={() => toggleMetric(m.id)} style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12,
                background: selectedMetrics.includes(m.id) ? '#00B5D6' : '#F5F5F5',
                color: selectedMetrics.includes(m.id) ? 'white' : '#616161',
                fontWeight: selectedMetrics.includes(m.id) ? 600 : 400,
              }}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* Dimension + Filters */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Group By & Filters</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={selectedDimension} onChange={e => setSelectedDimension(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, background: 'white' }}>
              {dimensions.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, background: 'white' }}>
              <option value="all">All Specialties</option>
              <option value="anesthesia">Anesthesia</option><option value="orthopedics">Orthopedics</option>
              <option value="pain_management">Pain Mgmt</option><option value="asc">ASC</option>
              <option value="behavioral_health">Behavioral</option>
            </select>
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, background: 'white' }}>
              <option value="all">All Sources</option>
              <option value="website_chat">Website Chat</option><option value="voice_agent">Voice Agent</option>
              <option value="contact_form">Contact Form</option><option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option><option value="event">Event</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeMetrics.length}, 1fr)`, gap: 12, marginBottom: 24 }}>
        {activeMetrics.map(m => {
          const val = m.calc(filtered)
          const display = m.id.includes('value') || m.id.includes('revenue') ? `$${Math.round(val / 1000)}K` : m.id.includes('rate') ? `${val}%` : val.toString()
          return (
            <div key={m.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 300, color: '#00B5D6', lineHeight: 1 }}>{display}</div>
              <div style={{ fontSize: 11, color: '#616161', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
            </div>
          )
        })}
      </div>

      {/* Report table */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase' }}>{dim.label.replace('By ', '')}</th>
              {activeMetrics.map(m => (
                <th key={m.id} style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase' }}>{m.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groups).sort((a, b) => b[1].length - a[1].length).map(([group, groupLeads]) => (
              <tr key={group} style={{ borderBottom: '1px solid #F5F5F5' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>{group}</td>
                {activeMetrics.map(m => {
                  const val = m.calc(groupLeads)
                  const display = m.id.includes('value') || m.id.includes('revenue') ? `$${Math.round(val / 1000)}K` : m.id.includes('rate') ? `${val}%` : val.toString()
                  return <td key={m.id} style={{ textAlign: 'right', padding: '12px 16px', color: '#000' }}>{display}</td>
                })}
              </tr>
            ))}
            {/* Total row */}
            <tr style={{ borderTop: '2px solid #E6E6E6', background: '#FAFAFA' }}>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: '#000' }}>Total</td>
              {activeMetrics.map(m => {
                const val = m.calc(filtered)
                const display = m.id.includes('value') || m.id.includes('revenue') ? `$${Math.round(val / 1000)}K` : m.id.includes('rate') ? `${val}%` : val.toString()
                return <td key={m.id} style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#00B5D6' }}>{display}</td>
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual bars */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24, marginTop: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: '#616161', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Distribution</h3>
        {Object.entries(groups).sort((a, b) => b[1].length - a[1].length).map(([group, groupLeads]) => {
          const pct = filtered.length > 0 ? Math.round((groupLeads.length / filtered.length) * 100) : 0
          return (
            <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 120, fontSize: 12, color: '#616161', textAlign: 'right', textTransform: 'capitalize' }}>{group}</div>
              <div style={{ flex: 1, height: 24, background: '#F5F5F5', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#00B5D6', borderRadius: 4, minWidth: pct > 0 ? 4 : 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, transition: 'width 0.6s' }}>
                  {pct > 12 && <span style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{groupLeads.length}</span>}
                </div>
              </div>
              {pct <= 12 && <span style={{ fontSize: 12, fontWeight: 600, color: '#616161', minWidth: 24 }}>{groupLeads.length}</span>}
              <span style={{ fontSize: 11, color: '#CCCCCC', minWidth: 32 }}>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
