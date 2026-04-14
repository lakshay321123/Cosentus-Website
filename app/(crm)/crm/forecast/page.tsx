'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'

const stageWeights: Record<string, number> = { new: 0.05, qualified: 0.15, discovery: 0.3, proposal: 0.5, negotiation: 0.75, won: 1.0 }

export default function ForecastPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').not('status', 'eq', 'lost').order('revenue_potential', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  const pipeline = leads.filter(l => l.status !== 'won')
  const won = leads.filter(l => l.status === 'won')

  // Weighted pipeline
  const weightedTotal = pipeline.reduce((s, l) => s + (l.revenue_potential || 0) * (stageWeights[l.status] || 0.1), 0)
  const rawTotal = pipeline.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const wonTotal = won.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const avgDealSize = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.revenue_potential || 0), 0) / leads.length) : 0

  // Monthly forecast (weighted + won)
  const month1 = Math.round(wonTotal + weightedTotal * 0.4)
  const month2 = Math.round(wonTotal + weightedTotal * 0.7)
  const month3 = Math.round(wonTotal + weightedTotal)

  // By stage
  const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
  const stageData = stages.map(s => {
    const stageLeads = leads.filter(l => l.status === s)
    const total = stageLeads.reduce((sum, l) => sum + (l.revenue_potential || 0), 0)
    const weighted = total * (stageWeights[s] || 0)
    return { stage: s, count: stageLeads.length, total, weighted, pct: stageWeights[s] || 0 }
  })

  // By rep
  const repMap: Record<string, { total: number; weighted: number; deals: number }> = {}
  leads.forEach(l => {
    const rep = l.assigned_to || 'Unassigned'
    if (!repMap[rep]) repMap[rep] = { total: 0, weighted: 0, deals: 0 }
    repMap[rep].total += l.revenue_potential || 0
    repMap[rep].weighted += (l.revenue_potential || 0) * (stageWeights[l.status] || 0)
    repMap[rep].deals++
  })

  if (loading) return <div style={{ padding: 40, color: '#000000' }}>Loading forecast...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: '100%', boxSizing: 'border-box' as const }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#000000', margin: 0 }}>Revenue Forecast</h1>
        <p style={{ fontSize: 14, color: '#000000', margin: '4px 0 0' }}>AI-weighted pipeline predictions based on stage probability</p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Raw Pipeline', value: `$${Math.round(rawTotal / 1000)}K`, sub: `${pipeline.length} deals` },
          { label: 'Weighted Forecast', value: `$${Math.round(weightedTotal / 1000)}K` },
          { label: 'Won Revenue', value: `$${Math.round(wonTotal / 1000)}K`, sub: `${won.length} closed` },
          { label: 'Avg Deal Size', value: `$${Math.round(avgDealSize / 1000)}K`, sub: '/month' },
        ].map((s, i) => (
          <div key={i} className="crm-stat">
            <div className="crm-stat-label">{s.label}</div>
            <div className="crm-stat-value">{s.value}</div>
            {s.sub && <div className="crm-stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Monthly projection */}
      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Monthly Revenue Projection</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'This Month', value: month1, pct: 40 },
            { label: 'Next Month', value: month2, pct: 70 },
            { label: 'Month 3', value: month3, pct: 100 },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 16px', borderRadius: 12, background: '#fff', border: '1px solid #E6E6E6' }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#00B5D6', lineHeight: 1 }}>${Math.round(m.value / 1000)}K</div>
              <div style={{ fontSize: 13, color: '#000000', marginTop: 8 }}>{m.label}</div>
              <div style={{ width: '80%', height: 4, borderRadius: 2, background: '#E6E6E6', margin: '12px auto 0', overflow: 'hidden' }}>
                <div style={{ width: `${m.pct}%`, height: '100%', background: '#00B5D6', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 11, color: '#000000', marginTop: 6 }}>{m.pct}% of pipeline</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* By stage */}
        <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Forecast by Stage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stageData.map(s => (
              <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 90, fontSize: 12, color: '#000000', textTransform: 'capitalize', textAlign: 'right' }}>{s.stage}</div>
                <div style={{ flex: 1, height: 24, background: '#f7f7f7', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${rawTotal > 0 ? (s.total / rawTotal) * 100 : 0}%`, height: '100%', background: '#E6E6E6', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: `${rawTotal > 0 ? (s.weighted / rawTotal) * 100 : 0}%`, height: '100%', background: '#00B5D6', borderRadius: 4 }} />
                </div>
                <div style={{ minWidth: 60, textAlign: 'right', fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: '#00B5D6' }}>${Math.round(s.weighted / 1000)}K</span>
                  <span style={{ color: '#000000' }}> / ${Math.round(s.total / 1000)}K</span>
                </div>
                <div style={{ width: 32, fontSize: 11, color: '#000000', textAlign: 'right' }}>{Math.round(s.pct * 100)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* By rep */}
        <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #E6E6E6, 0 4px 12px #D6EBF2', padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Forecast by Rep</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid #E6E6E6' }}>
                {['Rep', 'Deals', 'Raw', 'Weighted'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Rep' ? 'left' : 'right', padding: '8px 0', fontWeight: 500, color: '#000000', fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(repMap).sort((a, b) => b[1].weighted - a[1].weighted).map(([rep, data]) => (
                <tr key={rep} style={{ borderBottom: '0.5px solid #E6E6E6' }}>
                  <td style={{ padding: '10px 0', fontWeight: 500 }}>{rep}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right' }}>{data.deals}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: '#000000' }}>${Math.round(data.total / 1000)}K</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, color: '#00B5D6' }}>${Math.round(data.weighted / 1000)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
