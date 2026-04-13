'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Campaign { id: string; name: string; type: string; status: string; budget: number; spent: number; leads_generated: number; deals_influenced: number; revenue_attributed: number; created_at: string }
interface Lead { id: string; first_name: string; last_name: string; email: string | null; practice_name: string | null; specialty: string; temperature: string }

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showBulkEmail, setShowBulkEmail] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [templates, setTemplates] = useState<{id:string;name:string;subject:string;body:string}[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, temperature').not('email', 'is', null).order('first_name'),
    ]).then(([cRes, lRes]) => {
      if (cRes.data) setCampaigns(cRes.data as Campaign[])
      if (lRes.data) setLeads(lRes.data as Lead[])
      setLoading(false)
    })
  }, [])

  const filtered = filterStatus === 'all' ? campaigns : campaigns.filter(c => c.status === filterStatus)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const camp = { name: fd.get('name') as string, type: fd.get('type') as string, status: 'draft', budget: Number(fd.get('budget')) || 0, spent: 0, leads_generated: 0, deals_influenced: 0, revenue_attributed: 0 }
    const { data } = await supabase.from('campaigns').insert(camp).select()
    if (data) { setCampaigns(prev => [data[0] as Campaign, ...prev]); setShowCreate(false) }
    setSaving(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    await supabase.from('campaigns').update({ status }).eq('id', id)
  }

  const toggleLead = (id: string) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll = () => setSelectedLeads(selectedLeads.length === leads.length ? [] : leads.map(l => l.id))

  const openBulkOutlook = () => {
    const recipients = leads.filter(l => selectedLeads.includes(l.id) && l.email).map(l => l.email).join(',')
    if (!recipients) { alert('No leads with email addresses selected'); return }
    const subject = encodeURIComponent(emailSubject || 'From Cosentus')
    const body = encodeURIComponent(emailBody || '')
    window.open(`mailto:${recipients}?subject=${subject}&body=${body}`, '_blank')
  }

  if (loading) return <div style={{ padding: 48, color: '#000' }}>Loading campaigns...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>{campaigns.length} campaigns · Track ROI and attribution</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowBulkEmail(!showBulkEmail)} className="crm-btn crm-btn-secondary">Bulk Email</button>
          <button onClick={() => setShowCreate(!showCreate)} className="crm-btn crm-btn-primary">+ Create Campaign</button>
        </div>
      </div>

      {showBulkEmail && (
        <div className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>Bulk Email via Outlook</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                Select Leads ({selectedLeads.length} of {leads.length})
                <button onClick={selectAll} style={{ marginLeft: 8, fontSize: 11, color: '#00B5D6', background: 'none', border: 'none', cursor: 'pointer' }}>{selectedLeads.length === leads.length ? 'Deselect all' : 'Select all'}</button>
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E6E6E6', borderRadius: 10 }}>
                {leads.map(l => (
                  <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid #E6E6E6', cursor: 'pointer', fontSize: 13, background: selectedLeads.includes(l.id) ? '#D6EBF2' : 'transparent' }}>
                    <input type="checkbox" checked={selectedLeads.includes(l.id)} onChange={() => toggleLead(l.id)} />
                    <span style={{ fontWeight: 500, color: '#000' }}>{l.first_name} {l.last_name}</span>
                    <span style={{ color: '#000', fontSize: 12 }}>{l.email}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, padding: '1px 6px', borderRadius: 4, background: l.temperature === 'hot' ? '#00B5D6' : l.temperature === 'warm' ? '#68D1E6' : '#E6E6E6', color: l.temperature === 'hot' || l.temperature === 'warm' ? '#fff' : '#000' }}>{l.temperature}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Compose Email</div>
              <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Subject line" className="crm-input" style={{ marginBottom: 8 }} />
              <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Email body (plain text for Outlook)" rows={8}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", boxSizing: 'border-box', resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={openBulkOutlook} disabled={selectedLeads.length === 0} className="crm-btn crm-btn-primary" style={{ opacity: selectedLeads.length === 0 ? 0.5 : 1 }}>
                  Open in Outlook ({selectedLeads.length} recipients)
                </button>
                <button onClick={() => setShowBulkEmail(false)} className="crm-btn crm-btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="crm-segment" style={{ marginBottom: 20 }}>
        {['all', 'draft', 'active', 'completed'].map(f => (
          <button key={f} className={filterStatus === f ? 'active' : ''} onClick={() => setFilterStatus(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <input name="name" placeholder="Campaign name *" required className="crm-input" />
            <select name="type" className="crm-select">
              <option value="email">Email</option><option value="event">Event</option><option value="content">Content</option>
              <option value="ad">Advertising</option><option value="referral">Referral</option>
            </select>
            <input name="budget" placeholder="Budget ($)" type="number" className="crm-input" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={saving} className="crm-btn crm-btn-primary">{saving ? 'Creating...' : 'Create Campaign'}</button>
            <button type="button" onClick={() => setShowCreate(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="crm-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No campaigns yet</div>
          <button onClick={() => setShowCreate(true)} className="crm-btn crm-btn-primary">Create your first campaign</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map(c => (
            <div key={c.id} className="crm-card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>{c.type} · Created {new Date(c.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>${c.budget?.toLocaleString() || 0}</div>
                <div style={{ fontSize: 11, color: '#000' }}>Budget</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>{c.leads_generated}</div>
                <div style={{ fontSize: 11, color: '#000' }}>Leads</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>{c.deals_influenced}</div>
                <div style={{ fontSize: 11, color: '#000' }}>Deals</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>${c.revenue_attributed?.toLocaleString() || 0}</div>
                <div style={{ fontSize: 11, color: '#000' }}>Revenue</div>
              </div>
              <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: c.status === 'active' ? '#00B5D6' : c.status === 'completed' ? '#68D1E6' : '#E6E6E6', color: c.status === 'draft' ? '#000' : '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                {['draft', 'active', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
