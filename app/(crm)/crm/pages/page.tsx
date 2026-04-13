'use client'

import { useState } from 'react'

interface Section { id: string; type: string; content: Record<string, string> }
interface LandingPage { id: string; name: string; slug: string; status: string; sections: Section[]; created_at: string }

const sectionTemplates = [
  { type: 'hero', label: 'Hero', fields: ['headline', 'subheadline', 'cta_text', 'cta_url'] },
  { type: 'stats', label: 'Stats Bar', fields: ['stat1_value', 'stat1_label', 'stat2_value', 'stat2_label', 'stat3_value', 'stat3_label'] },
  { type: 'features', label: 'Features Grid', fields: ['title', 'feature1', 'feature2', 'feature3', 'feature4'] },
  { type: 'testimonial', label: 'Testimonial', fields: ['quote', 'author', 'role'] },
  { type: 'cta', label: 'CTA Block', fields: ['headline', 'subheadline', 'button_text', 'button_url'] },
  { type: 'text', label: 'Text Block', fields: ['heading', 'body'] },
  { type: 'form', label: 'Lead Capture Form', fields: ['heading', 'description', 'form_id'] },
]

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<LandingPage | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  const addSection = (type: string) => {
    const tpl = sectionTemplates.find(t => t.type === type)
    if (!tpl) return
    const content: Record<string, string> = {}
    tpl.fields.forEach(f => content[f] = '')
    setSections([...sections, { id: `s-${Date.now()}`, type, content }])
  }

  const updateSection = (id: string, field: string, value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: { ...s.content, [field]: value } } : s))
  }

  const removeSection = (id: string) => setSections(prev => prev.filter(s => s.id !== id))

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= sections.length) return
    const arr = [...sections]
    ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
    setSections(arr)
  }

  const savePage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const page: LandingPage = {
      id: `lp-${Date.now()}`,
      name: fd.get('name') as string,
      slug: (fd.get('slug') as string || '').toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      status: 'draft',
      sections,
      created_at: new Date().toISOString(),
    }
    setPages(prev => [page, ...prev])
    setShowCreate(false)
    setSections([])
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Landing Pages</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>Build campaign landing pages with lead capture</p>
        </div>
        <button onClick={() => { setShowCreate(!showCreate); setSections([]) }} className="crm-btn crm-btn-primary">+ Create Page</button>
      </div>

      {showCreate && (
        <form onSubmit={savePage} className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>New Landing Page</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <input name="name" placeholder="Page name *" required className="crm-input" />
            <input name="slug" placeholder="URL slug (e.g. free-analysis)" className="crm-input" />
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Sections ({sections.length})</div>

          {sections.map((s, idx) => {
            const tpl = sectionTemplates.find(t => t.type === s.type)
            return (
              <div key={s.id} style={{ border: '1px solid #E6E6E6', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#00B5D6' }}>{tpl?.label || s.type}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => moveSection(idx, -1)} style={{ fontSize: 12, padding: '2px 8px', border: '1px solid #E6E6E6', borderRadius: 4, background: 'none', cursor: 'pointer' }}>↑</button>
                    <button type="button" onClick={() => moveSection(idx, 1)} style={{ fontSize: 12, padding: '2px 8px', border: '1px solid #E6E6E6', borderRadius: 4, background: 'none', cursor: 'pointer' }}>↓</button>
                    <button type="button" onClick={() => removeSection(s.id)} style={{ fontSize: 12, padding: '2px 8px', border: '1px solid #E6E6E6', borderRadius: 4, background: 'none', cursor: 'pointer', color: '#00B5D6' }}>×</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {tpl?.fields.map(f => (
                    <input key={f} value={s.content[f] || ''} onChange={e => updateSection(s.id, f, e.target.value)} placeholder={f.replace(/_/g, ' ')} className="crm-input" style={{ fontSize: 12 }} />
                  ))}
                </div>
              </div>
            )
          })}

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
            {sectionTemplates.map(t => (
              <button key={t.type} type="button" onClick={() => addSection(t.type)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px dashed #00B5D6', background: 'none', color: '#00B5D6', cursor: 'pointer' }}>+ {t.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={sections.length === 0} className="crm-btn crm-btn-primary" style={{ opacity: sections.length === 0 ? 0.5 : 1 }}>Save Page</button>
            <button type="button" onClick={() => setShowCreate(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {pages.length === 0 && !showCreate ? (
        <div className="crm-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No landing pages yet</div>
          <p style={{ fontSize: 13, color: '#000', marginBottom: 16 }}>Build campaign-specific pages with lead capture forms</p>
          <button onClick={() => setShowCreate(true)} className="crm-btn crm-btn-primary">Create your first page</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {pages.map(p => (
            <div key={p.id} className="crm-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>/{p.slug} · {p.sections.length} sections · Created {new Date(p.created_at).toLocaleDateString()}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: p.status === 'published' ? '#00B5D6' : '#E6E6E6', color: p.status === 'published' ? '#fff' : '#000' }}>{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
