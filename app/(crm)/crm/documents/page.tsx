'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Doc { id: string; name: string; type: string; lead_id: string | null; file_url: string | null; file_size: number | null; uploaded_by: string | null; status: string; created_at: string; is_email_template: boolean; lead?: { first_name: string; last_name: string } | null }
interface LeadOption { id: string; first_name: string; last_name: string; practice_name: string }

const typeIcons: Record<string, string> = { proposal: '📄', contract: '📋', case_study: '📊', presentation: '📑', invoice: '🧾', other: '📎' }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const fileRef = useRef<HTMLInputElement>(null)

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
    if (uploading) return
    setUploading(true)

    const fd = new FormData(e.currentTarget)
    const file = (fileRef.current?.files)?.[0]
    let fileUrl = null
    let fileSize = null

    // Upload file to Supabase Storage if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from('crm-documents').upload(fileName, file)
      if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return }
      const { data: urlData } = supabase.storage.from('crm-documents').getPublicUrl(fileName)
      fileUrl = urlData.publicUrl
      fileSize = file.size
    }

    const isTemplate = fd.get('is_email_template') === 'on'
    const doc = {
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      lead_id: fd.get('lead_id') as string || null,
      uploaded_by: fd.get('uploaded_by') as string || null,
      file_url: fileUrl,
      file_size: fileSize,
      is_email_template: isTemplate,
      status: 'draft',
    }

    const { data } = await supabase.from('documents').insert(doc).select('*, lead:leads(first_name, last_name)')
    if (data) { setDocs(prev => [data[0] as Doc, ...prev]); setShowAdd(false) }

    // If marked as email template, also save to email_templates
    if (isTemplate && file && file.name.endsWith('.html')) {
      const text = await file.text()
      await supabase.from('email_templates').insert({
        name: fd.get('name') as string,
        subject: fd.get('name') as string,
        html_content: text,
        category: 'custom',
      })
    }

    setUploading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    await supabase.from('documents').update({ status }).eq('id', id)
  }

  const deleteDoc = async (id: string, fileUrl: string | null) => {
    if (!confirm('Delete this document?')) return
    setDocs(prev => prev.filter(d => d.id !== id))
    await supabase.from('documents').delete().eq('id', id)
    if (fileUrl) {
      const path = fileUrl.split('/crm-documents/')[1]
      if (path) await supabase.storage.from('crm-documents').remove([path])
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  if (loading) return <div style={{ padding: 48, color: '#000' }}>Loading documents...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Documents</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>{docs.length} documents · Proposals, contracts, case studies</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="crm-btn crm-btn-primary">+ Add Document</button>
      </div>

      <div className="crm-segment" style={{ marginBottom: 20 }}>
        {['all', 'proposal', 'contract', 'case_study', 'presentation', 'invoice'].map(f => (
          <button key={f} className={filterType === f ? 'active' : ''} onClick={() => setFilterType(f)} style={{ textTransform: 'capitalize' }}>{f === 'all' ? 'All' : f.replace('_', ' ')}</button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>Upload Document</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <input name="name" placeholder="Document name *" required className="crm-input" />
            <select name="type" className="crm-select">
              <option value="proposal">Proposal</option><option value="contract">Contract</option>
              <option value="case_study">Case Study</option><option value="presentation">Presentation</option>
              <option value="invoice">Invoice</option><option value="other">Other</option>
            </select>
            <select name="lead_id" className="crm-select">
              <option value="">Link to lead (optional)</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.practice_name}</option>)}
            </select>
            <input name="uploaded_by" placeholder="Uploaded by" className="crm-input" />
            <div style={{ gridColumn: '1 / -1' }}>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.html,.pptx,.xlsx,.txt,.csv" style={{ fontSize: 13, padding: 8 }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#000', gridColumn: '1 / -1' }}>
              <input type="checkbox" name="is_email_template" /> Also save as email template (HTML files only)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" disabled={uploading} className="crm-btn crm-btn-primary" style={{ opacity: uploading ? 0.5 : 1 }}>{uploading ? 'Uploading...' : 'Upload Document'}</button>
            <button type="button" onClick={() => setShowAdd(false)} className="crm-btn crm-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="crm-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#000', marginBottom: 12 }}>No documents yet</div>
          <button onClick={() => setShowAdd(true)} className="crm-btn crm-btn-primary">Upload your first document</button>
        </div>
      ) : (
        <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="crm-table">
            <thead><tr>
              <th>Document</th><th>Type</th><th>Lead</th><th>Status</th><th>Size</th><th>Date</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{typeIcons[d.type] || '📎'}</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{d.name}</div>
                        {d.is_email_template && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#D6EBF2', color: '#00B5D6', fontWeight: 600 }}>EMAIL TEMPLATE</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{d.type.replace('_', ' ')}</td>
                  <td style={{ color: '#00B5D6' }}>{d.lead ? `${d.lead.first_name} ${d.lead.last_name}` : '—'}</td>
                  <td>
                    <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)} style={{ fontSize: 12, fontWeight: 500, padding: '3px 8px', borderRadius: 6, background: d.status === 'signed' ? '#00B5D6' : '#E6E6E6', color: d.status === 'signed' ? '#fff' : '#000', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
                      {['draft', 'sent', 'viewed', 'signed', 'expired'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{formatSize(d.file_size)}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {d.file_url && <a href={d.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#00B5D6', textDecoration: 'none', padding: '4px 8px', borderRadius: 6, border: '1px solid #E6E6E6' }}>Download</a>}
                      <button onClick={() => deleteDoc(d.id, d.file_url)} style={{ fontSize: 12, color: '#000', background: 'none', border: '1px solid #E6E6E6', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
