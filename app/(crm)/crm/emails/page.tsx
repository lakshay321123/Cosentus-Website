'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateEmail, templateList } from '@/lib/email-templates'

interface CustomTemplate { id: string; name: string; subject: string; html_content: string; category: string; variables: string[]; used_count: number; created_at: string }
interface LeadOption { id: string; first_name: string; last_name: string; email: string; practice_name: string; specialty: string }

export default function EmailsPage() {
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [tab, setTab] = useState<'branded' | 'custom'>('branded')
  const [activeTemplate, setActiveTemplate] = useState(templateList[0].id)
  const [activeCustom, setActiveCustom] = useState<string>('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [selectedLead, setSelectedLead] = useState('')
  const [senderName, setSenderName] = useState('Allen Ranjan')
  const [showUpload, setShowUpload] = useState(false)
  const [newTpl, setNewTpl] = useState({ name: '', subject: '', html_content: '', category: 'custom' })

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty').not('email', 'is', null).order('first_name'),
      supabase.from('email_templates').select('*').order('created_at', { ascending: false }),
    ]).then(([lRes, tRes]) => {
      if (lRes.data) setLeads(lRes.data as LeadOption[])
      if (tRes.data) { setCustomTemplates(tRes.data as CustomTemplate[]); if (tRes.data.length > 0) setActiveCustom(tRes.data[0].id) }
    })
  }, [])

  useEffect(() => { if (tab === 'branded') loadBrandedPreview() }, [activeTemplate, selectedLead, senderName, tab])
  useEffect(() => { if (tab === 'custom') loadCustomPreview() }, [activeCustom, selectedLead, tab])

  const loadBrandedPreview = async () => {
    const res = await fetch('/api/crm/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ template_id: activeTemplate, lead_id: selectedLead || null, action: 'preview', sender_name: senderName }) })
    const data = await res.json()
    setPreviewHtml(data.html || ''); setPreviewSubject(data.subject || '')
  }

  const loadCustomPreview = () => {
    const tpl = customTemplates.find(t => t.id === activeCustom)
    if (!tpl) return
    let html = tpl.html_content
    let subject = tpl.subject
    const lead = leads.find(l => l.id === selectedLead)
    if (lead) {
      const vars: Record<string, string> = { '{{first_name}}': lead.first_name, '{{last_name}}': lead.last_name, '{{practice_name}}': lead.practice_name, '{{email}}': lead.email, '{{specialty}}': lead.specialty?.replace('_', ' ') || '' }
      Object.entries(vars).forEach(([k, v]) => { html = html.replace(new RegExp(k.replace(/[{}]/g, '\\$&'), 'g'), v); subject = subject.replace(new RegExp(k.replace(/[{}]/g, '\\$&'), 'g'), v) })
    }
    setPreviewHtml(html); setPreviewSubject(subject)
  }

  const handleUploadTemplate = async () => {
    if (!newTpl.name || !newTpl.subject || !newTpl.html_content) return
    const vars = (newTpl.html_content.match(/\{\{[a-z_]+\}\}/g) || []).filter((v, i, a) => a.indexOf(v) === i)
    const { data } = await supabase.from('email_templates').insert({ ...newTpl, variables: vars }).select()
    if (data) { setCustomTemplates(prev => [data[0] as CustomTemplate, ...prev]); setActiveCustom(data[0].id); setShowUpload(false); setNewTpl({ name: '', subject: '', html_content: '', category: 'custom' }) }
  }

  const openInOutlook = () => {
    const lead = leads.find(l => l.id === selectedLead)
    if (!lead?.email) { alert('Select a lead with an email address'); return }
    const subject = encodeURIComponent(previewSubject)
    const body = encodeURIComponent(previewHtml.replace(/<[^>]*>/g, '').substring(0, 2000))
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
    // Log activity
    if (selectedLead) {
      supabase.from('activities').insert({ lead_id: selectedLead, type: 'email', description: `Email opened in Outlook: "${previewSubject}"` })
    }
  }

  const copyHtml = () => { navigator.clipboard.writeText(previewHtml); alert('HTML copied — paste into Outlook HTML editor') }

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Email Templates</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>Branded templates + custom uploads · Opens in Outlook</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="crm-segment">
            <button className={tab === 'branded' ? 'active' : ''} onClick={() => setTab('branded')}>Branded ({templateList.length})</button>
            <button className={tab === 'custom' ? 'active' : ''} onClick={() => setTab('custom')}>Custom ({customTemplates.length})</button>
          </div>
          {tab === 'custom' && <button onClick={() => setShowUpload(!showUpload)} className="crm-btn crm-btn-primary">+ Upload Template</button>}
        </div>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #00B5D6', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>Upload Custom Template</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input value={newTpl.name} onChange={e => setNewTpl({ ...newTpl, name: e.target.value })} placeholder="Template name *" className="crm-input" />
            <input value={newTpl.subject} onChange={e => setNewTpl({ ...newTpl, subject: e.target.value })} placeholder="Email subject *" className="crm-input" />
          </div>
          <textarea value={newTpl.html_content} onChange={e => setNewTpl({ ...newTpl, html_content: e.target.value })} placeholder="Paste HTML content here... Use {{first_name}}, {{practice_name}}, {{specialty}} as variables" rows={8}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: 'monospace', marginBottom: 12, boxSizing: 'border-box', resize: 'vertical' }} />
          <div style={{ fontSize: 12, color: '#000', marginBottom: 12 }}>Supported variables: <code>{'{{first_name}} {{last_name}} {{practice_name}} {{email}} {{specialty}}'}</code></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleUploadTemplate} className="crm-btn crm-btn-primary">Save Template</button>
            <button onClick={() => setShowUpload(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Left: template list + controls */}
        <div>
          {tab === 'branded' ? (
            <div style={{ marginBottom: 16 }}>
              {['outreach', 'meetings', 'feedback'].map(cat => (
                <div key={cat}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#CCCCCC', letterSpacing: '0.08em', padding: '12px 0 4px', textTransform: 'uppercase' }}>{cat}</div>
                  {templateList.filter(t => t.category === cat).map(t => (
                    <button key={t.id} onClick={() => setActiveTemplate(t.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: activeTemplate === t.id ? '1px solid #00B5D6' : '1px solid #E6E6E6', cursor: 'pointer', textAlign: 'left', marginBottom: 4, background: activeTemplate === t.id ? '#D6EBF2' : '#fff' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#000', marginTop: 2 }}>{t.delay}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {customTemplates.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#000', fontSize: 13 }}>No custom templates yet</div>
              ) : customTemplates.map(t => (
                <button key={t.id} onClick={() => setActiveCustom(t.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: activeCustom === t.id ? '1px solid #00B5D6' : '1px solid #E6E6E6', cursor: 'pointer', textAlign: 'left', marginBottom: 4, background: activeCustom === t.id ? '#D6EBF2' : '#fff' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#000', marginTop: 2 }}>{t.category} · used {t.used_count}x</div>
                </button>
              ))}
            </div>
          )}

          {/* Send controls */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E6E6E6', padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#000', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Send via Outlook</div>
            <select value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className="crm-select" style={{ width: '100%', fontSize: 12, marginBottom: 8 }}>
              <option value="">Select lead...</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.email}</option>)}
            </select>
            <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Sender name" className="crm-input" style={{ width: '100%', fontSize: 12, marginBottom: 10, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={openInOutlook} className="crm-btn crm-btn-primary" style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}>Open in Outlook</button>
              <button onClick={copyHtml} className="crm-btn crm-btn-secondary" style={{ fontSize: 12, padding: '8px 12px' }}>Copy HTML</button>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #E6E6E6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>SUBJECT:</span>
            <span style={{ fontSize: 13, color: '#000' }}>{previewSubject}</span>
          </div>
          <div style={{ height: 600 }}>
            {previewHtml ? <iframe srcDoc={previewHtml} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#000' }}>Select a template to preview</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
