'use client'

import { useState, useEffect, useRef } from 'react'
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

  // Bulk email state
  const [showBulkEmail, setShowBulkEmail] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  // CSV upload state
  const [showUpload, setShowUpload] = useState(false)
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMap, setColumnMap] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const crmFields = ['(skip)', 'first_name', 'last_name', 'email', 'phone', 'practice_name', 'specialty', 'notes']

  useEffect(() => {
    Promise.all([
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, temperature').order('first_name'),
    ]).then(([cRes, lRes]) => {
      if (cRes.data) setCampaigns(cRes.data as Campaign[])
      if (lRes.data) setLeads(lRes.data as Lead[])
      setLoading(false)
    })
  }, [])

  const filtered = filterStatus === 'all' ? campaigns : campaigns.filter(c => c.status === filterStatus)

  // Auto-detect column mapping
  const detectColumn = (header: string): string => {
    const h = header.toLowerCase().trim()
    if (['email', 'e-mail', 'email address', 'emailaddress'].includes(h)) return 'email'
    if (['first name', 'firstname', 'first_name', 'fname', 'given name'].includes(h)) return 'first_name'
    if (['last name', 'lastname', 'last_name', 'lname', 'surname', 'family name'].includes(h)) return 'last_name'
    if (['name', 'full name', 'fullname', 'contact name', 'contact'].includes(h)) return 'first_name'
    if (['phone', 'telephone', 'phone number', 'phonenumber', 'mobile', 'cell'].includes(h)) return 'phone'
    if (['practice', 'practice name', 'company', 'organization', 'org', 'clinic', 'hospital', 'group'].includes(h)) return 'practice_name'
    if (['specialty', 'speciality', 'department', 'dept', 'service'].includes(h)) return 'specialty'
    if (['notes', 'comments', 'note', 'message'].includes(h)) return 'notes'
    return '(skip)'
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length < 2) { alert('File needs at least a header row + one data row'); return }

      // Detect delimiter
      const firstLine = lines[0]
      const delimiter = firstLine.includes('\t') ? '\t' : ','

      const headers = firstLine.split(delimiter).map(h => h.replace(/^["']|["']$/g, '').trim())
      setCsvHeaders(headers)

      // Auto-detect columns
      const map: Record<string, string> = {}
      headers.forEach(h => { map[h] = detectColumn(h) })
      setColumnMap(map)

      // Parse data rows
      const rows: Record<string, string>[] = []
      for (let i = 1; i < Math.min(lines.length, 10001); i++) {
        const vals = lines[i].split(delimiter).map(v => v.replace(/^["']|["']$/g, '').trim())
        const row: Record<string, string> = {}
        headers.forEach((h, j) => { row[h] = vals[j] || '' })
        rows.push(row)
      }
      setCsvData(rows)
      setImportResult('')
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (csvData.length === 0) return
    setImporting(true)

    let imported = 0, duplicates = 0, failed = 0

    // Process in batches of 50
    for (let i = 0; i < csvData.length; i += 50) {
      const batch = csvData.slice(i, i + 50)

      for (const row of batch) {
        const lead: Record<string, string> = { source: 'email' }
        for (const [csvCol, crmField] of Object.entries(columnMap)) {
          if (crmField === '(skip)' || !row[csvCol]) continue
          // Handle "name" field that might be full name
          if (crmField === 'first_name' && !columnMap[Object.keys(columnMap).find(k => columnMap[k] === 'last_name') || '']) {
            const parts = row[csvCol].split(' ')
            lead.first_name = parts[0]
            lead.last_name = parts.slice(1).join(' ') || ''
          } else {
            lead[crmField] = row[csvCol]
          }
        }
        if (!lead.first_name && !lead.email) { failed++; continue }
        if (!lead.first_name) lead.first_name = 'Unknown'
        if (!lead.last_name) lead.last_name = ''

        try {
          const res = await fetch('/api/crm/leads', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          })
          const data = await res.json()
          if (data.duplicate) duplicates++
          else imported++
        } catch { failed++ }
      }

      setImportResult(`Processing... ${Math.min(i + 50, csvData.length)}/${csvData.length}`)
    }

    setImportResult(`Done: ${imported} imported, ${duplicates} duplicates, ${failed} failed`)
    setImporting(false)

    // Refresh leads
    const { data: newLeads } = await supabase.from('leads').select('id, first_name, last_name, email, practice_name, specialty, temperature').order('first_name')
    if (newLeads) setLeads(newLeads as Lead[])
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (saving) return; setSaving(true)
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
  const selectAll = () => setSelectedLeads(selectedLeads.length === leads.filter(l => l.email).length ? [] : leads.filter(l => l.email).map(l => l.id))

  const sendBulkOutlook = (batchSize: number = 50) => {
    const recipients = leads.filter(l => selectedLeads.includes(l.id) && l.email)
    if (recipients.length === 0) { alert('No leads with email selected'); return }

    // Open in batches of 50 (Outlook BCC limit)
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      const bcc = batch.map(l => l.email).join(',')
      const subject = encodeURIComponent(emailSubject || 'From Cosentus')
      const body = encodeURIComponent(emailBody || '')
      setTimeout(() => window.open(`mailto:?bcc=${bcc}&subject=${subject}&body=${body}`, '_blank'), i / batchSize * 1000)
    }
    alert(`Opening ${Math.ceil(recipients.length / batchSize)} Outlook windows (${batchSize} recipients each)`)
  }

  const exportCSV = () => {
    const rows = leads.filter(l => selectedLeads.includes(l.id) && l.email)
    if (rows.length === 0) { alert('No leads selected'); return }
    const csv = ['Email,First Name,Last Name,Practice,Specialty', ...rows.map(l => `${l.email},${l.first_name},${l.last_name},${l.practice_name || ''},${l.specialty}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `campaign-emails-${Date.now()}.csv`; a.click()
  }

  if (loading) return <div style={{ padding: 48, color: '#000' }}>Loading...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '4px 0 0' }}>{campaigns.length} campaigns · {leads.length} leads in CRM</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowUpload(!showUpload); setShowBulkEmail(false) }} className="crm-btn crm-btn-secondary">Upload CSV</button>
          <button onClick={() => { setShowBulkEmail(!showBulkEmail); setShowUpload(false) }} className="crm-btn crm-btn-secondary">Bulk Email</button>
          <button onClick={() => setShowCreate(!showCreate)} className="crm-btn crm-btn-primary">+ Create Campaign</button>
        </div>
      </div>

      {/* CSV Upload */}
      {showUpload && (
        <div className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>Upload Email List (CSV / Excel)</h3>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.xls,.xlsx" onChange={handleFileUpload} style={{ fontSize: 13, marginBottom: 12 }} />
          <div style={{ fontSize: 12, color: '#CCCCCC', marginBottom: 12 }}>Upload a CSV with email addresses. Columns are auto-detected. Supports up to 10,000 rows.</div>

          {csvHeaders.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Column Mapping (auto-detected — adjust if needed)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
                {csvHeaders.map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#000', fontWeight: 500, minWidth: 80 }}>{h}</span>
                    <span style={{ fontSize: 12, color: '#CCCCCC' }}>→</span>
                    <select value={columnMap[h] || '(skip)'} onChange={e => setColumnMap({ ...columnMap, [h]: e.target.value })} className="crm-select" style={{ fontSize: 12, flex: 1 }}>
                      {crmFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Preview (first 5 rows of {csvData.length})</div>
              <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                <table className="crm-table" style={{ fontSize: 12 }}>
                  <thead><tr>{csvHeaders.map(h => <th key={h}>{h}<br/><span style={{ fontWeight: 400, color: '#00B5D6', fontSize: 10 }}>{columnMap[h]}</span></th>)}</tr></thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i}>{csvHeaders.map(h => <td key={h}>{row[h]}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {importResult && <div style={{ fontSize: 13, fontWeight: 600, color: '#00B5D6', marginBottom: 12 }}>{importResult}</div>}

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleImport} disabled={importing} className="crm-btn crm-btn-primary" style={{ opacity: importing ? 0.5 : 1 }}>
                  {importing ? 'Importing...' : `Import ${csvData.length} Leads`}
                </button>
                <button onClick={() => { setCsvData([]); setCsvHeaders([]); setColumnMap({}); setImportResult(''); setShowUpload(false) }} className="crm-btn crm-btn-secondary">Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bulk Email */}
      {showBulkEmail && (
        <div className="crm-card" style={{ marginBottom: 20, border: '1px solid #00B5D6' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 16px' }}>Bulk Email ({leads.filter(l => l.email).length} leads with email)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                Select ({selectedLeads.length})
                <button onClick={selectAll} style={{ marginLeft: 8, fontSize: 11, color: '#00B5D6', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {selectedLeads.length === leads.filter(l => l.email).length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #E6E6E6', borderRadius: 10 }}>
                {leads.filter(l => l.email).map(l => (
                  <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid #E6E6E6', cursor: 'pointer', fontSize: 12, background: selectedLeads.includes(l.id) ? '#D6EBF2' : 'transparent' }}>
                    <input type="checkbox" checked={selectedLeads.includes(l.id)} onChange={() => toggleLead(l.id)} />
                    <span style={{ fontWeight: 500, color: '#000' }}>{l.first_name} {l.last_name}</span>
                    <span style={{ color: '#000' }}>{l.email}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 8 }}>Compose</div>
              <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Subject" className="crm-input" style={{ marginBottom: 6 }} />
              <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Body" rows={6}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, fontFamily: "'Reddit Sans', sans-serif", boxSizing: 'border-box', resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => sendBulkOutlook(50)} disabled={selectedLeads.length === 0} className="crm-btn crm-btn-primary" style={{ opacity: selectedLeads.length === 0 ? 0.5 : 1 }}>
                  Send via Outlook ({selectedLeads.length})
                </button>
                <button onClick={exportCSV} disabled={selectedLeads.length === 0} className="crm-btn crm-btn-secondary" style={{ opacity: selectedLeads.length === 0 ? 0.5 : 1 }}>
                  Export CSV
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#CCCCCC', marginTop: 8 }}>Outlook opens in batches of 50 (BCC). Or export CSV for mail merge.</div>
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
            <select name="type" className="crm-select"><option value="email">Email</option><option value="event">Event</option><option value="content">Content</option><option value="ad">Ad</option><option value="referral">Referral</option></select>
            <input name="budget" placeholder="Budget ($)" type="number" className="crm-input" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={saving} className="crm-btn crm-btn-primary">{saving ? 'Creating...' : 'Create'}</button>
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
              <div><div style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{c.name}</div><div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>{c.type} · {new Date(c.created_at).toLocaleDateString()}</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>${c.budget?.toLocaleString() || 0}</div><div style={{ fontSize: 11, color: '#000' }}>Budget</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>{c.leads_generated}</div><div style={{ fontSize: 11, color: '#000' }}>Leads</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>{c.deals_influenced}</div><div style={{ fontSize: 11, color: '#000' }}>Deals</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16, fontWeight: 600, color: '#00B5D6' }}>${c.revenue_attributed?.toLocaleString() || 0}</div><div style={{ fontSize: 11, color: '#000' }}>Revenue</div></div>
              <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: c.status === 'active' ? '#00B5D6' : '#E6E6E6', color: c.status === 'draft' ? '#000' : '#fff', border: 'none', cursor: 'pointer' }}>
                {['draft', 'active', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
