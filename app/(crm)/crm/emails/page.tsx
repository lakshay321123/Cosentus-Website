'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// Dynamically import Unlayer to avoid SSR issues
const EmailEditor = dynamic(() => import('react-email-editor').then(mod => mod.default || mod), { ssr: false, loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCCCCC' }}>Loading editor...</div> })

interface SavedTemplate { id: string; name: string; subject: string; html_content: string; design_json?: string; category: string; created_at: string }

export default function EmailsPage() {
  const [tab, setTab] = useState<'builder' | 'saved'>('builder')
  const [saved, setSaved] = useState<SavedTemplate[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [templateName, setTemplateName] = useState('')
  const [templateSubject, setTemplateSubject] = useState('')
  const [saving, setSaving] = useState(false)
  const [previewLead, setPreviewLead] = useState('')
  const [editorReady, setEditorReady] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const emailEditorRef = useRef<any>(null)

  useEffect(() => {
    supabase.from('email_templates').select('*').eq('category', 'custom').order('created_at', { ascending: false }).then(({ data }) => { if (data) setSaved(data as SavedTemplate[]) })
    supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, phone').order('first_name').then(({ data }) => { if (data) setLeads(data) })
  }, [])

  const onReady = useCallback(() => {
    setEditorReady(true)
    const editor = emailEditorRef.current?.editor
    if (!editor) return

    // Load default Cosentus template
    editor.loadDesign({
      body: {
        id: 'root',
        rows: [
          // Header with logo
          { id: 'row-header', cells: [1], columns: [{ id: 'col-header', contents: [{ id: 'content-logo', type: 'image', values: { src: { url: 'https://cosentus-website.vercel.app/images/cosentus-logo.png', width: 160, height: 40 }, alt: 'Cosentus', action: { name: 'web', values: { href: 'https://cosentus.com' } }, textAlign: 'center', containerPadding: '20px 30px 5px' } }] }], values: { backgroundColor: '#00B5D6', padding: '0px' } },
          // Tagline
          { id: 'row-tagline', cells: [1], columns: [{ id: 'col-tagline', contents: [{ id: 'content-tagline', type: 'text', values: { text: '<p style="text-align:center;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.8)">REAL + ARTIFICIAL INTELLIGENCE</p>', containerPadding: '0px 30px 20px' } }] }], values: { backgroundColor: '#00B5D6', padding: '0px' } },
          // Body text
          { id: 'row-body', cells: [1], columns: [{ id: 'col-body', contents: [{ id: 'content-body', type: 'text', values: { text: '<p style="font-size:15px;line-height:1.7;color:#333333">Hi {{first_name}},</p><p style="font-size:15px;line-height:1.7;color:#333333">Click here to edit this text. Use the AI Write button above to generate content, or type your own message.</p><p style="font-size:15px;line-height:1.7;color:#333333">We help specialty practices like yours achieve up to 30% revenue growth with our Real + Artificial Intelligence approach.</p>', containerPadding: '30px 40px 10px' } }] }], values: { padding: '0px' } },
          // Stats bar
          { id: 'row-stats', cells: [3], columns: [
            { id: 'col-stat1', contents: [{ id: 'stat1', type: 'text', values: { text: '<p style="text-align:center"><span style="font-size:28px;font-weight:bold;color:#00B5D6">&gt;98%</span></p><p style="text-align:center;font-size:12px;color:#666666">Net Collection</p>', containerPadding: '15px' } }] },
            { id: 'col-stat2', contents: [{ id: 'stat2', type: 'text', values: { text: '<p style="text-align:center"><span style="font-size:28px;font-weight:bold;color:#00B5D6">&gt;99%</span></p><p style="text-align:center;font-size:12px;color:#666666">Clean Claims</p>', containerPadding: '15px' } }] },
            { id: 'col-stat3', contents: [{ id: 'stat3', type: 'text', values: { text: '<p style="text-align:center"><span style="font-size:28px;font-weight:bold;color:#00B5D6">30%</span></p><p style="text-align:center;font-size:12px;color:#666666">Revenue Growth</p>', containerPadding: '15px' } }] },
          ], values: { backgroundColor: '#f7f7f7', padding: '0px' } },
          // CTA Button
          { id: 'row-cta', cells: [1], columns: [{ id: 'col-cta', contents: [{ id: 'content-cta', type: 'button', values: { text: 'Get Your Free Revenue Analysis', href: 'https://cosentus.com/book', backgroundColor: '#00B5D6', color: '#ffffff', borderRadius: '8px', fontSize: '16px', padding: '14px 36px', textAlign: 'center', containerPadding: '20px 40px 30px' } }] }], values: { padding: '0px' } },
          // Footer
          { id: 'row-footer', cells: [1], columns: [{ id: 'col-footer', contents: [{ id: 'content-footer', type: 'text', values: { text: '<p style="text-align:center;font-size:12px;color:#999999">Cosentus · Irvine, CA · (877) 806-2286 · cosentus.com</p><p style="text-align:center;font-size:11px;color:#cccccc;margin-top:4px">SOC 2 · HIPAA · HBMA · Inc. 5000 · Great Place to Work</p>', containerPadding: '20px 30px' } }] }], values: { borderTopWidth: '1px', borderTopColor: '#e5e5e5', borderTopStyle: 'solid', padding: '0px' } },
        ],
        values: { backgroundColor: '#f0f0f0', fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' }, contentWidth: '600px' },
      },
    })
  }, [])

  const saveTemplate = async () => {
    if (!templateName) { alert('Enter a template name'); return }
    const editor = emailEditorRef.current?.editor
    if (!editor) return

    setSaving(true)
    editor.exportHtml((data: any) => {
      const { design, html } = data

      // Replace variables with lead data if preview lead selected
      let finalHtml = html
      const lead = leads.find((l: any) => l.id === previewLead)
      if (lead) {
        finalHtml = html
          .replace(/\{\{first_name\}\}/g, lead.first_name || '')
          .replace(/\{\{last_name\}\}/g, lead.last_name || '')
          .replace(/\{\{practice_name\}\}/g, lead.practice_name || '')
          .replace(/\{\{specialty\}\}/g, lead.specialty || '')
          .replace(/\{\{email\}\}/g, lead.email || '')
          .replace(/\{\{phone\}\}/g, lead.phone || '')
      }

      supabase.from('email_templates').insert({
        name: templateName,
        subject: templateSubject || templateName,
        html_content: html,
        design_json: JSON.stringify(design),
        category: 'custom',
      }).select().then(({ data: tplData, error }) => {
        if (error) { alert('Save failed: ' + error.message) }
        else if (tplData) { setSaved(prev => [tplData[0] as SavedTemplate, ...prev]); alert('Template saved!') }
        setSaving(false)
      })
    })
  }

  const loadTemplate = (tpl: SavedTemplate) => {
    const editor = emailEditorRef.current?.editor
    if (!editor) return
    if (tpl.design_json) {
      try { editor.loadDesign(JSON.parse(tpl.design_json)) } catch { alert('Could not load template design') }
    }
    setTemplateName(tpl.name)
    setTemplateSubject(tpl.subject)
    setTab('builder')
  }

  const sendViaOutlook = (tpl: SavedTemplate) => {
    const lead = leads.find((l: any) => l.id === previewLead)
    if (!lead?.email) { alert('Select a lead with email first'); return }
    const subject = encodeURIComponent(tpl.subject.replace(/\{\{first_name\}\}/g, lead.first_name || ''))
    const body = encodeURIComponent(`Hi ${lead.first_name},\n\nPlease view this email in HTML format.\n\nBest regards,\nCosentus Team\n(877) 806-2286`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return
    setSaved(prev => prev.filter(t => t.id !== id))
    await supabase.from('email_templates').delete().eq('id', id)
  }

  const aiGenerateSubjectLines = async () => {
    setAiLoading(true)
    try {
      const res = await fetch('/api/crm/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'subject_lines', lead_id: previewLead || undefined, context: { purpose: 'marketing email' } }) })
      const data = await res.json()
      if (data.subject_lines?.length) {
        setTemplateSubject(data.subject_lines[0])
        alert('AI Subject Lines:\n\n' + data.subject_lines.map((s: string, i: number) => `${i+1}. ${s}`).join('\n') + '\n\nFirst one auto-filled.')
      } else { alert(data.error || 'AI generation failed') }
    } catch { alert('AI request failed') }
    setAiLoading(false)
  }

  const S: React.CSSProperties = { fontFamily: "'Reddit Sans', sans-serif" }

  return (
    <div style={{ ...S, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #E6E6E6', background: '#fff', flexShrink: 0, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#000', margin: 0 }}>Email Builder</h1>
          <div className="crm-segment" style={{ margin: 0 }}>
            <button className={tab === 'builder' ? 'active' : ''} onClick={() => setTab('builder')}>Builder</button>
            <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>Saved ({saved.length})</button>
          </div>
        </div>

        {tab === 'builder' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
            <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, width: 150, ...S }} />
            <input value={templateSubject} onChange={e => setTemplateSubject(e.target.value)} placeholder="Subject line" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, width: 180, ...S }} />
            <button onClick={aiGenerateSubjectLines} disabled={aiLoading} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 6, border: '1px solid #00B5D6', background: '#D6EBF2', color: '#00B5D6', cursor: 'pointer', whiteSpace: 'nowrap', ...S }}>{aiLoading ? '...' : '✨ AI Subject'}</button>
            <button onClick={async () => {
              setAiLoading(true)
              try {
                const res = await fetch('/api/crm/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'write_email', lead_id: previewLead || undefined, context: { purpose: 'marketing', tone: 'professional' } }) })
                const data = await res.json()
                if (data.body) {
                  await navigator.clipboard.writeText(data.body)
                  if (data.subject && !templateSubject) setTemplateSubject(data.subject)
                  alert('AI generated email body copied to clipboard!\n\nClick any text block in the editor and paste (Ctrl+V / Cmd+V).\n\n---\n' + data.body)
                } else { alert(data.error || 'AI generation failed') }
              } catch { alert('AI request failed') }
              setAiLoading(false)
            }} disabled={aiLoading} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 6, border: '1px solid #00B5D6', background: '#00B5D6', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', ...S }}>{aiLoading ? '...' : '✨ AI Write Body'}</button>
            <select value={previewLead} onChange={e => setPreviewLead(e.target.value)} style={{ fontSize: 12, padding: '6px 8px', borderRadius: 6, border: '1px solid #E6E6E6', ...S }}>
              <option value="">Preview lead...</option>
              {leads.map((l: any) => <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
            </select>
            <button onClick={saveTemplate} disabled={saving || !templateName} style={{ fontSize: 12, padding: '6px 16px', borderRadius: 6, background: '#00B5D6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: saving || !templateName ? 0.5 : 1, whiteSpace: 'nowrap', ...S }}>{saving ? 'Saving...' : 'Save Template'}</button>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === 'saved' ? (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {saved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No saved templates yet</div>
              <button onClick={() => setTab('builder')} style={{ fontSize: 13, padding: '10px 24px', borderRadius: 8, background: '#00B5D6', color: '#fff', border: 'none', cursor: 'pointer', ...S }}>Open Builder</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {saved.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid #E6E6E6', borderRadius: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#000', fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>Subject: {t.subject} · {new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  {t.design_json && <button onClick={() => loadTemplate(t)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid #00B5D6', background: '#fff', color: '#00B5D6', cursor: 'pointer', ...S }}>Edit</button>}
                  <button onClick={() => sendViaOutlook(t)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: '#00B5D6', color: '#fff', border: 'none', cursor: 'pointer', ...S }}>Send</button>
                  <button onClick={() => deleteTemplate(t.id)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: '1px solid #E6E6E6', background: '#fff', color: '#000', cursor: 'pointer', ...S }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* @ts-ignore */}
          <EmailEditor ref={emailEditorRef} onReady={onReady} minHeight="100%" options={{
            appearance: { theme: 'modern_light' },
            features: { stockImages: { enabled: true, safeSearch: true, defaultSearchTerm: 'healthcare' }, userUploads: { enabled: true } },
            tools: { image: { enabled: true }, button: { enabled: true }, text: { enabled: true }, divider: { enabled: true }, heading: { enabled: true }, html: { enabled: true }, menu: { enabled: true }, social: { enabled: true }, video: { enabled: true }, timer: { enabled: true } },
            customCSS: ['.blockbuilder-branding { display: none !important; }'],
          }} />
        </div>
      )}
    </div>
  )
}
