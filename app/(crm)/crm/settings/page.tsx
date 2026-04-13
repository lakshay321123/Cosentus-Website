'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Webhook { id: string; name: string; url: string; secret: string | null; events: string[]; is_active: boolean; success_count: number; fail_count: number; last_triggered: string | null }
interface CRMUser { id: string; email: string; name: string; role: string; is_active: boolean; last_login: string | null }

export default function SettingsPage() {
  const [tab, setTab] = useState<'api' | 'users' | 'webhooks' | 'scoring'>('api')
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [users, setUsers] = useState<CRMUser[]>([])
  const [showAddWebhook, setShowAddWebhook] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)

  useEffect(() => {
    supabase.from('webhooks').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setWebhooks(data as Webhook[]) })
    supabase.from('crm_users').select('*').order('name').then(({ data }) => { if (data) setUsers(data as CRMUser[]) })
  }, [])

  const addWebhook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const hook = { name: fd.get('name') as string, url: fd.get('url') as string, secret: fd.get('secret') as string || null, events: (fd.get('events') as string).split(',').map(s => s.trim()), is_active: true }
    const { data } = await supabase.from('webhooks').insert(hook).select()
    if (data) { setWebhooks(prev => [data[0] as Webhook, ...prev]); setShowAddWebhook(false) }
  }

  const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const user = { email: fd.get('email') as string, name: fd.get('name') as string, password_hash: fd.get('password') as string, role: fd.get('role') as string }
    const { data } = await supabase.from('crm_users').insert(user).select()
    if (data) { setUsers(prev => [...prev, data[0] as CRMUser]); setShowAddUser(false) }
  }

  const toggleWebhook = async (id: string, active: boolean) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, is_active: active } : w))
    await supabase.from('webhooks').update({ is_active: active }).eq('id', id)
  }

  const toggleUser = async (id: string, active: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: active } : u))
    await supabase.from('crm_users').update({ is_active: active }).eq('id', id)
  }

  const scoringRules = [
    { signal: 'Base score', points: '+30' }, { signal: 'High-value specialty (anesthesia, ortho, ASC, pain)', points: '+15' },
    { signal: 'Provider count ≥ 10', points: '+20' }, { signal: 'Provider count ≥ 5', points: '+10' },
    { signal: 'Monthly charges ≥ $500K', points: '+20' }, { signal: 'Monthly charges ≥ $200K', points: '+15' },
    { signal: 'Has email', points: '+5' }, { signal: 'Has phone', points: '+5' },
    { signal: 'High-intent source (chat, form, voice)', points: '+10' },
  ]

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: '0 0 4px' }}>Settings</h1>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#000', margin: '0 0 24px' }}>CRM configuration, users, webhooks, and integrations</p>

      <div className="crm-segment" style={{ marginBottom: 24 }}>
        {(['api', 'users', 'webhooks', 'scoring'] as const).map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t === 'api' ? 'API & Integrations' : t}</button>
        ))}
      </div>

      {tab === 'api' && (
        <div>
          <div className="crm-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>Lead Capture API</h3>
            <p style={{ fontSize: 13, color: '#000', marginBottom: 12 }}>Send leads from chat widget, voice agent, or external forms.</p>
            <div style={{ background: '#D6EBF2', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#000', marginBottom: 8 }}>POST /api/crm/leads</div>
            <div style={{ background: '#D6EBF2', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#000', whiteSpace: 'pre' as const }}>
{`{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@practice.com",
  "phone": "(555) 123-4567",
  "practice_name": "Smith Orthopedics",
  "specialty": "orthopedics",
  "source": "website_chat"
}`}</div>
          </div>

          <div className="crm-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>Webhook API</h3>
            <p style={{ fontSize: 13, color: '#000', marginBottom: 12 }}>Receive events from external tools (Zapier, Make, etc).</p>
            <div style={{ background: '#D6EBF2', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#000', marginBottom: 8 }}>POST /api/crm/webhook</div>
            <div style={{ fontSize: 13, color: '#000', marginTop: 8 }}>Supported events: <code>lead.create</code>, <code>lead.update</code>, <code>activity.create</code>, <code>meeting.create</code></div>
          </div>

          <div className="crm-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>Workflow Automation</h3>
            <p style={{ fontSize: 13, color: '#000', marginBottom: 12 }}>Edge Function runs workflows, stale alerts, and forecast snapshots.</p>
            <div style={{ background: '#D6EBF2', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#000' }}>POST https://twvmglnkahuitvdttawq.supabase.co/functions/v1/run-workflows</div>
            <p style={{ fontSize: 12, color: '#000', marginTop: 8 }}>Set up a cron job (e.g., every 5 minutes) to call this endpoint for automatic workflow execution.</p>
          </div>

          <div className="crm-card">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>Outlook Calendar</h3>
            <p style={{ fontSize: 13, color: '#000', marginBottom: 12 }}>To connect Outlook Calendar, set up a Microsoft Azure AD app and configure:</p>
            <div style={{ fontSize: 13, color: '#000' }}>
              1. Register app at <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00B5D6' }}>portal.azure.com</a><br/>
              2. Add Calendar.ReadWrite permission<br/>
              3. Set env vars: <code>MICROSOFT_CLIENT_ID</code>, <code>MICROSOFT_CLIENT_SECRET</code><br/>
              4. Meetings will auto-sync to Outlook
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Team Members ({users.length})</h3>
            <button onClick={() => setShowAddUser(!showAddUser)} className="crm-btn crm-btn-primary">+ Add User</button>
          </div>
          {showAddUser && (
            <form onSubmit={addUser} className="crm-card" style={{ marginBottom: 16, border: '1px solid #00B5D6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input name="name" placeholder="Full name *" required className="crm-input" />
                <input name="email" placeholder="Email *" type="email" required className="crm-input" />
                <input name="password" placeholder="Password *" required className="crm-input" />
                <select name="role" className="crm-select">
                  <option value="sales">Sales</option><option value="marketing">Marketing</option>
                  <option value="admin">Admin</option><option value="viewer">Viewer</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="crm-btn crm-btn-primary">Add User</button>
                <button type="button" onClick={() => setShowAddUser(false)} className="crm-btn crm-btn-secondary">Cancel</button>
              </div>
            </form>
          )}
          <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="crm-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Status</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: u.role === 'admin' ? '#00B5D6' : '#D6EBF2', color: u.role === 'admin' ? '#fff' : '#000', textTransform: 'capitalize' }}>{u.role}</span></td>
                    <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                    <td><button onClick={() => toggleUser(u.id, !u.is_active)} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: u.is_active ? '#00B5D6' : '#E6E6E6', color: u.is_active ? '#fff' : '#000' }}>{u.is_active ? 'Active' : 'Disabled'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Webhooks ({webhooks.length})</h3>
            <button onClick={() => setShowAddWebhook(!showAddWebhook)} className="crm-btn crm-btn-primary">+ Add Webhook</button>
          </div>
          {showAddWebhook && (
            <form onSubmit={addWebhook} className="crm-card" style={{ marginBottom: 16, border: '1px solid #00B5D6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <input name="name" placeholder="Webhook name *" required className="crm-input" />
                <input name="url" placeholder="Endpoint URL *" type="url" required className="crm-input" />
                <input name="secret" placeholder="Secret (optional)" className="crm-input" />
                <input name="events" placeholder="Events: lead.create, deal_won" className="crm-input" />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="crm-btn crm-btn-primary">Add Webhook</button>
                <button type="button" onClick={() => setShowAddWebhook(false)} className="crm-btn crm-btn-secondary">Cancel</button>
              </div>
            </form>
          )}
          {webhooks.length === 0 ? (
            <div className="crm-card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#000', marginBottom: 12 }}>No webhooks configured</p>
              <button onClick={() => setShowAddWebhook(true)} className="crm-btn crm-btn-primary">Add your first webhook</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {webhooks.map(w => (
                <div key={w.id} className="crm-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: '#000', marginTop: 2, fontFamily: 'monospace' }}>{w.url}</div>
                    <div style={{ fontSize: 11, color: '#000', marginTop: 4 }}>Events: {w.events.join(', ') || 'all'} · {w.success_count} sent · {w.fail_count} failed</div>
                  </div>
                  <button onClick={() => toggleWebhook(w.id, !w.is_active)} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: w.is_active ? '#00B5D6' : '#E6E6E6', color: w.is_active ? '#fff' : '#000' }}>{w.is_active ? 'Active' : 'Paused'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'scoring' && (
        <div>
          <div className="crm-card">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>AI Lead Scoring Rules</h3>
            <table className="crm-table">
              <thead><tr><th>Signal</th><th style={{ textAlign: 'right' }}>Points</th></tr></thead>
              <tbody>
                {scoringRules.map((r, i) => (
                  <tr key={i}><td>{r.signal}</td><td style={{ textAlign: 'right', fontWeight: 600, color: '#00B5D6' }}>{r.points}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, fontSize: 13, color: '#000' }}>
              Temperature: <span style={{ fontWeight: 600, color: '#00B5D6' }}>Hot</span> = 75+, <span style={{ fontWeight: 600, color: '#68D1E6' }}>Warm</span> = 45-74, <span style={{ fontWeight: 600, color: '#E6E6E6' }}>Cold</span> = 0-44
            </div>
          </div>
          <div className="crm-card" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000' }}>Pipeline Stages</h3>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'].map((s, i) => (
                <div key={s} style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: s === 'lost' ? '#E6E6E6' : '#00B5D6', color: s === 'lost' ? '#000' : '#fff', opacity: 0.4 + (i * 0.1), textTransform: 'capitalize' }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
