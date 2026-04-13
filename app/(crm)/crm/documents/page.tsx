'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Doc { id: string; name: string; type: string; lead_id: string | null; file_url: string | null; file_size: number | null; uploaded_by: string | null; status: string; created_at: string; lead?: { first_name: string; last_name: string } | null }
interface LeadOption { id: string; first_name: string; last_name: string; practice_name: string }

const typeIcons: Record<string, string> = { proposal: '📄', contract: '📋', case_study: '📊', presentation: '📑', invoice: '🧾', other: '📎' }
const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#F5F5F5', text: '#616161' }, sent: { bg: '#E6F1FB', text: '#185FA5' },
  viewed: { bg: '#FAEEDA', text: '#854F0B' }, signed: { bg: '#E1F5EE', text: '#085041' }, expired: { bg: '#FCEBEB', text: '#791F1F' },
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    Promise.all([
      supabase.from('documents').select('*, lead:leads(first_name, last_name)').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, first_name, last_name, practice_name').order('first_name'),
    ]).then(([dRes, lRes]) => {
      if (dRes.data) setDocs(dRes.data as Doc[])
      if (lRes.data) setLeads(lRes.data as LeadOption[])
      setLoading(false)
    })
  }, [])

  const filtered = filterType === 'all' ? docs : docs.filter(d => d.type === filterType)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const doc = {
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      lead_id: fd.get('lead_id') as string || null,
      uploaded_by: fd.get('uploaded_by') as string || null,
      status: 'draft',
    }
    const { data } = await supabase.from('documents').insert(doc).select('*, lead:leads(first_name, last_name)')
    if (data) { setDocs(prev => [data[0] as Doc, ...prev]); setShowAdd(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    await supabase.from('documents').update({ status }).eq('id', id)
  }

  if (loading) return <div style={{ padding: 40, color: '#000000' }}>Loading documents...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#000000', margin: 0 }}>Documents</h1>
          <p style={{ fontSize: 14, color: '#000000', margin: '4px 0 0' }}>{docs.length} documents · Proposals, contracts, case studies</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add Document</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'proposal', 'contract', 'case_study', 'presentation', 'invoice'].map(f => (
          <button key={f} onClick={() => setFilterType(f)} style={{
            padding: '6px 14px', borderRadius: 10, border: 'none', fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
            background: filterType === f ? '#00B5D6' : '#F5F5F5', color: filterType === f ? 'white' : '#616161',
          }}>{f === 'all' ? 'All' : f.replace('_', ' ')}</button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,181,214,0.3)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <input name="name" placeholder="Document name *" required style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />
            <select name="type" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13, background: 'white' }}>
              <option value="proposal">Proposal</option><option value="contract">Contract</option>
              <option value="case_study">Case Study</option><option value="presentation">Presentation</option>
              <option value="invoice">Invoice</option><option value="other">Other</option>
            </select>
            <select name="lead_id" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13, background: 'white' }}>
              <option value="">Link to lead (optional)</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.practice_name}</option>)}
            </select>
            <input name="uploaded_by" placeholder="Uploaded by" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add Document</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: '#000000', border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', borderRadius: 10, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid #E6E6E6', background: '#00B5D6', color: '#fff' }}>
              {['Document', 'Type', 'Lead', 'Status', 'Uploaded By', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#000000', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const sc = statusColors[d.status] || statusColors.draft
              return (
                <tr key={d.id} style={{ borderBottom: '0.5px solid #E6E6E6' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{typeIcons[d.type] || '📎'}</span>
                      <span style={{ fontWeight: 500, color: '#000000' }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#000000', textTransform: 'capitalize' }}>{d.type.replace('_', ' ')}</td>
                  <td style={{ padding: '14px 16px', color: '#00B5D6' }}>{d.lead ? `${d.lead.first_name} ${d.lead.last_name}` : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)}
                      style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 4, background: sc.bg, color: sc.text, border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                      {['draft', 'sent', 'viewed', 'signed', 'expired'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#000000' }}>{d.uploaded_by || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#E6E6E6', fontSize: 12 }}>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
