'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Template { id: string; name: string; subject: string; category: string; html_content?: string; usage_count: number }

const variables = ['{{first_name}}', '{{last_name}}', '{{practice_name}}', '{{specialty}}', '{{phone}}', '{{email}}']

const blockTemplates = [
  { type: 'header', label: 'Header', html: '<div style="background:#00B5D6;padding:24px 32px;text-align:center"><img src="https://cosentus-website.vercel.app/images/cosentus-logo.png" alt="Cosentus" style="height:28px;margin-bottom:8px"><div style="font-size:11px;letter-spacing:0.15em;color:rgba(255,255,255,0.8)">REAL + ARTIFICIAL INTELLIGENCE</div></div>' },
  { type: 'text', label: 'Text Block', html: '<div style="padding:20px 32px;font-size:15px;line-height:1.7;color:#333">Your text here. Use variables like {{first_name}} for personalization.</div>' },
  { type: 'heading', label: 'Heading', html: '<div style="padding:20px 32px 8px"><h2 style="margin:0;font-size:22px;color:#000">Section Heading</h2></div>' },
  { type: 'stats', label: 'Stats Bar', html: '<div style="padding:16px 32px;display:flex;gap:24px;background:#f7f7f7"><div style="text-align:center;flex:1"><div style="font-size:28px;font-weight:700;color:#00B5D6">>98%</div><div style="font-size:12px;color:#666">Net Collection</div></div><div style="text-align:center;flex:1"><div style="font-size:28px;font-weight:700;color:#00B5D6">>99%</div><div style="font-size:12px;color:#666">Clean Claims</div></div><div style="text-align:center;flex:1"><div style="font-size:28px;font-weight:700;color:#00B5D6">30%</div><div style="font-size:12px;color:#666">Revenue Growth</div></div></div>' },
  { type: 'button', label: 'CTA Button', html: '<div style="padding:20px 32px;text-align:center"><a href="https://cosentus.com/book" style="display:inline-block;padding:14px 36px;background:#00B5D6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">Get Your Free Revenue Analysis</a></div>' },
  { type: 'divider', label: 'Divider', html: '<div style="padding:0 32px"><hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0"></div>' },
  { type: 'testimonial', label: 'Testimonial', html: '<div style="padding:20px 32px;background:#f7f7f7;border-left:4px solid #00B5D6;margin:0 32px;border-radius:4px"><div style="font-style:italic;font-size:14px;color:#333;margin-bottom:8px">"Their year-over-year collection rate of 97% has been vital for our group."</div><div style="font-size:13px;color:#666;font-weight:600">— Dr. John B. Field Jr.</div></div>' },
  { type: 'footer', label: 'Footer', html: '<div style="padding:20px 32px;text-align:center;font-size:12px;color:#999;border-top:1px solid #e5e5e5"><div>Cosentus · Irvine, CA · (877) 806-2286 · cosentus.com</div><div style="margin-top:4px">SOC 2 · HIPAA · HBMA · Inc. 5000 · Great Place to Work</div></div>' },
]

