'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { templateList } from '@/lib/email-templates'

interface LeadOption { id: string; first_name: string; last_name: string; email: string; practice_name: string; specialty: string }

export default function EmailsPage() {
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [activeTemplate, setActiveTemplate] = useState(templateList[0].id)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [selectedLead, setSelectedLead] = useState('')
  const [senderName, setSenderName] = useState('Allen Ranjan')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty').not('email', 'is', null).order('first_name')
      .then(({ data }) => { if (data) setLeads(data as LeadOption[]) })
  }, [])

  useEffect(() => {
    loadPreview()
  }, [activeTemplate, selectedLead, senderName])

  const loadPreview = async () => {
    setLoading(true)
    const res = await fetch('/api/crm/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: activeTemplate, lead_id: selectedLead || null, action: 'preview', sender_name: senderName }),
    })
    const data = await res.json()
    setPreviewHtml(data.html || '')
    setPreviewSubject(data.subject || '')
    setLoading(false)
  }

  const handleSend = async () => {
    if (!selectedLead) { alert('Select a lead to send to'); return }
    const res = await fetch('/api/crm/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: activeTemplate, lead_id: selectedLead, action: 'send', sender_name: senderName }),
    })
    const data = await res.json()
    if (data.success) { setSent(true); setTimeout(() => setSent(false), 3000) }
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(previewHtml)
    alert('HTML copied to clipboard')
  }

  const active = templateList.find(t => t.id === activeTemplate)

  return (
    <div style={{ padding: '32px 40px', maxWidth: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Email Templates</h1>
        <p style={{ fontSize: 14, color: '#000000', margin: '4px 0 0' }}>Branded Cosentus emails with live preview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Left: template list + controls */}
        <div>
          {/* Templates */}
          <div style={{ marginBottom: 16 }}>
            {['outreach', 'meetings', 'feedback'].map(cat => (
              <div key={cat}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#000000', letterSpacing: '0.1em', padding: '12px 0 4px', textTransform: 'uppercase' }}>{cat}</div>
                {templateList.filter(t => t.category === cat).map(t => (
                  <button key={t.id} onClick={() => setActiveTemplate(t.id)} style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    textAlign: 'left', marginBottom: 4,
                    background: activeTemplate === t.id ? 'rgba(0,181,214,0.08)' : 'white',
                    outline: activeTemplate === t.id ? '1px solid #00B5D6' : '1px solid #E6E6E6',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: activeTemplate === t.id ? 600 : 400, color: activeTemplate === t.id ? '#00B5D6' : '#000' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#000000', marginTop: 2 }}>{t.delay}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Send controls */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Send Options</div>
            <select value={selectedLead} onChange={e => setSelectedLead(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, background: 'white', marginBottom: 8 }}>
              <option value="">Preview with sample data</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.email}</option>)}
            </select>
            <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Sender name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, marginBottom: 12, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleSend} disabled={!selectedLead} style={{ flex: 1, background: sent ? '#E1F5EE' : '#00B5D6', color: sent ? '#085041' : 'white', border: 'none', borderRadius: 6, padding: '8px', fontSize: 12, fontWeight: 600, cursor: selectedLead ? 'pointer' : 'not-allowed', opacity: selectedLead ? 1 : 0.5 }}>
                {sent ? '✓ Sent!' : 'Send Email'}
              </button>
              <button onClick={copyHtml} style={{ background: 'white', color: '#000000', border: '1px solid #E6E6E6', borderRadius: 6, padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>Copy HTML</button>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
          {/* Subject bar */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #E6E6E6', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000000', textTransform: 'uppercase' }}>Subject:</span>
            <span style={{ fontSize: 13, color: '#000' }}>{previewSubject}</span>
          </div>
          {/* HTML preview in iframe */}
          <div style={{ height: 700, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#000000' }}>Loading preview...</div>
            ) : (
              <iframe srcDoc={previewHtml} style={{ width: '100%', height: '100%', border: 'none' }} title="Email Preview" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
