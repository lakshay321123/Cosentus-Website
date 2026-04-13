'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface CRMForm { id: string; name: string; description: string | null; fields: any[]; status: string; submissions_count: number; redirect_url: string | null; created_at: string }

const fieldTypes = ['text', 'email', 'phone', 'select', 'textarea', 'number']

export default function FormsPage() {
  const [forms, setForms] = useState<CRMForm[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [fields, setFields] = useState([{ label: 'Full Name', type: 'text', required: true, map_to: 'name' }, { label: 'Email', type: 'email', required: true, map_to: 'email' }, { label: 'Phone', type: 'phone', required: false, map_to: 'phone' }, { label: 'Practice Name', type: 'text', required: false, map_to: 'practice_name' }])

  useEffect(() => {
    supabase.from('crm_forms').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setForms(data as CRMForm[]); setLoading(false) })
  }, [])

  const addField = () => setFields([...fields, { label: '', type: 'text', required: false, map_to: '' }])
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i))

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const form = { name: fd.get('name') as string, description: fd.get('description') as string || null, fields, status: 'active', redirect_url: fd.get('redirect_url') as string || null }
    const { data } = await supabase.from('crm_forms').insert(form).select()
    if (data) { setForms(prev => [data[0] as CRMForm, ...prev]); setShowCreate(false); setFields([{ label: 'Full Name', type: 'text', required: true, map_to: 'name' }, { label: 'Email', type: 'email', required: true, map_to: 'email' }]) }
  }

  if (loading) return <div style={{ padding: 48, color: '#000' }}>Loading...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Form Builder</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>Create lead capture forms for your website</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="crm-btn crm-btn-primary">+ Create Form</button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>New Form</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <input name="name" placeholder="Form name *" required className="crm-input" />
            <input name="redirect_url" placeholder="Redirect URL after submit (optional)" className="crm-input" />
            <input name="description" placeholder="Description" className="crm-input" style={{ gridColumn: '1 / -1' }} />
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Form Fields</div>
          {fields.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px auto', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <input value={f.label} onChange={e => { const n = [...fields]; n[i].label = e.target.value; setFields(n) }} placeholder="Field label" className="crm-input" style={{ fontSize: 13 }} />
              <select value={f.type} onChange={e => { const n = [...fields]; n[i].type = e.target.value; setFields(n) }} className="crm-select" style={{ fontSize: 13 }}>
                {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={f.map_to} onChange={e => { const n = [...fields]; n[i].map_to = e.target.value; setFields(n) }} className="crm-select" style={{ fontSize: 13 }}>
                <option value="">Map to...</option><option value="name">Name</option><option value="email">Email</option>
                <option value="phone">Phone</option><option value="practice_name">Practice</option>
                <option value="specialty">Specialty</option><option value="notes">Notes</option>
              </select>
              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="checkbox" checked={f.required} onChange={e => { const n = [...fields]; n[i].required = e.target.checked; setFields(n) }} /> Required
              </label>
              <button type="button" onClick={() => removeField(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00B5D6', fontSize: 16 }}>×</button>
            </div>
          ))}
          <button type="button" onClick={addField} style={{ fontSize: 12, color: '#00B5D6', background: 'none', border: '1px dashed #00B5D6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', marginTop: 4, marginBottom: 16 }}>+ Add Field</button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="crm-btn crm-btn-primary">Create Form</button>
            <button type="button" onClick={() => setShowCreate(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {forms.length === 0 ? (
        <div className="crm-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No forms yet</div>
          <button onClick={() => setShowCreate(true)} className="crm-btn crm-btn-primary">Create your first form</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {forms.map(f => (
            <div key={f.id} className="crm-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{f.name}</div>
                {f.description && <div style={{ fontSize: 13, color: '#000', marginTop: 2 }}>{f.description}</div>}
                <div style={{ fontSize: 12, color: '#000', marginTop: 4 }}>{f.fields.length} fields · {f.submissions_count} submissions</div>
              </div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#00B5D6', padding: '4px 10px', borderRadius: 6, background: '#D6EBF2' }}>
                /form/{f.id.slice(0, 8)}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: f.status === 'active' ? '#00B5D6' : '#E6E6E6', color: f.status === 'active' ? '#fff' : '#000' }}>{f.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
