'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type BlockType = 'header' | 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer' | 'stats' | 'testimonial' | 'footer' | 'columns' | 'image_text'

interface Block {
  id: string; type: BlockType
  content: string; content2?: string; content3?: string
  fontSize?: number; fontWeight?: string; fontStyle?: string; fontFamily?: string; color?: string; align?: string
  bgColor?: string; padding?: number; borderRadius?: number
  imgUrl?: string; imgWidth?: number; imgHeight?: number; imgAlt?: string
  btnUrl?: string; btnColor?: string; btnTextColor?: string
  height?: number; dividerColor?: string; linkUrl?: string
  stat1?: string; stat1Label?: string; stat2?: string; stat2Label?: string; stat3?: string; stat3Label?: string
}

const defaultBlocks: Record<BlockType, Partial<Block>> = {
  header: { content: 'REAL + ARTIFICIAL INTELLIGENCE', imgUrl: 'https://cosentus-website.vercel.app/images/cosentus-logo.png', bgColor: '#00B5D6', color: '#ffffff', padding: 24, align: 'center', fontSize: 11 },
  text: { content: 'Write your message here. Click to edit. Use variables like {{first_name}} for personalization.', fontSize: 15, color: '#333333', padding: 20, align: 'left', bgColor: '#ffffff' },
  heading: { content: 'Section Heading', fontSize: 24, fontWeight: 'bold', color: '#000000', padding: 20, align: 'left', bgColor: '#ffffff' },
  image: { imgUrl: '', imgWidth: 100, imgHeight: 200, imgAlt: 'Image', padding: 16, align: 'center', bgColor: '#ffffff' },
  button: { content: 'Get Your Free Revenue Analysis', btnUrl: 'https://cosentus.com/book', btnColor: '#00B5D6', btnTextColor: '#ffffff', fontSize: 15, borderRadius: 8, padding: 20, align: 'center', bgColor: '#ffffff' },
  divider: { dividerColor: '#e5e5e5', padding: 8, bgColor: '#ffffff', height: 1 },
  spacer: { height: 32, bgColor: '#ffffff' },
  stats: { stat1: '>98%', stat1Label: 'Net Collection', stat2: '>99%', stat2Label: 'Clean Claims', stat3: '30%', stat3Label: 'Revenue Growth', bgColor: '#f7f7f7', padding: 16 },
  testimonial: { content: 'Their year-over-year collection rate of 97% has been vital for our group.', content2: 'Dr. John B. Field Jr.', bgColor: '#f7f7f7', padding: 20, color: '#333333', fontSize: 14 },
  footer: { content: 'Cosentus · Irvine, CA · (877) 806-2286 · cosentus.com', bgColor: '#ffffff', color: '#999999', fontSize: 12, padding: 20, align: 'center' },
  columns: { content: 'Column 1 text', content2: 'Column 2 text', padding: 16, bgColor: '#ffffff', fontSize: 14, color: '#333333', fontFamily: 'Arial' },
  image_text: { content: 'Add your description here. This text appears next to the image.', imgUrl: '', imgWidth: 40, padding: 16, bgColor: '#ffffff', fontSize: 14, color: '#333333', fontFamily: 'Arial', align: 'left' },
}

const blockLabels: Record<BlockType, string> = { header: '🏢 Header', text: '📝 Text', heading: '🔤 Heading', image: '🖼 Image', button: '🔘 Button', divider: '➖ Divider', spacer: '⬜ Spacer', stats: '📊 Stats Bar', testimonial: '💬 Testimonial', footer: '📌 Footer', columns: '▐▌ Two Columns', image_text: '🖼📝 Image + Text' }

const emailFonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Tahoma', 'Trebuchet MS']

const variables = ['{{first_name}}', '{{last_name}}', '{{practice_name}}', '{{specialty}}', '{{phone}}', '{{email}}']

