'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Sequence {
  id: string; name: string; description: string | null; status: string
  steps: any[]; enrolled_count: number; open_rate: number; reply_rate: number; created_at: string
}

interface LeadOption { id: string; first_name: string; last_name: string; email: string; practice_name: string }

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#F5F5F5', text: '#616161' }, active: { bg: '#E1F5EE', text: '#085041' },
  paused: { bg: '#FAEEDA', text: '#854F0B' }, completed: { bg: '#E6F1FB', text: '#185FA5' },
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Sequence | null>(null)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('email_sequences').select('*').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, first_name, last_name, email, practice_name').not('email', 'is', null).order('first_name'),
    ]).then(([sRes, lRes]) => {
      if (sRes.data) setSequences(sRes.data as Sequence[])
      if (lRes.data) setLeads(lRes.data as LeadOption[])
      setLoading(false)
    })
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const steps = []
    for (let i = 1; i <= 4; i++) {
      const subject = fd.get(`step${i}_subject`) as string
      const body = fd.get(`step${i}_body`) as string
      const delay = fd.get(`step${i}_delay`) as string
      if (subject && body) steps.push({ step: i, subject, body, delay_days: parseInt(delay) || 0 })
    }
    const seq = { name: fd.get('name') as string, description: fd.get('description') as string || null, steps, status: 'draft' }
    const { data } = await supabase.from('email_sequences').insert(seq).select()
    if (data) { setSequences(prev => [data[0] as Sequence, ...prev]); setShowCreate(false) }
  }

  const toggleStatus = async (seq: Sequence) => {
    const newStatus = seq.status === 'active' ? 'paused' : 'active'
    setSequences(prev => prev.map(s => s.id === seq.id ? { ...s, status: newStatus } : s))
    await supabase.from('email_sequences').update({ status: newStatus }).eq('id', seq.id)
  }

  const enrollLead = async (seqId: string, leadId: string) => {
    await supabase.from('sequence_enrollments').insert({ sequence_id: seqId, lead_id: leadId, status: 'active', next_send_at: new Date().toISOString() })
    await supabase.from('email_sequences').update({ enrolled_count: (sequences.find(s => s.id === seqId)?.enrolled_count || 0) + 1 }).eq('id', seqId)
    setSequences(prev => prev.map(s => s.id === seqId ? { ...s, enrolled_count: s.enrolled_count + 1 } : s))
    setEnrolling(null)
    await supabase.from('activities').insert({ lead_id: leadId, type: 'email', description: `Enrolled in sequence: ${sequences.find(s => s.id === seqId)?.name}` })
  }

  const deleteSeq = async (id: string) => {
    if (!confirm('Delete this sequence?')) return
    setSequences(prev => prev.filter(s => s.id !== id))
    await supabase.from('email_sequences').delete().eq('id', id)
  }

  if (loading) return <div style={{ padding: 40, color: '#000000' }}>Loading sequences...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%', boxSizing: 'border-box' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#000000', margin: 0 }}>Email Sequences</h1>
          <p style={{ fontSize: 14, color: '#000000', margin: '4px 0 0' }}>{sequences.length} sequences · Automated multi-step outreach</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Create Sequence</button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,181,214,0.3)', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>New Sequence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <input name="name" placeholder="Sequence name *" required style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />
            <input name="description" placeholder="Description" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#f7f7f7', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6', marginBottom: 8 }}>Step {i} {i === 1 ? '(immediate)' : ''}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8, marginBottom: 8 }}>
                <input name={`step${i}_subject`} placeholder={`Email ${i} subject${i === 1 ? ' *' : ''}`} required={i === 1} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />
                {i > 1 && <input name={`step${i}_delay`} type="number" placeholder="Days" defaultValue={i === 2 ? '3' : i === 3 ? '7' : '14'} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />}
              </div>
              <textarea name={`step${i}_body`} placeholder={`Email ${i} body...`} rows={3} required={i === 1} style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13, resize: 'vertical', fontFamily: "'Reddit Sans', sans-serif" }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create Sequence</button>
            <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#000000', border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', borderRadius: 10, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Sequence list */}
      {sequences.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#000000', marginBottom: 8 }}>No sequences yet</div>
          <button onClick={() => setShowCreate(true)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create your first sequence</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {sequences.map(seq => {
            const sc = statusColors[seq.status] || statusColors.draft
            return (
              <div key={seq.id} style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>{seq.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{seq.status}</span>
                    </div>
                    {seq.description && <div style={{ fontSize: 13, color: '#000000' }}>{seq.description}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleStatus(seq)} style={{ padding: '6px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', background: 'white', fontSize: 12, cursor: 'pointer', color: seq.status === 'active' ? '#854F0B' : '#085041' }}>
                      {seq.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button onClick={() => setEnrolling(enrolling === seq.id ? null : seq.id)} style={{ padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(0,181,214,0.3)', background: 'white', fontSize: 12, cursor: 'pointer', color: '#00B5D6' }}>+ Enroll Lead</button>
                    <button onClick={() => deleteSeq(seq.id)} style={{ padding: '6px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', background: 'white', fontSize: 12, cursor: 'pointer', color: '#E24B4A' }}>Delete</button>
                  </div>
                </div>

                {/* Enroll dropdown */}
                {enrolling === seq.id && (
                  <div style={{ background: '#f7f7f7', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <select onChange={e => { if (e.target.value) enrollLead(seq.id, e.target.value) }} style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13, background: 'white' }}>
                      <option value="">Select a lead to enroll...</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.email}</option>)}
                    </select>
                  </div>
                )}

                {/* Steps preview */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {(seq.steps || []).map((step: any, i: number) => (
                    <div key={i} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: '#f7f7f7', fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: '#00B5D6', marginBottom: 2 }}>Step {i + 1}{step.delay_days > 0 ? ` (+${step.delay_days}d)` : ' (now)'}</div>
                      <div style={{ color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.subject}</div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#000000' }}>
                  <span><strong style={{ color: '#000000' }}>{seq.enrolled_count}</strong> enrolled</span>
                  <span><strong style={{ color: '#000000' }}>{seq.steps?.length || 0}</strong> steps</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
