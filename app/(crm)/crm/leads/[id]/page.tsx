'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, Lead } from '@/lib/supabase'

interface Activity { id: string; created_at: string; type: string; description: string }
interface Meeting { id: string; scheduled_at: string; type: string; status: string; duration_minutes: number; assigned_to: string }

const statusFlow: string[] = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
const sourceLabels: Record<string, string> = { website_chat: 'Website Chat', voice_agent: 'Voice Agent', contact_form: 'Contact Form', referral: 'Referral', linkedin: 'LinkedIn', event: 'Event', email: 'Email', other: 'Other' }

function TempBadge({ temp }: { temp: string }) {
  const c: Record<string, { bg: string; text: string }> = { hot: { bg: '#FAECE7', text: '#993C1D' }, warm: { bg: '#FAEEDA', text: '#854F0B' }, cold: { bg: '#E6F1FB', text: '#185FA5' } }
  const s = c[temp] || c.cold
  return <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 4, background: s.bg, color: s.text, textTransform: 'uppercase' }}>{temp}</span>
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!params.id) return
    Promise.all([
      supabase.from('leads').select('*').eq('id', params.id).single(),
      supabase.from('activities').select('*').eq('lead_id', params.id).order('created_at', { ascending: false }),
      supabase.from('meetings').select('*').eq('lead_id', params.id).order('scheduled_at', { ascending: false }),
    ]).then(([lRes, aRes, mRes]) => {
      if (lRes.data) setLead(lRes.data as Lead)
      if (aRes.data) setActivities(aRes.data as Activity[])
      if (mRes.data) setMeetings(mRes.data as Meeting[])
      setLoading(false)
    })
  }, [params.id])

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return
    setLead({ ...lead, status: newStatus as any })
    await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id)
    const { data } = await supabase.from('activities').insert({ lead_id: lead.id, type: 'status_change', description: `Stage changed to ${newStatus}` }).select()
    if (data) setActivities(prev => [data[0] as Activity, ...prev])
  }

  const handleAddNote = async () => {
    if (!note.trim() || !lead) return
    const { data } = await supabase.from('activities').insert({ lead_id: lead.id, type: 'note', description: note }).select()
    if (data) setActivities(prev => [data[0] as Activity, ...prev])
    setNote('')
  }

  if (loading) return <div style={{ padding: 40, color: '#8E8E93' }}>Loading lead...</div>
  if (!lead) return <div style={{ padding: 40, color: '#8E8E93' }}>Lead not found</div>

  const scoreColor = lead.ai_score >= 80 ? '#00B5D6' : lead.ai_score >= 50 ? '#EF9F27' : '#CCCCCC'

  return (
    <div style={{ padding: '36px 44px', maxWidth: 1200 }}>
      {/* Back */}
      <Link href="/crm/leads" style={{ fontSize: 13, color: '#8E8E93', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Leads
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1C1C1E', margin: 0 }}>{lead.first_name} {lead.last_name}</h1>
          <p style={{ fontSize: 16, color: '#8E8E93', margin: '4px 0 0' }}>{lead.practice_name}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <TempBadge temp={lead.temperature} />
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'rgba(0,0,0,0.03)', color: '#8E8E93', textTransform: 'capitalize' }}>{lead.specialty?.replace('_', ' ')}</span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'rgba(0,0,0,0.03)', color: '#8E8E93' }}>{sourceLabels[lead.source] || lead.source}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: scoreColor, lineHeight: 1 }}>{lead.ai_score}</div>
          <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Score</div>
          <button onClick={async () => {
            const res = await fetch('/api/crm/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead_id: lead.id }) })
            const result = await res.json()
            if (result.score !== undefined) {
              setLead({ ...lead, ai_score: result.score, temperature: result.temperature })
              alert(`Score: ${result.score} (${result.temperature})\n${result.reasoning}\nNext: ${result.next_action}`)
              supabase.from('activities').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false })
                .then(({ data }) => { if (data) setActivities(data as Activity[]) })
            }
          }} style={{ marginTop: 8, fontSize: 11, color: '#00B5D6', background: 'none', border: '1px solid rgba(0,181,214,0.3)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
            Re-score with AI
          </button>
          <button onClick={async () => {
            const res = await fetch('/api/crm/enrich', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead_id: lead.id }) })
            const result = await res.json()
            if (result.success) {
              alert(`Enriched! ${result.updates_applied} fields updated.\n\nPractice type: ${result.enriched.practice_type}\nComplexity: ${result.enriched.billing_complexity}\nGrowth: ${result.enriched.growth_potential}\n\nTalking points:\n${(result.enriched.talking_points || []).map((p: string, i: number) => `${i+1}. ${p}`).join('\n')}`)
              window.location.reload()
            } else { alert('Enrichment failed: ' + (result.error || 'unknown')) }
          }} style={{ marginTop: 4, fontSize: 11, color: '#8E8E93', background: 'none', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>
            Enrich Data
          </button>
        </div>
      </div>

      {/* Pipeline progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {statusFlow.map((s, i) => {
          const isActive = statusFlow.indexOf(lead.status) >= i
          const isCurrent = lead.status === s
          return (
            <button key={s} onClick={() => handleStatusChange(s)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: isActive ? '#00B5D6' : '#F5F5F5', color: isActive ? 'white' : '#CCCCCC',
              fontSize: 12, fontWeight: isCurrent ? 700 : 500, textTransform: 'capitalize',
              outline: isCurrent ? '2px solid #009BB8' : 'none', outlineOffset: 2,
            }}>{s}</button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Contact details */}
        <div>
          <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Contact Details</h3>
            {[
              { label: 'Email', value: lead.email },
              { label: 'Phone', value: lead.phone },
              { label: 'Providers', value: lead.provider_count?.toString() },
              { label: 'Monthly Charges', value: lead.monthly_charges ? `$${Math.round(lead.monthly_charges).toLocaleString()}` : null },
              { label: 'Revenue Potential', value: lead.revenue_potential ? `$${Math.round(lead.revenue_potential).toLocaleString()}/mo` : null },
              { label: 'Assigned To', value: lead.assigned_to },
            ].filter(f => f.value).map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.04)', fontSize: 13 }}>
                <span style={{ color: '#8E8E93' }}>{f.label}</span>
                <span style={{ fontWeight: 500, color: '#1C1C1E' }}>{f.value}</span>
              </div>
            ))}
          </div>

          {lead.notes && (
            <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Notes</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#1C1C1E', margin: 0 }}>{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Activity timeline */}
        <div>
          <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Activity Timeline</h3>

            {/* Add note */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note..." style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, outline: 'none' }} />
              <button onClick={handleAddNote} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>

            {/* Timeline */}
            {activities.length === 0 ? (
              <div style={{ fontSize: 13, color: '#C7C7CC', padding: '20px 0', textAlign: 'center' }}>No activity yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activities.map((a, i) => {
                  const typeIcons: Record<string, string> = { call: '📞', email: '📧', chat: '💬', meeting: '📅', note: '📝', status_change: '🔄', task: '✅' }
                  return (
                    <div key={a.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                      <div style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{typeIcons[a.type] || '📋'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#1C1C1E' }}>{a.description}</div>
                        <div style={{ fontSize: 11, color: '#C7C7CC', marginTop: 4 }}>
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(a.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
