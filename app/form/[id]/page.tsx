'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { supabase } from '@/lib/supabase'

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [form, setForm] = useState<any>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.from('crm_forms').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setForm(data); setLoading(false) })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    // Map form values to lead fields
    const lead: Record<string, string> = { source: 'contact_form' }
    for (const field of form.fields) {
      const val = values[field.label]
      if (!val) continue
      if (field.map_to === 'name') {
        const parts = val.split(' ')
        lead.first_name = parts[0]
        lead.last_name = parts.slice(1).join(' ') || 'Unknown'
      } else if (field.map_to) {
        lead[field.map_to] = val
      }
    }
    if (!lead.first_name) { lead.first_name = 'Form'; lead.last_name = 'Submission' }

    await fetch('/api/crm/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
    await supabase.from('crm_forms').update({ submissions_count: (form.submissions_count || 0) + 1 }).eq('id', id)
    setSubmitted(true)
    setSubmitting(false)
    if (form.redirect_url && form.redirect_url.startsWith('/')) window.location.href = form.redirect_url
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif" }}>Loading...</div>
  if (!form) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif" }}>Form not found</div>

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#000', margin: '0 0 8px' }}>Thank you!</h1>
        <p style={{ fontSize: 15, color: '#000' }}>We will be in touch shortly.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 28, marginBottom: 20 }} />
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#000', margin: '0 0 4px' }}>{form.name}</h1>
        {form.description && <p style={{ fontSize: 14, color: '#000', margin: '0 0 24px' }}>{form.description}</p>}
        <form onSubmit={handleSubmit}>
          {form.fields.map((f: any, i: number) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#000', display: 'block', marginBottom: 4 }}>{f.label}{f.required && ' *'}</label>
              {f.type === 'textarea' ? (
                <textarea value={values[f.label] || ''} onChange={e => setValues({ ...values, [f.label]: e.target.value })} required={f.required} rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 14, fontFamily: "'Reddit Sans', sans-serif", boxSizing: 'border-box', resize: 'vertical' }} />
              ) : f.type === 'select' ? (
                <select value={values[f.label] || ''} onChange={e => setValues({ ...values, [f.label]: e.target.value })} required={f.required}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 14, background: '#fff' }}>
                  <option value="">Select...</option>
                  <option value="anesthesia">Anesthesia</option><option value="orthopedics">Orthopedics</option>
                  <option value="pain_management">Pain Management</option><option value="asc">ASC</option>
                  <option value="behavioral_health">Behavioral Health</option><option value="other">Other</option>
                </select>
              ) : (
                <input type={f.type === 'phone' ? 'tel' : f.type} value={values[f.label] || ''} onChange={e => setValues({ ...values, [f.label]: e.target.value })} required={f.required}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 14, fontFamily: "'Reddit Sans', sans-serif", boxSizing: 'border-box' }} />
              )}
            </div>
          ))}
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#00B5D6', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.6 : 1, fontFamily: "'Reddit Sans', sans-serif" }}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#CCCCCC' }}>Cosentus · cosentus.com</div>
      </div>
    </div>
  )
}
