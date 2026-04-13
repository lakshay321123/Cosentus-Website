'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Meeting {
  id: string; lead_id: string; scheduled_at: string; duration_minutes: number
  type: string; status: string; assigned_to: string; notes: string | null
  lead?: { first_name: string; last_name: string; practice_name: string } | null
}
interface Lead { id: string; first_name: string; last_name: string; practice_name: string }

const typeColors: Record<string, string> = { discovery: '#36C2DE', demo: '#00B5D6', proposal: '#68D1E6', follow_up: '#CCCCCC' }

export default function SchedulePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showBook, setShowBook] = useState(false)
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    Promise.all([
      supabase.from('meetings').select('*, lead:leads(first_name, last_name, practice_name)').order('scheduled_at', { ascending: true }),
      supabase.from('leads').select('id, first_name, last_name, practice_name').order('first_name'),
    ]).then(([mRes, lRes]) => {
      if (mRes.data) setMeetings(mRes.data as Meeting[])
      if (lRes.data) setLeads(lRes.data as Lead[])
      setLoading(false)
    })
  }, [])

  const now = new Date().toISOString()
  const filtered = meetings.filter(m => view === 'upcoming' ? m.scheduled_at >= now : m.scheduled_at < now)

  const handleBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const meeting = { lead_id: fd.get('lead_id') as string, scheduled_at: fd.get('scheduled_at') as string, duration_minutes: parseInt(fd.get('duration') as string) || 30, type: fd.get('type') as string, assigned_to: fd.get('assigned_to') as string, notes: fd.get('notes') as string || null, status: 'scheduled' }
    const { data } = await supabase.from('meetings').insert(meeting).select('*, lead:leads(first_name, last_name, practice_name)')
    if (data) { setMeetings(prev => [...prev, data[0] as Meeting].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))); setShowBook(false) }
    if (meeting.lead_id) await supabase.from('activities').insert({ lead_id: meeting.lead_id, type: 'meeting', description: `${meeting.type} call scheduled` })
  }

  const handleStatus = async (id: string, status: string) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    await supabase.from('meetings').update({ status }).eq('id', id)
  }

  if (loading) return <div style={{ padding: 48, color: '#000000' }}>Loading...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div className="crm-animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="crm-h1">Schedule</h1>
          <p className="crm-subtitle">{filtered.length} {view} meetings</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="crm-segment">
            <button className={view === 'upcoming' ? 'active' : ''} onClick={() => setView('upcoming')}>Upcoming</button>
            <button className={view === 'past' ? 'active' : ''} onClick={() => setView('past')}>Past</button>
          </div>
          <button onClick={() => setShowBook(!showBook)} className="crm-btn crm-btn-primary">+ Book Meeting</button>
        </div>
      </div>

      {showBook && (
        <form onSubmit={handleBook} className="crm-card crm-animate-in" style={{ marginBottom: 20, border: '1px solid rgba(0,181,214,0.2)' }}>
          <h3 className="crm-h2" style={{ marginBottom: 16 }}>New Meeting</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <select name="lead_id" required className="crm-select">
              <option value="">Select Lead...</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.practice_name}</option>)}
            </select>
            <input name="scheduled_at" type="datetime-local" required className="crm-input" />
            <select name="type" className="crm-select">
              <option value="discovery">Discovery Call</option><option value="demo">Demo</option>
              <option value="proposal">Proposal Review</option><option value="follow_up">Follow Up</option>
            </select>
            <select name="duration" className="crm-select">
              <option value="15">15 min</option><option value="30">30 min</option>
              <option value="45">45 min</option><option value="60">60 min</option>
            </select>
            <input name="assigned_to" placeholder="Assigned To" className="crm-input" />
            <input name="notes" placeholder="Notes (optional)" className="crm-input" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="crm-btn crm-btn-primary">Book Meeting</button>
            <button type="button" onClick={() => setShowBook(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="crm-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="1" style={{ marginBottom: 16 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <div style={{ fontSize: 16, color: '#000000', marginBottom: 12 }}>No {view} meetings</div>
          <button onClick={() => setShowBook(true)} className="crm-btn crm-btn-primary">Book your first meeting</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((m, i) => (
            <div key={m.id} className={`crm-card crm-animate-in crm-animate-in-${Math.min(i + 1, 5)}`} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ minWidth: 72, textAlign: 'center', padding: '14px 8px', background: '#D6EBF2', borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#000000' }}>{new Date(m.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#000000', marginTop: 2 }}>{new Date(m.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>{m.lead ? `${m.lead.first_name} ${m.lead.last_name}` : 'Unknown'}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 8, background: `${typeColors[m.type]}18`, color: typeColors[m.type], textTransform: 'capitalize' }}>{m.type.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 13, color: '#000000', marginTop: 4 }}>{m.lead?.practice_name} · {m.duration_minutes} min{m.assigned_to ? ` · ${m.assigned_to}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {m.status === 'scheduled' && view === 'upcoming' && <>
                  <button onClick={() => handleStatus(m.id, 'completed')} className="crm-btn crm-btn-secondary" style={{ padding: '6px 14px', fontSize: 13, color: '#00B5D6' }}>Complete</button>
                  <button onClick={() => handleStatus(m.id, 'no_show')} className="crm-btn crm-btn-secondary" style={{ padding: '6px 14px', fontSize: 13, color: '#68D1E6' }}>No Show</button>
                  <button onClick={() => handleStatus(m.id, 'cancelled')} className="crm-btn crm-btn-secondary" style={{ padding: '6px 14px', fontSize: 13, color: '#000000' }}>Cancel</button>
                </>}
                {m.status !== 'scheduled' && <span className={`crm-badge ${m.status === 'completed' ? 'crm-badge-success' : m.status === 'cancelled' ? 'crm-badge-hot' : 'crm-badge-warm'}`} style={{ textTransform: 'capitalize' }}>{m.status.replace('_', ' ')}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
