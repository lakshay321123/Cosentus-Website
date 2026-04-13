'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase, Lead } from '@/lib/supabase'

function TempBadge({ temp }: { temp: string }) {
  const c: Record<string, { bg: string; text: string }> = { hot: { bg: '#FAECE7', text: '#993C1D' }, warm: { bg: '#FAEEDA', text: '#854F0B' }, cold: { bg: '#E6F1FB', text: '#185FA5' } }
  const s = c[temp] || c.cold
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: s.bg, color: s.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{temp}</span>
}

function StatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string }> = {
    new: { bg: '#F5F5F5', text: '#616161' }, qualified: { bg: '#E1F5EE', text: '#0F6E56' },
    discovery: { bg: '#E6F1FB', text: '#185FA5' }, proposal: { bg: '#FAEEDA', text: '#854F0B' },
    negotiation: { bg: '#FAECE7', text: '#993C1D' }, won: { bg: '#E1F5EE', text: '#085041' },
    lost: { bg: '#FCEBEB', text: '#791F1F' },
  }
  const s = c[status] || c.new
  return <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: s.bg, color: s.text, textTransform: 'capitalize' }}>{status}</span>
}

const sourceLabels: Record<string, string> = {
  website_chat: 'Website Chat', voice_agent: 'Voice Agent', contact_form: 'Contact Form',
  referral: 'Referral', linkedin: 'LinkedIn', event: 'Event', email: 'Email', other: 'Other',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterTemp, setFilterTemp] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'created'>('score')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    supabase.from('leads').select('*').order('ai_score', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    let result = leads
    if (search) result = result.filter(l =>
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (l.practice_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase())
    )
    if (filterSpec !== 'all') result = result.filter(l => l.specialty === filterSpec)
    if (filterTemp !== 'all') result = result.filter(l => l.temperature === filterTemp)
    if (filterStatus !== 'all') result = result.filter(l => l.status === filterStatus)
    result = [...result].sort((a, b) => sortBy === 'score' ? b.ai_score - a.ai_score : sortBy === 'value' ? (b.revenue_potential || 0) - (a.revenue_potential || 0) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [leads, search, filterSpec, filterTemp, filterStatus, sortBy])

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newLead = {
      first_name: fd.get('first_name') as string,
      last_name: fd.get('last_name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      practice_name: fd.get('practice_name') as string,
      specialty: fd.get('specialty') as string || 'other',
      source: 'other' as const,
      ai_score: 50,
      temperature: 'warm' as const,
      status: 'new' as const,
    }
    const { data } = await supabase.from('leads').insert(newLead).select()
    if (data) { setLeads(prev => [data[0] as Lead, ...prev]); setShowAdd(false) }
  }

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading leads...</div>

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Leads</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>{filtered.length} of {leads.length} leads</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + Add Lead
        </button>
      </div>

      {/* Add lead form */}
      {showAdd && (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #00B5D6', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>New Lead</h3>
          <form id="add-lead-form" onSubmit={handleAddLead} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { name: 'first_name', placeholder: 'First Name', required: true },
              { name: 'last_name', placeholder: 'Last Name', required: true },
              { name: 'email', placeholder: 'Email' },
              { name: 'phone', placeholder: 'Phone' },
              { name: 'practice_name', placeholder: 'Practice Name' },
            ].map(f => (
              <input key={f.name} name={f.name} placeholder={f.placeholder} required={f.required}
                style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, outline: 'none' }} />
            ))}
            <select name="specialty" style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
              <option value="anesthesia">Anesthesia</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pain_management">Pain Management</option>
              <option value="asc">ASC</option>
              <option value="behavioral_health">Behavioral Health</option>
              <option value="urgent_care">Urgent Care</option>
              <option value="other">Other</option>
            </select>
          </form>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" form="add-lead-form"
              style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save Lead</button>
            <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #E6E6E6', borderRadius: 6, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, width: 240, outline: 'none' }} />
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
          <option value="all">All Specialties</option>
          <option value="anesthesia">Anesthesia</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="pain_management">Pain Management</option>
          <option value="asc">ASC</option>
          <option value="behavioral_health">Behavioral Health</option>
          <option value="urgent_care">Urgent Care</option>
        </select>
        <select value={filterTemp} onChange={e => setFilterTemp(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
          <option value="all">All Temps</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
          <option value="all">All Stages</option>
          <option value="new">New</option><option value="qualified">Qualified</option>
          <option value="discovery">Discovery</option><option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option><option value="won">Won</option><option value="lost">Lost</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, color: '#616161', background: 'white' }}>
          <option value="score">Sort: AI Score</option>
          <option value="value">Sort: Value</option>
          <option value="created">Sort: Newest</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
              {['Contact', 'Specialty', 'AI Score', 'Temp', 'Stage', 'Source', 'Assigned', 'MRR'].map(h => (
                <th key={h} style={{ textAlign: h === 'MRR' ? 'right' : 'left', padding: '12px 16px', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #F5F5F5', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFA' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#000' }}>{lead.first_name} {lead.last_name}</div>
                  <div style={{ fontSize: 12, color: '#616161' }}>{lead.practice_name}</div>
                  <div style={{ fontSize: 11, color: '#CCCCCC' }}>{lead.email}</div>
                </td>
                <td style={{ padding: '14px 16px', color: '#616161', textTransform: 'capitalize' }}>{lead.specialty?.replace('_', ' ')}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E6E6E6', overflow: 'hidden' }}>
                      <div style={{ width: `${lead.ai_score}%`, height: '100%', background: lead.ai_score >= 80 ? '#00B5D6' : lead.ai_score >= 50 ? '#EF9F27' : '#CCCCCC', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: lead.ai_score >= 80 ? '#00B5D6' : lead.ai_score >= 50 ? '#EF9F27' : '#CCCCCC' }}>{lead.ai_score}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><TempBadge temp={lead.temperature} /></td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={lead.status} /></td>
                <td style={{ padding: '14px 16px', color: '#616161' }}>{sourceLabels[lead.source] || lead.source}</td>
                <td style={{ padding: '14px 16px', color: '#616161', fontSize: 12 }}>{lead.assigned_to || '—'}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#000' }}>${lead.revenue_potential ? Math.round(lead.revenue_potential / 1000) + 'K' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