export default function EmailsPage() {
  const [tab, setTab] = useState<'branded' | 'custom' | 'designer'>('branded')
  const [templates, setTemplates] = useState<Template[]>([])
  const [customTemplates, setCustomTemplates] = useState<Template[]>([])
  const [selectedTpl, setSelectedTpl] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<string>('')

  // Designer state
  const [blocks, setBlocks] = useState<{id:string;html:string;type:string}[]>([])
  const [designerName, setDesignerName] = useState('')
  const [designerSubject, setDesignerSubject] = useState('')
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('email_templates').select('*').eq('category', 'custom').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, phone').order('first_name'),
    ]).then(([tRes, lRes]) => {
      if (tRes.data) setCustomTemplates(tRes.data as Template[])
      if (lRes.data) setLeads(lRes.data)
      setLoading(false)
    })
  }, [])

  const brandedTemplates: Template[] = [
    { id: 'b1', name: 'Welcome — New Lead', subject: 'Welcome to Cosentus, {{first_name}}', category: 'outreach', usage_count: 0 },
    { id: 'b2', name: 'Follow-up — Value Prop', subject: 'What 98% collection rate looks like', category: 'outreach', usage_count: 0 },
    { id: 'b3', name: 'Follow-up — Case Study', subject: 'How practices like yours grow 30%+', category: 'outreach', usage_count: 0 },
    { id: 'b4', name: 'Meeting Confirmation', subject: 'Your meeting with Cosentus is confirmed', category: 'meetings', usage_count: 0 },
    { id: 'b5', name: 'Breakup Email', subject: 'Should I close your file?', category: 'outreach', usage_count: 0 },
    { id: 'b6', name: 'NPS Survey', subject: 'Quick question — 30 seconds', category: 'feedback', usage_count: 0 },
  ]

  const addBlock = (type: string) => {
    const tpl = blockTemplates.find(b => b.type === type)
    if (tpl) setBlocks([...blocks, { id: `blk-${Date.now()}-${Math.random()}`, html: tpl.html, type }])
  }

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id))
  const moveBlock = (idx: number, dir: -1|1) => {
    const n = idx + dir; if (n < 0 || n >= blocks.length) return
    const a = [...blocks]; [a[idx], a[n]] = [a[n], a[idx]]; setBlocks(a)
  }

  const updateBlockHtml = (id: string, html: string) => setBlocks(blocks.map(b => b.id === id ? { ...b, html } : b))

  const getFullHtml = () => `<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">${blocks.map(b => b.html).join('')}</div>`

  const fillVariables = (html: string) => {
    const lead = leads.find(l => l.id === selectedLead)
    if (!lead) return html
    return html.replace(/\{\{first_name\}\}/g, lead.first_name || '').replace(/\{\{last_name\}\}/g, lead.last_name || '').replace(/\{\{practice_name\}\}/g, lead.practice_name || '').replace(/\{\{specialty\}\}/g, lead.specialty || '').replace(/\{\{phone\}\}/g, lead.phone || '').replace(/\{\{email\}\}/g, lead.email || '')
  }

  const saveTemplate = async () => {
    if (!designerName || blocks.length === 0) { alert('Add a name and at least one block'); return }
    setSaving(true)
    const { data, error } = await supabase.from('email_templates').insert({ name: designerName, subject: designerSubject || designerName, html_content: getFullHtml(), category: 'custom' }).select()
    if (data) { setCustomTemplates(prev => [data[0] as Template, ...prev]); setBlocks([]); setDesignerName(''); setDesignerSubject(''); alert('Template saved!') }
    if (error) alert('Save failed: ' + error.message)
    setSaving(false)
  }

  const openInOutlook = (tpl: Template) => {
    const lead = leads.find(l => l.id === selectedLead)
    if (!lead?.email) { alert('Select a lead with an email address'); return }
    const subject = encodeURIComponent(fillVariables(tpl.subject))
    const body = encodeURIComponent(`Hi ${lead.first_name},\n\nThank you for your interest in Cosentus.\n\n— Cosentus Team\n(877) 806-2286`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Email Templates</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>Design, preview, and send branded emails</p>
        </div>
        <select value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className="crm-select" style={{ width: 240 }}>
          <option value="">Preview with lead...</option>
          {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.email || 'no email'}</option>)}
        </select>
      </div>

      <div className="crm-segment" style={{ marginBottom: 20 }}>
        <button className={tab === 'branded' ? 'active' : ''} onClick={() => setTab('branded')}>Branded (6)</button>
        <button className={tab === 'custom' ? 'active' : ''} onClick={() => setTab('custom')}>Custom ({customTemplates.length})</button>
        <button className={tab === 'designer' ? 'active' : ''} onClick={() => setTab('designer')}>Designer</button>
      </div>

      {tab === 'designer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          {/* Left: blocks + settings */}
          <div>
            <div className="crm-card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Template Info</div>
              <input value={designerName} onChange={e => setDesignerName(e.target.value)} placeholder="Template name *" className="crm-input" style={{ marginBottom: 6 }} />
              <input value={designerSubject} onChange={e => setDesignerSubject(e.target.value)} placeholder="Subject line" className="crm-input" />
            </div>

            <div className="crm-card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Add Blocks</div>
              <div style={{ display: 'grid', gap: 4 }}>
                {blockTemplates.map(b => (
                  <button key={b.type} onClick={() => addBlock(b.type)} style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8, border: '1px solid #E6E6E6', background: '#fff', cursor: 'pointer', textAlign: 'left', color: '#000', fontFamily: "'Reddit Sans', sans-serif" }}>+ {b.label}</button>
                ))}
              </div>
            </div>

            <div className="crm-card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Variables</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {variables.map(v => (
                  <button key={v} onClick={() => navigator.clipboard.writeText(v)} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, border: '1px solid #E6E6E6', background: '#D6EBF2', cursor: 'pointer', color: '#000', fontFamily: 'monospace' }}>{v}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#CCCCCC', marginTop: 6 }}>Click to copy</div>
            </div>

            <button onClick={saveTemplate} disabled={saving || blocks.length === 0} className="crm-btn crm-btn-primary" style={{ width: '100%', opacity: saving || blocks.length === 0 ? 0.5 : 1 }}>
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>

          {/* Right: block list + preview */}
          <div>
            {blocks.length === 0 ? (
              <div className="crm-card" style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#000', marginBottom: 8 }}>Start building your email</div>
                <div style={{ fontSize: 13, color: '#CCCCCC' }}>Add blocks from the left panel</div>
              </div>
            ) : (
              <>
                {/* Block list */}
                <div style={{ marginBottom: 12 }}>
                  {blocks.map((b, idx) => (
                    <div key={b.id} style={{ border: editingBlock === b.id ? '2px solid #00B5D6' : '1px solid #E6E6E6', borderRadius: 10, marginBottom: 6, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: '#f7f7f7' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>{blockTemplates.find(t => t.type === b.type)?.label || b.type}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => setEditingBlock(editingBlock === b.id ? null : b.id)} style={{ fontSize: 11, padding: '2px 8px', border: '1px solid #E6E6E6', borderRadius: 4, background: editingBlock === b.id ? '#00B5D6' : '#fff', color: editingBlock === b.id ? '#fff' : '#000', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => moveBlock(idx, -1)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #E6E6E6', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>↑</button>
                          <button onClick={() => moveBlock(idx, 1)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #E6E6E6', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>↓</button>
                          <button onClick={() => removeBlock(b.id)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #E6E6E6', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#00B5D6' }}>×</button>
                        </div>
                      </div>
                      {editingBlock === b.id && (
                        <textarea value={b.html} onChange={e => updateBlockHtml(b.id, e.target.value)} rows={6}
                          style={{ width: '100%', padding: 12, border: 'none', borderTop: '1px solid #E6E6E6', fontSize: 12, fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Live preview */}
                <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #E6E6E6', fontSize: 12, fontWeight: 600, color: '#000' }}>Live Preview</div>
                  <div style={{ background: '#f0f0f0', padding: 20 }}>
                    <div dangerouslySetInnerHTML={{ __html: fillVariables(getFullHtml()) }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'branded' && (
        <div style={{ display: 'grid', gap: 10 }}>
          {brandedTemplates.map(t => (
            <div key={t.id} className="crm-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: '#000', marginTop: 2 }}>Subject: {fillVariables(t.subject)}</div>
              </div>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: '#D6EBF2', color: '#00B5D6', fontWeight: 600 }}>{t.category}</span>
              <button onClick={() => openInOutlook(t)} className="crm-btn crm-btn-secondary" style={{ fontSize: 12 }}>Open in Outlook</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'custom' && (
        <div>
          {customTemplates.length === 0 ? (
            <div className="crm-card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No custom templates yet</div>
              <button onClick={() => setTab('designer')} className="crm-btn crm-btn-primary">Open Designer</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {customTemplates.map(t => (
                <div key={t.id} className="crm-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: '#000', marginTop: 2 }}>Subject: {t.subject}</div>
                  </div>
                  <button onClick={() => openInOutlook(t)} className="crm-btn crm-btn-secondary" style={{ fontSize: 12 }}>Open in Outlook</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
