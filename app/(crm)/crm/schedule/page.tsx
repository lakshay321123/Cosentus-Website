'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Meeting {
  id: string; lead_id: string; scheduled_at: string; duration_minutes: number
  type: string; status: string; assigned_to: string; notes: string | null
  lead?: { first_name: string; last_name: string; practice_name: string; specialty: string }
}

interface Lead { id: string; first_name: string; last_name: string; practice_name: string }

const typeColors: Record<string, string> = { discovery: '#36C2DE', demo: '#00B5D6', proposal: '#EF9F27', follow_up: '#CCCCCC' }

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function SchedulePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showBook, setShowBook] = useState(false)
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    Promise.all([
      supabase.from('meetings').select('*, lead:leads(first_name, last_name, practice_name, specialty)').order('scheduled_at', { ascending: true }),
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
    const meeting = {
      lead_id: fd.get('lead_id') as string,
      scheduled_at: fd.get('scheduled_at') as string,
      duration_minutes: parseInt(fd.get('duration') as string) || 30,
      type: fd.get('type') as string,
      assigned_to: fd.get('assigned_to') as string,
      notes: fd.get('notes') as string || null,
      status: 'scheduled',
    }
    const { data } = await supabase.from('meetings').insert(meeting).select('*, lead:leads(first_name, last_name, practice_name, specialty)')
    if (data) {
      setMeetings(prev => [...prev, data[0] as Meeting].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)))
      setShowBook(false)
      // Also log activity
      await supabase.from('activities').insert({ lead_id: meeting.lead_id, type: 'meeting', description: `${meeting.type} call scheduled for ${new Date(meeting.scheduled_at).toLocaleDateString()}` })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    await supabase.from('meetings').update({ status }).eq('id', id)
  }

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading schedule...</div>

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Schedule</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>{filtered.length} {view} meetings</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #E6E6E6' }}>
            {(['upcoming', 'past'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '8px 16px', fontSize: 13, border: 'none', cursor: 'pointer',
                background: view === v ? '#00B5D6' : 'white', color: view === v ? 'white' : '#616161',
                fontWeight: view === v ? 600 : 400, textTransform: 'capitalize',
              }}>{v}</button>
            ))}
          </div>
          <button onClick={() => setShowBook(!showBook)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Book Meeting
          </button>
        </div>
      </div>

      {/* Book meeting form */}
      {showBook && (
        <form onSubmit={handleBook} style={{ background: 'white', borderRadius: 12, border: '1px solid #00B5D6', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Book New Meeting</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <select name="lead_id" required style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, background: 'white' }}>
              <option value="">Select Lead...</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.practice_name}</option>)}
            </select>
            <input name="scheduled_at" type="datetime-local" required style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13 }} />
            <select name="type" style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, background: 'white' }}>
              <option value="discovery">Discovery Call</option>
              <option value="demo">Demo</option>
              <option value="proposal">Proposal Review</option>
              <option value="follow_up">Follow Up</option>
            </select>
            <select name="duration" style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, background: 'white' }}>
              <option value="15">15 min</option>
              <option value="30" selected>30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
            <input name="assigned_to" placeholder="Assigned To" style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13 }} />
            <input name="notes" placeholder="Notes (optional)" style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Book Meeting</button>
            <button type="button" onClick={() => setShowBook(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #E6E6E6', borderRadius: 6, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Meetings list */}
      {filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 16, color: '#616161', marginBottom: 8 }}>No {view} meetings</div>
          <button onClick={() => setShowBook(true)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Book your first meeting</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(m => (
            <div key={m.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, transition: 'border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00B5D6' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6E6E6' }}>
              {/* Date block */}
              <div style={{ minWidth: 80, textAlign: 'center', padding: '12px 8px', background: '#F5F5F5', borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#616161' }}>{formatDate(m.scheduled_at)}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#000', marginTop: 2 }}>{formatTime(m.scheduled_at)}</div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>
                    {m.lead ? `${m.lead.first_name} ${m.lead.last_name}` : 'Unknown'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: typeColors[m.type] || '#CCCCCC', color: 'white', textTransform: 'capitalize' }}>{m.type.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 12, color: '#616161', marginTop: 4 }}>{m.lead?.practice_name} · {m.duration_minutes} min · {m.assigned_to || 'Unassigned'}</div>
                {m.notes && <div style={{ fontSize: 12, color: '#CCCCCC', marginTop: 4 }}>{m.notes}</div>}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', gap: 6 }}>
                {m.status === 'scheduled' && view === 'upcoming' && (
                  <>
                    <button onClick={() => handleStatusChange(m.id, 'completed')} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', background: 'white', fontSize: 12, cursor: 'pointer', color: '#0F6E56' }}>Complete</button>
                    <button onClick={() => handleStatusChange(m.id, 'cancelled')} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', background: 'white', fontSize: 12, cursor: 'pointer', color: '#791F1F' }}>Cancel</button>
                    <button onClick={() => handleStatusChange(m.id, 'no_show')} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', background: 'white', fontSize: 12, cursor: 'pointer', color: '#854F0B' }}>No Show</button>
                  </>
                )}
                {m.status !== 'scheduled' && (
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 4, textTransform: 'capitalize',
                    background: m.status === 'completed' ? '#E1F5EE' : m.status === 'cancelled' ? '#FCEBEB' : '#FAEEDA',
                    color: m.status === 'completed' ? '#085041' : m.status === 'cancelled' ? '#791F1F' : '#854F0B',
                  }}>{m.status.replace('_', ' ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
