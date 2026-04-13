'use client'

import { useState, useEffect } from 'react'
import { supabase, Lead } from '@/lib/supabase'

const specLabels: Record<string, string> = {
  anesthesia: 'Anesthesia', orthopedics: 'Orthopedics', pain_management: 'Pain Mgmt',
  asc: 'ASC', behavioral_health: 'Behavioral', urgent_care: 'Urgent Care', obgyn: 'OBGYN', other: 'Other',
}
const sourceLabels: Record<string, string> = {
  website_chat: 'Website Chat', voice_agent: 'Voice Agent', contact_form: 'Contact Form',
  referral: 'Referral', linkedin: 'LinkedIn', event: 'Event', email: 'Email', other: 'Other',
}
const stageOrder = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost']

function BarChart({ data, color }: { data: { label: string; value: number; pct: number }[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 100, fontSize: 12, color: '#616161', textAlign: 'right', flexShrink: 0 }}>{d.label}</div>
          <div style={{ flex: 1, height: 24, background: '#F5F5F5', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${d.pct}%`, height: '100%', background: color, borderRadius: 4, minWidth: d.pct > 0 ? 4 : 0, transition: 'width 0.6s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
              {d.pct > 15 && <span style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{d.value}</span>}
            </div>
          </div>
          {d.pct <= 15 && <span style={{ fontSize: 12, fontWeight: 600, color: '#616161', minWidth: 24 }}>{d.value}</span>}
        </div>
      ))}
    </div>
  )
}

function FunnelChart({ data }: { data: { stage: string; count: number; pct: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 90, fontSize: 12, color: '#616161', textAlign: 'right', textTransform: 'capitalize', flexShrink: 0 }}>{d.stage}</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: `${Math.max(d.pct, 10)}%`, height: 32, borderRadius: 4,
              background: `rgba(0,181,214,${0.3 + (d.pct / 100) * 0.7})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'width 0.6s ease',
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: d.pct > 40 ? 'white' : '#00B5D6' }}>{d.count} ({d.pct}%)</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })
  }, [])

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading analytics...</div>

  const total = leads.length
  const hotCount = leads.filter(l => l.temperature === 'hot').length
  const totalPipeline = leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const wonRevenue = leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const avgScore = total > 0 ? Math.round(leads.reduce((s, l) => s + l.ai_score, 0) / total) : 0

  // Source breakdown
  const sourceCounts: Record<string, number> = {}
  leads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1 })
  const sourceData = Object.entries(sourceCounts).map(([k, v]) => ({ label: sourceLabels[k] || k, value: v, pct: Math.round((v / total) * 100) })).sort((a, b) => b.value - a.value)

  // Specialty breakdown
  const specCounts: Record<string, number> = {}
  leads.forEach(l => { specCounts[l.specialty] = (specCounts[l.specialty] || 0) + 1 })
  const specData = Object.entries(specCounts).map(([k, v]) => ({ label: specLabels[k] || k, value: v, pct: Math.round((v / total) * 100) })).sort((a, b) => b.value - a.value)

  // Specialty revenue
  const specRevenue: Record<string, number> = {}
  leads.forEach(l => { specRevenue[l.specialty] = (specRevenue[l.specialty] || 0) + (l.revenue_potential || 0) })
  const maxRev = Math.max(...Object.values(specRevenue), 1)
  const specRevData = Object.entries(specRevenue).map(([k, v]) => ({ label: specLabels[k] || k, value: Math.round(v / 1000), pct: Math.round((v / maxRev) * 100) })).sort((a, b) => b.value - a.value)

  // Funnel
  const funnelData = stageOrder.filter(s => s !== 'lost').map(s => {
    const count = leads.filter(l => l.status === s).length
    return { stage: s, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }
  })

  // Rep performance
  const repCounts: Record<string, { total: number; won: number; pipeline: number }> = {}
  leads.forEach(l => {
    const rep = l.assigned_to || 'Unassigned'
    if (!repCounts[rep]) repCounts[rep] = { total: 0, won: 0, pipeline: 0 }
    repCounts[rep].total++
    if (l.status === 'won') repCounts[rep].won++
    repCounts[rep].pipeline += l.revenue_potential || 0
  })

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Pipeline intelligence — {total} leads analyzed</p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total Leads', value: total.toString() },
          { label: 'Hot Leads', value: hotCount.toString(), accent: true },
          { label: 'Pipeline', value: `$${Math.round(totalPipeline / 1000)}K` },
          { label: 'Won Revenue', value: `$${Math.round(wonRevenue / 1000)}K` },
          { label: 'Avg AI Score', value: avgScore.toString() },
        ].map((s, i) => (
          <div key={i} style={{ background: s.accent ? '#00B5D6' : 'white', borderRadius: 12, padding: '20px', border: s.accent ? 'none' : '1px solid #E6E6E6' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: s.accent ? 'rgba(255,255,255,0.7)' : '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 300, color: s.accent ? 'white' : '#000', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Source breakdown */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#616161' }}>Lead Sources</h3>
          <BarChart data={sourceData} color="#00B5D6" />
        </div>

        {/* Specialty breakdown */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#616161' }}>By Specialty</h3>
          <BarChart data={specData} color="#36C2DE" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Conversion funnel */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#616161' }}>Conversion Funnel</h3>
          <FunnelChart data={funnelData} />
        </div>

        {/* Revenue by specialty */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#616161' }}>Revenue by Specialty ($K/mo)</h3>
          <BarChart data={specRevData} color="#009BB8" />
        </div>
      </div>

      {/* Rep performance */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#616161' }}>Rep Performance</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E6E6' }}>
              {['Rep', 'Total Leads', 'Won', 'Win Rate', 'Pipeline Value'].map(h => (
                <th key={h} style={{ textAlign: h === 'Pipeline Value' ? 'right' : 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(repCounts).sort((a, b) => b[1].pipeline - a[1].pipeline).map(([rep, data]) => (
              <tr key={rep} style={{ borderBottom: '1px solid #F5F5F5' }}>
                <td style={{ padding: '10px 0', fontWeight: 500 }}>{rep}</td>
                <td style={{ padding: '10px 0' }}>{data.total}</td>
                <td style={{ padding: '10px 0' }}>{data.won}</td>
                <td style={{ padding: '10px 0' }}>{data.total > 0 ? Math.round((data.won / data.total) * 100) : 0}%</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>${Math.round(data.pipeline / 1000)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
