'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  if (loading) return <div style={{ padding: 48, color: '#000000' }}>Loading...</div>

  const total = leads.length
  const won = leads.filter(l => l.status === 'won')
  const pipeline = leads.filter(l => !['won', 'lost'].includes(l.status))
  const pipelineVal = pipeline.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const wonVal = won.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const convRate = total > 0 ? ((won.length / total) * 100).toFixed(1) : '0'
  const avgScore = total > 0 ? Math.round(leads.reduce((s, l) => s + l.ai_score, 0) / total) : 0
  const hotLeads = leads.filter(l => l.temperature === 'hot').length

  // Source data
  const sources: Record<string, number> = {}
  leads.forEach(l => { const s = l.source?.replace('_', ' ') || 'other'; sources[s] = (sources[s] || 0) + 1 })
  const sourceEntries = Object.entries(sources).sort((a, b) => b[1] - a[1])
  const maxSource = Math.max(...sourceEntries.map(s => s[1]), 1)

  // Specialty data
  const specs: Record<string, { count: number; value: number }> = {}
  leads.forEach(l => { const s = l.specialty?.replace('_', ' ') || 'other'; if (!specs[s]) specs[s] = { count: 0, value: 0 }; specs[s].count++; specs[s].value += l.revenue_potential || 0 })
  const specEntries = Object.entries(specs).sort((a, b) => b[1].value - a[1].value)

  // Stage funnel
  const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
  const stageData = stages.map(s => ({ stage: s, count: leads.filter(l => l.status === s).length }))
  const maxStage = Math.max(...stageData.map(s => s.count), 1)

  // Rep data
  const reps: Record<string, { count: number; won: number; value: number }> = {}
  leads.forEach(l => { const r = l.assigned_to || 'Unassigned'; if (!reps[r]) reps[r] = { count: 0, won: 0, value: 0 }; reps[r].count++; if (l.status === 'won') reps[r].won++; reps[r].value += l.revenue_potential || 0 })

  // Donut chart colors
  const donutColors = ['#00B5D6', '#36C2DE', '#36C2DE', '#CCCCCC', '#68D1E6', '#00B5D6', '#616161', '#E6E6E6']

  // Build donut SVG
  const donutTotal = sourceEntries.reduce((s, e) => s + e[1], 0) || 1
  let donutAngle = 0
  const donutSlices = sourceEntries.map((e, i) => {
    const pct = e[1] / donutTotal
    const startAngle = donutAngle
    donutAngle += pct * 360
    const endAngle = donutAngle
    const largeArc = pct > 0.5 ? 1 : 0
    const r = 80
    const cx = 100, cy = 100
    const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180)
    const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180)
    const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180)
    const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180)
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: donutColors[i % donutColors.length], label: e[0], pct: Math.round(pct * 100) }
  })

  const statIcon = (d: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%' }}>
      <div className="crm-animate-in" style={{ marginBottom: 28 }}>
        <h1 className="crm-h1">Analytics</h1>
        <p className="crm-subtitle">All Leads · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* Stat row — MedCloud style: large teal numbers, description below, icon top-right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Pipeline Value', value: `$${Math.round(pipelineVal / 1000)}K`, desc: 'Active pipeline total', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
          { label: 'Conversion Rate', value: `${convRate}%`, desc: 'Won ÷ Total leads', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
          { label: 'Avg AI Score', value: `${avgScore}`, desc: 'Average lead score (0–100)', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
          { label: 'Hot Leads', value: `${hotLeads}`, desc: 'Score ≥ 75', icon: 'M17.66 11.2a8 8 0 01.08 7.21l-.22.45a8 8 0 01-6.87 4.14h-.68a8 8 0 01-6.87-4.14l-.22-.45a8 8 0 01.08-7.21L8 4.5l1-1 3 3.49L15 4.5l1 1z' },
          { label: 'Won Revenue', value: `$${Math.round(wonVal / 1000)}K`, desc: 'Closed won total', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
        ].map((s, i) => (
          <div key={i} className={`crm-stat crm-animate-in crm-animate-in-${i + 1}`}>
            <div className="crm-stat-icon">{statIcon(s.icon)}</div>
            <div className="crm-stat-label">{s.label}</div>
            <div className="crm-stat-value">{s.value}</div>
            <div className="crm-stat-sub">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1: Funnel + Source donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Conversion Funnel */}
        <div className="crm-card crm-animate-in crm-animate-in-3">
          <h2 className="crm-h2" style={{ marginBottom: 20 }}>Conversion Funnel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stageData.map((s, i) => (
              <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontSize: 13, color: '#000000', textAlign: 'right', textTransform: 'capitalize' }}>{s.stage}</div>
                <div style={{ flex: 1, height: 28, background: '#D6EBF2', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${(s.count / maxStage) * 100}%`, height: '100%', background: i === stages.length - 1 ? '#00B5D6' : '#00B5D6', borderRadius: 8, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10, minWidth: s.count > 0 ? 36 : 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Mix — Donut chart */}
        <div className="crm-card crm-animate-in crm-animate-in-4">
          <h2 className="crm-h2" style={{ marginBottom: 20 }}>Lead Sources</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg viewBox="0 0 200 200" width="180" height="180">
              {donutSlices.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.85} />)}
              <circle cx="100" cy="100" r="45" fill="#fff" />
              <text x="100" y="96" textAnchor="middle" fontSize="22" fontWeight="600" fill="#000000">{total}</text>
              <text x="100" y="114" textAnchor="middle" fontSize="11" fill="#CCCCCC">Total</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sourceEntries.map((e, i) => (
                <div key={e[0]} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: donutColors[i % donutColors.length] }} />
                  <span style={{ color: '#000000', textTransform: 'capitalize' }}>{e[0]}</span>
                  <span style={{ fontWeight: 600, color: '#000000' }}>{Math.round((e[1] / donutTotal) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2: Specialty bars + Rep performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pipeline by Specialty — horizontal bars */}
        <div className="crm-card crm-animate-in crm-animate-in-4">
          <h2 className="crm-h2" style={{ marginBottom: 20 }}>Pipeline by Specialty</h2>
          {specEntries.map((e, i) => {
            const maxVal = Math.max(...specEntries.map(s => s[1].value), 1)
            return (
              <div key={e[0]} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 100, fontSize: 13, color: '#000000', textAlign: 'right', textTransform: 'capitalize' }}>{e[0]}</div>
                <div style={{ flex: 1, height: 24, background: '#D6EBF2', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${(e[1].value / maxVal) * 100}%`, height: '100%', background: donutColors[i % donutColors.length], borderRadius: 6, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                </div>
                <div style={{ minWidth: 56, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#000000' }}>${Math.round(e[1].value / 1000)}K</div>
              </div>
            )
          })}
        </div>

        {/* Rep Performance */}
        <div className="crm-card crm-animate-in crm-animate-in-5">
          <h2 className="crm-h2" style={{ marginBottom: 20 }}>Rep Performance</h2>
          <table className="crm-table">
            <thead><tr>
              <th>Rep</th><th style={{ textAlign: 'right' }}>Leads</th><th style={{ textAlign: 'right' }}>Won</th><th style={{ textAlign: 'right' }}>Win %</th><th style={{ textAlign: 'right' }}>Pipeline</th>
            </tr></thead>
            <tbody>
              {Object.entries(reps).sort((a, b) => b[1].value - a[1].value).map(([rep, d]) => (
                <tr key={rep}>
                  <td style={{ fontWeight: 500 }}>{rep}</td>
                  <td style={{ textAlign: 'right' }}>{d.count}</td>
                  <td style={{ textAlign: 'right', color: '#00B5D6', fontWeight: 600 }}>{d.won}</td>
                  <td style={{ textAlign: 'right' }}>{d.count > 0 ? Math.round((d.won / d.count) * 100) : 0}%</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#00B5D6' }}>${Math.round(d.value / 1000)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
