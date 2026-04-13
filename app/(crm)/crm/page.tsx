'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase, Lead } from '@/lib/supabase'

function Notification({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 1000,
      background: 'white', borderRadius: 12, border: '1px solid #00B5D6',
      padding: '16px 20px', boxShadow: '0 8px 30px rgba(0,181,214,0.15)',
      maxWidth: 360, animation: 'slideIn 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New Lead</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCCCCC', fontSize: 16 }}>×</button>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{lead.first_name} {lead.last_name}</div>
      <div style={{ fontSize: 13, color: '#616161' }}>{lead.practice_name} · {lead.specialty?.replace('_', ' ')}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: lead.ai_score >= 75 ? '#FAECE7' : '#FAEEDA', color: lead.ai_score >= 75 ? '#993C1D' : '#854F0B' }}>
          Score: {lead.ai_score}
        </span>
        <Link href={`/crm/leads/${lead.id}`} style={{ fontSize: 12, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View →</Link>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? '#00B5D6' : 'white',
      borderRadius: 12, padding: '24px 20px',
      border: accent ? 'none' : '1px solid #E6E6E6',
    }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: accent ? 'rgba(255,255,255,0.7)' : '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color: accent ? 'white' : '#000', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.6)' : '#CCCCCC', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function TempBadge({ temp }: { temp: string }) {
  const colors: Record<string, { bg: string; text: string }> = { hot: { bg: '#FAECE7', text: '#993C1D' }, warm: { bg: '#FAEEDA', text: '#854F0B' }, cold: { bg: '#E6F1FB', text: '#185FA5' } }
  const c = colors[temp] || colors.cold
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{temp}</span>
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#00B5D6' : score >= 50 ? '#EF9F27' : '#CCCCCC'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E6E6E6', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{score}</span>
    </div>
  )
}

const stageColors: Record<string, string> = {
  new: '#CCCCCC', qualified: '#68D1E6', discovery: '#36C2DE',
  proposal: '#00B5D6', negotiation: '#009BB8', won: '#00B5D6',
}

const sourceLabels: Record<string, string> = {
  website_chat: 'Website Chat', voice_agent: 'Voice Agent', contact_form: 'Contact Form',
  referral: 'Referral', linkedin: 'LinkedIn', event: 'Event', email: 'Email', other: 'Other',
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function CRMDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [newLeadNotif, setNewLeadNotif] = useState<Lead | null>(null)

  useEffect(() => {
    supabase.from('leads').select('*').order('ai_score', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })

    // Real-time: listen for new leads
    const channel = supabase
      .channel('crm-dashboard')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        const newLead = payload.new as Lead
        setLeads(prev => [newLead, ...prev])
        setNewLeadNotif(newLead)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        setLeads(prev => prev.map(l => l.id === (payload.new as Lead).id ? payload.new as Lead : l))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const totalLeads = leads.length
  const hotLeads = leads.filter(l => l.temperature === 'hot').length
  const pipelineValue = leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const wonLeads = leads.filter(l => l.status === 'won').length
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

  const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won']
  const pipelineData = stages.map(s => ({
    stage: s.charAt(0).toUpperCase() + s.slice(1),
    count: leads.filter(l => l.status === s).length,
    value: leads.filter(l => l.status === s).reduce((sum, l) => sum + (l.revenue_potential || 0), 0),
    color: stageColors[s] || '#CCCCCC',
  }))

  const recentLeads = leads.slice(0, 6)

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading dashboard...</div>

  return (
    <>
      {newLeadNotif && <Notification lead={newLeadNotif} onClose={() => setNewLeadNotif(null)} />}
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Real-time overview — powered by Supabase</p>
        </div>
        <Link href="/crm/leads" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          + Add Lead
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard label="Total Leads" value={totalLeads.toString()} />
        <StatCard label="Hot Leads" value={hotLeads.toString()} accent />
        <StatCard label="Pipeline Value" value={`$${Math.round(pipelineValue / 1000)}K`} sub="Monthly potential" />
        <StatCard label="Won" value={wonLeads.toString()} sub="Closed deals" />
        <StatCard label="Conversion" value={`${conversionRate}%`} sub="Win rate" />
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Pipeline Overview</h2>
          <Link href="/crm/pipeline" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View Full Pipeline →</Link>
        </div>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 32, marginBottom: 16 }}>
          {pipelineData.filter(s => s.count > 0).map((s, i) => (
            <div key={i} style={{ flex: s.count, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'white', minWidth: 40 }}>{s.count}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {pipelineData.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#616161' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              {s.stage} <span style={{ fontWeight: 600, color: '#000' }}>${Math.round(s.value / 1000)}K</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Recent Leads</h2>
          <Link href="/crm/leads" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E6E6' }}>
              {['Contact', 'Specialty', 'Score', 'Temp', 'Stage', 'Source', 'Value'].map(h => (
                <th key={h} style={{ textAlign: h === 'Value' ? 'right' : 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #F5F5F5', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFA' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <td style={{ padding: '12px 0' }}>
                  <div style={{ fontWeight: 500, color: '#000' }}>{lead.first_name} {lead.last_name}</div>
                  <div style={{ fontSize: 12, color: '#616161' }}>{lead.practice_name}</div>
                </td>
                <td style={{ padding: '12px 0', color: '#616161' }}>{lead.specialty?.replace('_', ' ')}</td>
                <td style={{ padding: '12px 0' }}><ScoreBadge score={lead.ai_score} /></td>
                <td style={{ padding: '12px 0' }}><TempBadge temp={lead.temperature} /></td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 4, background: '#F5F5F5', color: '#616161', textTransform: 'capitalize' }}>{lead.status}</span>
                </td>
                <td style={{ padding: '12px 0', color: '#616161' }}>{sourceLabels[lead.source] || lead.source}</td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>${lead.revenue_potential ? Math.round(lead.revenue_potential / 1000) + 'K' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}
