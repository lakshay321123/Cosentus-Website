'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { supabase, Lead } from '@/lib/supabase'

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let start = 0
    const duration = 800
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (value - start) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>
}

function Notification({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, background: '#ffffff',  borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: 340, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6' }}>New Lead</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E6E6E6', fontSize: 16 }}>×</button>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#000000' }}>{lead.first_name} {lead.last_name}</div>
      <div style={{ fontSize: 13, color: '#CCCCCC' }}>{lead.practice_name}</div>
    </div>
  )
}

const stageColors: Record<string, string> = {
  new: '#E6E6E6', qualified: '#36C2DE', discovery: '#00B5D6', proposal: '#36C2DE', negotiation: '#36C2DE', won: '#00B5D6',
}

export default function CRMDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newLeadNotif, setNewLeadNotif] = useState<Lead | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('*').order('ai_score', { ascending: false }),
      supabase.from('activities').select('*, lead:leads(first_name, last_name)').order('created_at', { ascending: false }).limit(8),
      supabase.from('tasks').select('*, lead:leads(first_name, last_name)').eq('status', 'pending').order('due_date', { ascending: true }).limit(5),
    ]).then(([lRes, aRes, tRes]) => {
      if (lRes.data) setLeads(lRes.data as Lead[])
      if (aRes.data) setActivities(aRes.data)
      if (tRes.data) setTasks(tRes.data)
      setLoading(false)
    })

    const channel = supabase.channel('crm-dash')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (p) => {
        setLeads(prev => [p.new as Lead, ...prev])
        setNewLeadNotif(p.new as Lead)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (p) => {
        setLeads(prev => prev.map(l => l.id === (p.new as Lead).id ? p.new as Lead : l))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const total = leads.length
  const hot = leads.filter(l => l.temperature === 'hot').length
  const pipeline = leads.filter(l => !['won', 'lost'].includes(l.status))
  const pipelineVal = pipeline.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const wonVal = leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const convRate = total > 0 ? Math.round((leads.filter(l => l.status === 'won').length / total) * 100) : 0

  const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
  const stageData = stages.map(s => ({ stage: s, count: leads.filter(l => l.status === s).length, value: leads.filter(l => l.status === s).reduce((sum, l) => sum + (l.revenue_potential || 0), 0) }))

  const typeIcons: Record<string, string> = { call: '📞', email: '✉️', chat: '💬', meeting: '📅', note: '📝', status_change: '↻', task: '☑️' }

  if (loading) return <div style={{ padding: 48, color: '#CCCCCC', fontSize: 15 }}>Loading...</div>

  return (
    <>
      {newLeadNotif && <Notification lead={newLeadNotif} onClose={() => setNewLeadNotif(null)} />}
      <div style={{ padding: '36px 44px', maxWidth: 1400 }}>
        {/* Header */}
        <div className="crm-animate-in" style={{ marginBottom: 32 }}>
          <h1 className="crm-h1">Dashboard</h1>
          <p className="crm-subtitle">Overview of your sales pipeline</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Leads', value: total, prefix: '' },
            { label: 'Hot Leads', value: hot, accent: true },
            { label: 'Pipeline', value: Math.round(pipelineVal / 1000), prefix: '$', suffix: 'K' },
            { label: 'Won Revenue', value: Math.round(wonVal / 1000), prefix: '$', suffix: 'K' },
            { label: 'Win Rate', value: convRate, suffix: '%' },
          ].map((s, i) => (
            <div key={i} className={`crm-stat crm-animate-in crm-animate-in-${i + 1} ${s.accent ? 'accent' : ''}`}>
              <div className="crm-stat-label">{s.label}</div>
              <div className="crm-stat-value"><AnimatedNumber value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} /></div>
            </div>
          ))}
        </div>

        {/* Pipeline chart */}
        <div className="crm-card crm-animate-in crm-animate-in-3" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="crm-h2">Pipeline</h2>
            <Link href="/crm/pipeline" className="crm-btn-ghost" style={{ fontSize: 13, textDecoration: 'none' }}>View Board →</Link>
          </div>
          {/* Animated bar */}
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', height: 36, marginBottom: 16, background: 'rgba(0,0,0,0.02)' }}>
            {stageData.filter(s => s.count > 0).map((s, i) => (
              <div key={i} className="crm-chart-bar" style={{ flex: s.count, background: stageColors[s.stage], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', minWidth: 36 }}>{s.count}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {stageData.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#CCCCCC' }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: stageColors[s.stage] }} />
                <span style={{ textTransform: 'capitalize' }}>{s.stage}</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>${Math.round(s.value / 1000)}K</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          {/* Recent leads */}
          <div className="crm-card crm-animate-in crm-animate-in-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="crm-h2">Recent Leads</h2>
              <Link href="/crm/leads" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
            </div>
            <table className="crm-table">
              <thead><tr>
                <th>Contact</th><th>Score</th><th>Temp</th><th style={{ textAlign: 'right' }}>Value</th>
              </tr></thead>
              <tbody>
                {leads.slice(0, 6).map(l => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/crm/leads/${l.id}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>{l.first_name} {l.last_name}</Link>
                      <div style={{ fontSize: 12, color: '#CCCCCC', marginTop: 1 }}>{l.practice_name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="crm-score-bar" style={{ width: 40 }}>
                          <div className="crm-score-fill" style={{ width: `${l.ai_score}%`, background: l.ai_score >= 80 ? '#00B5D6' : l.ai_score >= 50 ? '#68D1E6' : '#E6E6E6' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: l.ai_score >= 80 ? '#00B5D6' : l.ai_score >= 50 ? '#68D1E6' : '#E6E6E6' }}>{l.ai_score}</span>
                      </div>
                    </td>
                    <td><span className={`crm-badge crm-badge-${l.temperature}`}>{l.temperature}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${l.revenue_potential ? Math.round(l.revenue_potential / 1000) + 'K' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column: activity + tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Activity */}
            <div className="crm-card crm-animate-in crm-animate-in-4" style={{ flex: 1 }}>
              <h2 className="crm-h2" style={{ marginBottom: 14 }}>Activity</h2>
              {activities.length === 0 ? (
                <div style={{ fontSize: 14, color: '#E6E6E6', textAlign: 'center', padding: 24 }}>No activity yet</div>
              ) : activities.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < activities.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <span style={{ fontSize: 13, width: 18 }}>{typeIcons[a.type] || '•'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#000000', lineHeight: 1.4 }}>
                      {a.lead && <strong>{a.lead.first_name} {a.lead.last_name}</strong>}
                      {a.lead && ' — '}<span style={{ color: '#CCCCCC' }}>{a.description?.substring(0, 60)}{(a.description?.length || 0) > 60 ? '...' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tasks */}
            <div className="crm-card crm-animate-in crm-animate-in-5">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 className="crm-h2">Tasks Due</h2>
                <Link href="/crm/tasks" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none' }}>All →</Link>
              </div>
              {tasks.length === 0 ? (
                <div style={{ fontSize: 14, color: '#E6E6E6', textAlign: 'center', padding: 16 }}>No pending tasks</div>
              ) : tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.priority === 'high' ? '#616161' : t.priority === 'medium' ? '#68D1E6' : '#36C2DE', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#000000' }}>{t.title}</div>
                    {t.lead && <div style={{ fontSize: 12, color: '#CCCCCC' }}>{t.lead.first_name} {t.lead.last_name}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