export default function EmailsPage() {
  const [tab, setTab] = useState<'builder' | 'saved'>('builder')
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'b1', type: 'header', ...defaultBlocks.header } as Block,
    { id: 'b2', type: 'text', ...defaultBlocks.text } as Block,
    { id: 'b3', type: 'button', ...defaultBlocks.button } as Block,
    { id: 'b4', type: 'footer', ...defaultBlocks.footer } as Block,
  ])
  const [selected, setSelected] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateSubject, setTemplateSubject] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [previewLead, setPreviewLead] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [history, setHistory] = useState<Block[][]>([])
  const [mobilePreview, setMobilePreview] = useState(false)
  const pushHistory = () => setHistory(prev => [...prev.slice(-19), blocks])

  useEffect(() => {
    supabase.from('email_templates').select('*').eq('category', 'custom').order('created_at', { ascending: false }).then(({ data }) => { if (data) setSaved(data) })
    supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, phone').order('first_name').then(({ data }) => { if (data) setLeads(data) })
  }, [])

  const selectedBlock = blocks.find(b => b.id === selected)

  const addBlock = (type: BlockType) => {
    const b: Block = { id: `blk-${Date.now()}`, type, ...defaultBlocks[type] } as Block
    setBlocks([...blocks, b]); setSelected(b.id)
  }

  const updateBlock = (id: string, updates: Partial<Block>) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b))
  const removeBlock = (id: string) => { pushHistory(); setBlocks(blocks.filter(b => b.id !== id)); if (selected === id) setSelected(null) }
  const moveBlock = (idx: number, dir: -1 | 1) => { pushHistory(); const n = idx + dir; if (n < 0 || n >= blocks.length) return; const a = [...blocks]; [a[idx], a[n]] = [a[n], a[idx]]; setBlocks(a) }
  const duplicateBlock = (b: Block) => { const dup = { ...b, id: `blk-${Date.now()}` }; const idx = blocks.findIndex(x => x.id === b.id); const a = [...blocks]; a.splice(idx + 1, 0, dup); setBlocks(a); setSelected(dup.id) }

  const fillVars = (text: string) => {
    const lead = leads.find(l => l.id === previewLead)
    if (!lead) return text
    return text.replace(/\{\{first_name\}\}/g, lead.first_name || '').replace(/\{\{last_name\}\}/g, lead.last_name || '').replace(/\{\{practice_name\}\}/g, lead.practice_name || '').replace(/\{\{specialty\}\}/g, lead.specialty || '').replace(/\{\{phone\}\}/g, lead.phone || '').replace(/\{\{email\}\}/g, lead.email || '')
  }

  const toHtml = (forPreview = false) => {
    let html = '<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">'
    const resolve = (text: string): string => forPreview ? fillVars(text) : text
    for (const b of blocks) {
      const pad = `padding:${b.padding || 16}px 32px`
      const bg = `background:${b.bgColor || '#fff'}`
      const align = `text-align:${b.align || 'left'}`
      if (b.type === 'header') html += `<div style="${bg};${pad};text-align:${b.align||'center'}"><img src="${b.imgUrl || 'https://cosentus-website.vercel.app/images/cosentus-logo.png'}" alt="Logo" style="height:28px;display:block;margin:0 auto 6px"><div style="font-size:11px;letter-spacing:0.15em;color:rgba(255,255,255,0.8)">${b.content || ''}</div></div>`
      else if (b.type === 'text') { const txt = `<div style="${pad};${bg};${align};font-size:${b.fontSize||15}px;line-height:1.7;color:${b.color||'#333'};font-family:${b.fontFamily||'Arial'},sans-serif;${b.fontWeight === 'bold' ? 'font-weight:bold;' : ''}${b.fontStyle === 'italic' ? 'font-style:italic;' : ''}">${resolve(b.content)}</div>`; const safeUrl = (b.linkUrl || '').startsWith('http') ? b.linkUrl : ''; html += safeUrl ? `<a href="${safeUrl}" style="text-decoration:none;color:inherit">${txt}</a>` : txt }
      else if (b.type === 'heading') { const txt = `<div style="${pad};${bg};${align}"><h2 style="margin:0;font-size:${b.fontSize||24}px;color:${b.color||'#000'};font-weight:${b.fontWeight||'bold'};font-family:${b.fontFamily||'Arial'},sans-serif;${b.fontStyle === 'italic' ? 'font-style:italic;' : ''}">${resolve(b.content)}</h2></div>`; const safeUrl = (b.linkUrl || '').startsWith('http') ? b.linkUrl : ''; html += safeUrl ? `<a href="${safeUrl}" style="text-decoration:none;color:inherit">${txt}</a>` : txt }
      else if (b.type === 'image') html += `<div style="${pad};${bg};text-align:${b.align||'center'}"><img src="${b.imgUrl}" alt="${b.imgAlt||''}" style="width:${b.imgWidth||100}%;max-width:600px;height:auto;border-radius:${b.borderRadius||0}px"></div>`
      else if (b.type === 'button') html += `<div style="${pad};${bg};text-align:${b.align||'center'}"><a href="${b.btnUrl||'#'}" style="display:inline-block;padding:14px 36px;background:${b.btnColor||'#00B5D6'};color:${b.btnTextColor||'#fff'};text-decoration:none;border-radius:${b.borderRadius||8}px;font-weight:600;font-size:${b.fontSize||15}px;font-family:${b.fontFamily||'Arial'},sans-serif">${resolve(b.content)}</a></div>`
      else if (b.type === 'divider') html += `<div style="padding:${b.padding||8}px 32px;${bg}"><hr style="border:none;border-top:${b.height||1}px solid ${b.dividerColor||'#e5e5e5'};margin:0"></div>`
      else if (b.type === 'spacer') html += `<div style="height:${b.height||32}px;${bg}"></div>`
      else if (b.type === 'stats') html += `<table width="100%" cellpadding="0" cellspacing="0" style="${pad};${bg}"><tr>${[{v:b.stat1,l:b.stat1Label},{v:b.stat2,l:b.stat2Label},{v:b.stat3,l:b.stat3Label}].map(s=>`<td style="text-align:center;width:33%"><div style="font-size:28px;font-weight:700;color:#00B5D6">${s.v||''}</div><div style="font-size:12px;color:#666">${s.l||''}</div></td>`).join('')}</tr></table>`
      else if (b.type === 'testimonial') html += `<div style="${pad};${bg};border-left:4px solid #00B5D6;margin:0 32px;border-radius:4px"><div style="font-style:italic;font-size:${b.fontSize||14}px;color:${b.color||'#333'};font-family:${b.fontFamily||'Arial'},sans-serif;margin-bottom:8px">"${resolve(b.content)}"</div><div style="font-size:13px;color:${b.color||'#333'};font-weight:600">— ${b.content2||''}</div></div>`
      else if (b.type === 'footer') html += `<div style="${pad};text-align:center;font-size:${b.fontSize||12}px;color:${b.color||'#999'};font-family:${b.fontFamily||'Arial'},sans-serif;border-top:1px solid #e5e5e5"><div>${resolve(b.content)}</div><div style="margin-top:4px">SOC 2 · HIPAA · HBMA · Inc. 5000 · Great Place to Work</div></div>`
      else if (b.type === 'columns') html += `<table width="100%" cellpadding="0" cellspacing="0" style="${pad};${bg}"><tr><td style="width:50%;vertical-align:top;padding-right:8px;font-size:${b.fontSize||14}px;font-family:${b.fontFamily||'Arial'},sans-serif;color:${b.color||'#333'}">${resolve(b.content)}</td><td style="width:50%;vertical-align:top;padding-left:8px;font-size:${b.fontSize||14}px;font-family:${b.fontFamily||'Arial'},sans-serif;color:${b.color||'#333'}">${resolve(b.content2||'')}</td></tr></table>`
      else if (b.type === 'image_text') html += `<table width="100%" cellpadding="0" cellspacing="0" style="${pad};${bg}"><tr><td style="width:${b.imgWidth||40}%;vertical-align:middle;padding-right:8px"><img src="${b.imgUrl||''}" alt="${b.imgAlt||''}" style="width:100%;border-radius:${b.borderRadius||0}px"></td><td style="vertical-align:middle;font-size:${b.fontSize||14}px;color:${b.color||'#333'};font-family:${b.fontFamily||'Arial'},sans-serif;${b.fontWeight === 'bold' ? 'font-weight:bold;' : ''}${b.fontStyle === 'italic' ? 'font-style:italic;' : ''}">${resolve(b.content)}</td></tr></table>`
    }
    html += '</div>'; return html
  }

  const saveTemplate = async () => {
    if (!templateName) { alert('Enter a template name'); return }
    setSaving(true)
    const { data, error } = await supabase.from('email_templates').insert({ name: templateName, subject: templateSubject || templateName, html_content: toHtml(), design_json: JSON.stringify(blocks), category: 'custom' }).select()
    if (error) { alert('Save failed: ' + error.message); setSaving(false); return }
    if (data) { setSaved(prev => [data[0], ...prev]); alert('Saved!') }
    setSaving(false)
  }

  const loadBlocks = (tpl: any) => {
    if (tpl.design_json) {
      try { setBlocks(JSON.parse(tpl.design_json)); setTemplateName(tpl.name); setTemplateSubject(tpl.subject); setTab('builder'); return } catch {}
    }
    alert('This template has no editable design data')
  }

  const copyHtml = () => { navigator.clipboard.writeText(toHtml()); alert('HTML copied to clipboard!') }

  const undo = () => { if (history.length > 0) { setBlocks(history[history.length - 1]); setHistory(history.slice(0, -1)) } }

  const S: React.CSSProperties = { fontFamily: "'Reddit Sans', sans-serif" }

  return (
    <div style={{ ...S, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #E6E6E6', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#000', margin: 0 }}>Email Builder</h1>
          <div className="crm-segment" style={{ margin: 0 }}>
            <button className={tab === 'builder' ? 'active' : ''} onClick={() => setTab('builder')}>Builder</button>
            <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>Saved ({saved.length})</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={previewLead} onChange={e => setPreviewLead(e.target.value)} style={{ fontSize: 12, padding: '6px 10px', borderRadius: 6, border: '1px solid #E6E6E6', ...S }}>
            <option value="">Preview with lead...</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
          </select>
          <button onClick={() => setShowPreview(!showPreview)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: showPreview ? '#00B5D6' : '#fff', color: showPreview ? '#fff' : '#000', border: '1px solid #E6E6E6', cursor: 'pointer', ...S }}>Preview</button>
          <button onClick={copyHtml} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: '#fff', color: '#000', border: '1px solid #E6E6E6', cursor: 'pointer', ...S }}>Copy HTML</button>
          <button onClick={() => setMobilePreview(!mobilePreview)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: mobilePreview ? '#00B5D6' : '#fff', color: mobilePreview ? '#fff' : '#000', border: '1px solid #E6E6E6', cursor: 'pointer', ...S }}>{mobilePreview ? '📱 Mobile' : '🖥 Desktop'}</button>
          {history.length > 0 && <button onClick={undo} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: '#fff', color: '#000', border: '1px solid #E6E6E6', cursor: 'pointer', ...S }}>↩ Undo</button>}
        </div>
      </div>

      {tab === 'saved' ? (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {saved.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: '#000' }}>No saved templates yet</div> : saved.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', border: '1px solid #E6E6E6', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: '#000' }}>{t.name}</div><div style={{ fontSize: 12, color: '#000' }}>Subject: {t.subject}</div></div>
              {t.design_json && <button onClick={() => loadBlocks(t)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #00B5D6', background: '#fff', color: '#00B5D6', cursor: 'pointer', ...S }}>Edit</button>}
              <button onClick={() => { const lead = leads.find(l => l.id === previewLead); if (!lead?.email) { alert('Select a lead first'); return }; window.open(`mailto:${lead.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent('Hi ' + (lead.first_name || '') + ',\n\nPlease find our latest update below.\n\nBest regards,\nCosentus Team\n(877) 806-2286')}`, '_blank') }} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6, background: '#00B5D6', color: '#fff', border: 'none', cursor: 'pointer', ...S }}>Send</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Block palette */}
          <div style={{ width: 180, borderRight: '1px solid #E6E6E6', overflowY: 'auto', padding: 12, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#CCCCCC', letterSpacing: '0.08em', marginBottom: 8 }}>ADD BLOCKS</div>
            {(Object.keys(blockLabels) as BlockType[]).map(type => (
              <button key={type} onClick={() => addBlock(type)} style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid #E6E6E6', background: '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: 4, color: '#000', ...S }}>
                {blockLabels[type]}
              </button>
            ))}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#CCCCCC', letterSpacing: '0.08em', marginTop: 16, marginBottom: 8 }}>VARIABLES</div>
            {variables.map(v => (
              <button key={v} onClick={() => navigator.clipboard.writeText(v)} style={{ fontSize: 10, padding: '3px 6px', borderRadius: 4, border: '1px solid #E6E6E6', background: '#D6EBF2', cursor: 'pointer', color: '#000', fontFamily: 'monospace', marginBottom: 3, marginRight: 3 }}>{v}</button>
            ))}
            <div style={{ fontSize: 10, color: '#CCCCCC', marginTop: 4 }}>Click to copy</div>
          </div>

          {/* Center: Email canvas */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#f0f0f0', padding: 24 }}>
            <div style={{ maxWidth: mobilePreview ? 360 : 600, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'max-width 0.3s' }}>
              {blocks.map((b, idx) => (
                <div key={b.id} onClick={() => setSelected(b.id)} style={{ position: 'relative', outline: selected === b.id ? '2px solid #00B5D6' : '1px solid transparent', cursor: 'pointer', transition: 'outline 0.15s' }}>
                  {/* Block toolbar */}
                  {selected === b.id && (
                    <div style={{ position: 'absolute', top: -28, right: 0, display: 'flex', gap: 2, zIndex: 10 }}>
                      {[{ label: '↑', fn: () => moveBlock(idx, -1) }, { label: '↓', fn: () => moveBlock(idx, 1) }, { label: '⧉', fn: () => duplicateBlock(b) }, { label: '×', fn: () => removeBlock(b.id) }].map((a, i) => (
                        <button key={i} onClick={e => { e.stopPropagation(); a.fn() }} style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: a.label === '×' ? '#00B5D6' : '#000', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.label}</button>
                      ))}
                    </div>
                  )}
                  {/* Block render */}
                  {b.type === 'header' && <div style={{ background: b.bgColor, padding: `${b.padding}px 32px`, textAlign: (b.align || 'center') as any }}><img src={b.imgUrl || 'https://cosentus-website.vercel.app/images/cosentus-logo.png'} alt="Logo" style={{ height: 28, display: 'block', margin: '0 auto 6px' }} /><div style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.8)' }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{b.content}</div></div>}
                  {b.type === 'text' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, textAlign: b.align as any, fontSize: b.fontSize, color: b.color, fontWeight: b.fontWeight as any, fontStyle: b.fontStyle as any, fontFamily: b.fontFamily || 'Arial', lineHeight: 1.7 }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{fillVars(b.content)}</div>}
                  {b.type === 'heading' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, textAlign: b.align as any }}><div style={{ fontSize: b.fontSize, fontWeight: b.fontWeight as any, fontStyle: b.fontStyle as any, fontFamily: b.fontFamily || 'Arial', color: b.color, margin: 0 }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{fillVars(b.content)}</div></div>}
                  {b.type === 'image' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, textAlign: b.align as any }}>{b.imgUrl ? <img src={b.imgUrl} alt={b.imgAlt} style={{ width: `${b.imgWidth}%`, borderRadius: b.borderRadius }} /> : <div style={{ height: 120, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCCCCC', fontSize: 13 }}>Click to select → Upload image in right panel</div>}</div>}
                  {b.type === 'button' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, textAlign: b.align as any }}><span style={{ display: 'inline-block', padding: '14px 36px', background: b.btnColor, color: b.btnTextColor, borderRadius: b.borderRadius, fontWeight: 600, fontSize: b.fontSize, fontFamily: b.fontFamily || 'Arial' }}>{fillVars(b.content)}</span></div>}
                  {b.type === 'divider' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor }}><hr style={{ border: 'none', borderTop: `${b.height}px solid ${b.dividerColor}`, margin: 0 }} /></div>}
                  {b.type === 'spacer' && <div style={{ height: b.height, background: b.bgColor }} />}
                  {b.type === 'stats' && <div style={{ padding: `${b.padding}px 32px`, display: 'flex', gap: 24, background: b.bgColor }}>{[{v:b.stat1,l:b.stat1Label},{v:b.stat2,l:b.stat2Label},{v:b.stat3,l:b.stat3Label}].map((s,i) => <div key={i} style={{ textAlign: 'center', flex: 1 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#00B5D6' }}>{s.v}</div><div style={{ fontSize: 12, color: '#666' }}>{s.l}</div></div>)}</div>}
                  {b.type === 'testimonial' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, borderLeft: '4px solid #00B5D6', margin: '0 32px', borderRadius: 4 }}><div style={{ fontStyle: 'italic', fontSize: b.fontSize, color: b.color, marginBottom: 8, fontFamily: b.fontFamily || 'Arial' }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>"{fillVars(b.content)}"</div><div style={{ fontSize: 13, color: b.color, fontWeight: 600 }}>— {b.content2}</div></div>}
                  {b.type === 'footer' && <div style={{ padding: `${b.padding}px 32px`, textAlign: 'center', fontSize: b.fontSize, color: b.color, borderTop: '1px solid #e5e5e5', fontFamily: b.fontFamily || 'Arial' }}><div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{b.content}</div><div style={{ marginTop: 4 }}>SOC 2 · HIPAA · HBMA · Inc. 5000 · Great Place to Work</div></div>}
                  {b.type === 'columns' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, display: 'flex', gap: 16 }}><div style={{ flex: 1, fontSize: b.fontSize, color: b.color, fontFamily: b.fontFamily || 'Arial' }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{fillVars(b.content)}</div><div style={{ flex: 1, fontSize: b.fontSize, color: b.color, fontFamily: b.fontFamily || 'Arial' }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content2: e.currentTarget.innerText })}>{fillVars(b.content2 || '')}</div></div>}
                  {b.type === 'image_text' && <div style={{ padding: `${b.padding}px 32px`, background: b.bgColor, display: 'flex', gap: 16, alignItems: 'center' }}><div style={{ width: `${b.imgWidth || 40}%`, flexShrink: 0 }}>{b.imgUrl ? <img src={b.imgUrl} alt={b.imgAlt || ''} style={{ width: '100%', borderRadius: b.borderRadius || 0 }} /> : <div style={{ height: 100, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCCCCC', fontSize: 12 }}>Upload image →</div>}</div><div style={{ flex: 1, fontSize: b.fontSize, color: b.color, fontFamily: b.fontFamily, fontWeight: b.fontWeight as any, fontStyle: b.fontStyle as any }} contentEditable suppressContentEditableWarning onBlur={e => updateBlock(b.id, { content: e.currentTarget.innerText })}>{fillVars(b.content)}</div></div>}
                </div>
              ))}
              {blocks.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: '#CCCCCC' }}>Click blocks on the left to start building</div>}
            </div>
          </div>

          {/* Right: Properties panel */}
          <div style={{ width: 260, borderLeft: '1px solid #E6E6E6', overflowY: 'auto', padding: 12, flexShrink: 0 }}>
            {!selectedBlock ? (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#CCCCCC', letterSpacing: '0.08em', marginBottom: 12 }}>SAVE TEMPLATE</div>
                <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 6, boxSizing: 'border-box', ...S }} />
                <input value={templateSubject} onChange={e => setTemplateSubject(e.target.value)} placeholder="Subject line" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 4, boxSizing: 'border-box', ...S }} />
                <button onClick={async () => {
                  const res = await fetch('/api/crm/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'subject_lines', lead_id: previewLead || undefined, context: { purpose: 'marketing' } }) })
                  const data = await res.json()
                  if (data.subject_lines?.length) {
                    const pick = data.subject_lines[Math.floor(Math.random() * data.subject_lines.length)]
                    setTemplateSubject(pick)
                    alert('AI suggestions:\n\n' + data.subject_lines.map((s: string, i: number) => `${i+1}. ${s}`).join('\n') + '\n\nFirst one auto-filled. Copy another if preferred.')
                  }
                }} style={{ width: '100%', fontSize: 11, padding: '6px', borderRadius: 6, border: '1px solid #00B5D6', background: '#D6EBF2', color: '#00B5D6', cursor: 'pointer', marginBottom: 8, fontWeight: 500, ...S }}>✨ AI Subject Lines</button>
                <button onClick={saveTemplate} disabled={saving} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#00B5D6', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', ...S }}>{saving ? 'Saving...' : 'Save Template'}</button>
                <div style={{ fontSize: 11, color: '#CCCCCC', marginTop: 16, textAlign: 'center' }}>Select a block to edit its properties</div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{blockLabels[selectedBlock.type]}</div>
                  <button onClick={() => setSelected(null)} style={{ fontSize: 11, color: '#00B5D6', background: 'none', border: 'none', cursor: 'pointer' }}>Done</button>
                </div>

                {/* Content */}
                {['text', 'heading', 'button', 'testimonial', 'footer', 'columns'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Content</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={async () => {
                          const purpose = selectedBlock.type === 'heading' ? 'email heading' : selectedBlock.type === 'button' ? 'CTA button text' : selectedBlock.type === 'testimonial' ? 'testimonial quote' : 'email body paragraph'
                          const res = await fetch('/api/crm/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'write_block', lead_id: previewLead || undefined, context: { block_type: selectedBlock.type, purpose } }) })
                          const data = await res.json()
                          if (data.content) updateBlock(selected!, { content: data.content })
                          else alert(data.error || 'AI generation failed')
                        }} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: '1px solid #00B5D6', background: '#fff', color: '#00B5D6', cursor: 'pointer', ...S }}>✨ AI Write</button>
                        {selectedBlock.content && selectedBlock.content.length > 10 && (
                          <button onClick={async () => {
                            const res = await fetch('/api/crm/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'improve_text', context: { text: selectedBlock.content, instruction: 'make it more compelling and professional for a medical practice audience' } }) })
                            const data = await res.json()
                            if (data.content) updateBlock(selected!, { content: data.content })
                            else alert(data.error || 'AI improvement failed')
                          }} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: '1px solid #00B5D6', background: '#D6EBF2', color: '#00B5D6', cursor: 'pointer', ...S }}>✨ Improve</button>
                        )}
                      </div>
                    </div>
                    <textarea value={selectedBlock.content} onChange={e => updateBlock(selected!, { content: e.target.value })} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', marginTop: 4, ...S }} />
                  </div>
                )}

                {/* Testimonial author */}
                {selectedBlock.type === 'testimonial' && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Author</label>
                    <input value={selectedBlock.content2 || ''} onChange={e => updateBlock(selected!, { content2: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                  </div>
                )}

                {/* Column 2 */}
                {selectedBlock.type === 'columns' && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Column 2</label>
                    <textarea value={selectedBlock.content2 || ''} onChange={e => updateBlock(selected!, { content2: e.target.value })} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', marginTop: 4, ...S }} />
                  </div>
                )}

                {/* Header: logo upload + subtitle */}
                {selectedBlock.type === 'header' && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Logo Image</label>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0]; if (!file) return
                        if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
                        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                        const fileName = `email-images/${Date.now()}-${safeName}`
                        const { error } = await supabase.storage.from('crm-documents').upload(fileName, file)
                        if (error) { alert('Upload failed'); return }
                        const { data: urlData } = supabase.storage.from('crm-documents').getPublicUrl(fileName)
                        updateBlock(selected!, { imgUrl: urlData.publicUrl })
                      }} style={{ width: '100%', fontSize: 11, marginTop: 4 }} />
                      <input value={selectedBlock.imgUrl || ''} onChange={e => updateBlock(selected!, { imgUrl: e.target.value })} placeholder="Or paste logo URL" style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 11, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Subtitle</label>
                      <input value={selectedBlock.content || ''} onChange={e => updateBlock(selected!, { content: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                  </>
                )}

                {/* Image: upload + URL + dimensions */}
                {selectedBlock.type === 'image' && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Upload Image</label>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
                        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                        const fileName = `email-images/${Date.now()}-${safeName}`
                        const { error } = await supabase.storage.from('crm-documents').upload(fileName, file)
                        if (error) { alert('Upload failed: ' + error.message); return }
                        const { data: urlData } = supabase.storage.from('crm-documents').getPublicUrl(fileName)
                        updateBlock(selected!, { imgUrl: urlData.publicUrl })
                      }} style={{ width: '100%', fontSize: 11, marginTop: 4 }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Or paste URL</label>
                      <input value={selectedBlock.imgUrl || ''} onChange={e => updateBlock(selected!, { imgUrl: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Width: {selectedBlock.imgWidth}%</label>
                      <input type="range" min={20} max={100} value={selectedBlock.imgWidth || 100} onChange={e => updateBlock(selected!, { imgWidth: Number(e.target.value) })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Alt text</label>
                      <input value={selectedBlock.imgAlt || ''} onChange={e => updateBlock(selected!, { imgAlt: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Corner radius: {selectedBlock.borderRadius || 0}px</label>
                      <input type="range" min={0} max={24} value={selectedBlock.borderRadius || 0} onChange={e => updateBlock(selected!, { borderRadius: Number(e.target.value) })} style={{ width: '100%' }} />
                    </div>
                  </>
                )}

                {/* Button URL */}
                {selectedBlock.type === 'button' && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Button URL</label>
                      <input value={selectedBlock.btnUrl || ''} onChange={e => updateBlock(selected!, { btnUrl: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                    <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Button color</label>
                        <input type="color" value={selectedBlock.btnColor || '#00B5D6'} onChange={e => updateBlock(selected!, { btnColor: e.target.value })} style={{ width: '100%', height: 32, border: 'none', cursor: 'pointer', marginTop: 4 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Text color</label>
                        <input type="color" value={selectedBlock.btnTextColor || '#ffffff'} onChange={e => updateBlock(selected!, { btnTextColor: e.target.value })} style={{ width: '100%', height: 32, border: 'none', cursor: 'pointer', marginTop: 4 }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Corner radius: {selectedBlock.borderRadius || 8}px</label>
                      <input type="range" min={0} max={30} value={selectedBlock.borderRadius || 8} onChange={e => updateBlock(selected!, { borderRadius: Number(e.target.value) })} style={{ width: '100%' }} />
                    </div>
                  </>
                )}

                {/* Stats */}
                {selectedBlock.type === 'stats' && (
                  <>{[{k:'stat1',l:'stat1Label',n:'Stat 1'},{k:'stat2',l:'stat2Label',n:'Stat 2'},{k:'stat3',l:'stat3Label',n:'Stat 3'}].map(s => (
                    <div key={s.k} style={{ marginBottom: 8, display: 'flex', gap: 4 }}>
                      <input value={(selectedBlock as any)[s.k] || ''} onChange={e => updateBlock(selected!, { [s.k]: e.target.value })} placeholder="Value" style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, ...S }} />
                      <input value={(selectedBlock as any)[s.l] || ''} onChange={e => updateBlock(selected!, { [s.l]: e.target.value })} placeholder="Label" style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, ...S }} />
                    </div>
                  ))}</>
                )}

                {/* Divider */}
                {selectedBlock.type === 'divider' && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Color</label>
                    <input type="color" value={selectedBlock.dividerColor || '#e5e5e5'} onChange={e => updateBlock(selected!, { dividerColor: e.target.value })} style={{ width: '100%', height: 28, border: 'none', cursor: 'pointer', marginTop: 4 }} />
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600, marginTop: 8, display: 'block' }}>Thickness: {selectedBlock.height || 1}px</label>
                    <input type="range" min={1} max={5} value={selectedBlock.height || 1} onChange={e => updateBlock(selected!, { height: Number(e.target.value) })} style={{ width: '100%' }} />
                  </div>
                )}

                {/* Spacer height */}
                {selectedBlock.type === 'spacer' && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Height: {selectedBlock.height || 32}px</label>
                    <input type="range" min={8} max={80} value={selectedBlock.height || 32} onChange={e => updateBlock(selected!, { height: Number(e.target.value) })} style={{ width: '100%' }} />
                  </div>
                )}

                {/* Common: font family */}
                {['text', 'heading', 'button', 'testimonial', 'footer', 'columns', 'image_text'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Font</label>
                    <select value={selectedBlock.fontFamily || 'Arial'} onChange={e => updateBlock(selected!, { fontFamily: e.target.value })} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 12, marginTop: 4, ...S }}>
                      {emailFonts.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                    </select>
                  </div>
                )}

                {/* Common: font size */}
                {['text', 'heading', 'button', 'testimonial', 'footer', 'columns', 'image_text'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Font size: {selectedBlock.fontSize || 15}px</label>
                    <input type="range" min={10} max={36} value={selectedBlock.fontSize || 15} onChange={e => updateBlock(selected!, { fontSize: Number(e.target.value) })} style={{ width: '100%' }} />
                  </div>
                )}

                {/* Common: text color */}
                {['text', 'heading', 'testimonial', 'footer', 'columns', 'image_text'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Text color</label>
                    <input type="color" value={selectedBlock.color || '#333333'} onChange={e => updateBlock(selected!, { color: e.target.value })} style={{ width: '100%', height: 28, border: 'none', cursor: 'pointer', marginTop: 4 }} />
                  </div>
                )}

                {/* Common: bold + italic */}
                {['text', 'heading', 'image_text'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#000' }}>
                      <input type="checkbox" checked={selectedBlock.fontWeight === 'bold'} onChange={e => updateBlock(selected!, { fontWeight: e.target.checked ? 'bold' : 'normal' })} /> <strong>B</strong>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#000' }}>
                      <input type="checkbox" checked={selectedBlock.fontStyle === 'italic'} onChange={e => updateBlock(selected!, { fontStyle: e.target.checked ? 'italic' : 'normal' })} /> <em>I</em>
                    </label>
                  </div>
                )}

                {/* Link URL */}
                {['text', 'heading'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Link URL <span style={{ fontWeight: 400, color: '#CCCCCC' }}>(wraps text in link)</span></label>
                    <input value={selectedBlock.linkUrl || ''} onChange={e => updateBlock(selected!, { linkUrl: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, boxSizing: 'border-box', marginTop: 4, ...S }} />
                  </div>
                )}

                {/* Image+Text: image controls */}
                {selectedBlock.type === 'image_text' && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Image</label>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0]; if (!file) return
                        if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
                        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                        const fileName = `email-images/${Date.now()}-${safeName}`
                        const { error } = await supabase.storage.from('crm-documents').upload(fileName, file)
                        if (error) { alert('Upload failed'); return }
                        const { data: urlData } = supabase.storage.from('crm-documents').getPublicUrl(fileName)
                        updateBlock(selected!, { imgUrl: urlData.publicUrl })
                      }} style={{ width: '100%', fontSize: 11, marginTop: 4 }} />
                      <input value={selectedBlock.imgUrl || ''} onChange={e => updateBlock(selected!, { imgUrl: e.target.value })} placeholder="Or paste URL" style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 11, boxSizing: 'border-box', marginTop: 4, ...S }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Image width: {selectedBlock.imgWidth || 40}%</label>
                      <input type="range" min={20} max={60} value={selectedBlock.imgWidth || 40} onChange={e => updateBlock(selected!, { imgWidth: Number(e.target.value) })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Corner radius: {selectedBlock.borderRadius || 0}px</label>
                      <input type="range" min={0} max={24} value={selectedBlock.borderRadius || 0} onChange={e => updateBlock(selected!, { borderRadius: Number(e.target.value) })} style={{ width: '100%' }} />
                    </div>
                  </>
                )}

                {/* Common: alignment */}
                {!['divider', 'spacer', 'stats'].includes(selectedBlock.type) && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Alignment</label>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {['left', 'center', 'right'].map(a => (
                        <button key={a} onClick={() => updateBlock(selected!, { align: a })} style={{ flex: 1, padding: '6px', borderRadius: 4, border: `1px solid ${selectedBlock.align === a ? '#00B5D6' : '#E6E6E6'}`, background: selectedBlock.align === a ? '#D6EBF2' : '#fff', cursor: 'pointer', fontSize: 11, textTransform: 'capitalize' as const, color: '#000', ...S }}>{a}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common: background color */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Background</label>
                  <input type="color" value={selectedBlock.bgColor || '#ffffff'} onChange={e => { pushHistory(); updateBlock(selected!, { bgColor: e.target.value }) }} style={{ width: '100%', height: 28, border: 'none', cursor: 'pointer', marginTop: 4 }} />
                </div>

                {/* Common: padding */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#000', fontWeight: 600 }}>Padding: {selectedBlock.padding || 16}px</label>
                  <input type="range" min={0} max={48} value={selectedBlock.padding || 16} onChange={e => updateBlock(selected!, { padding: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview modal */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPreview(false)}>
          <div style={{ width: 640, maxHeight: '90vh', background: '#f0f0f0', borderRadius: 16, overflow: 'auto', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>Email Preview</span>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#000' }}>×</button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: toHtml(true) }} />
          </div>
        </div>
      )}
    </div>
  )
}
