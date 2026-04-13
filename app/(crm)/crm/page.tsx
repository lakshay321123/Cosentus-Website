'use client'

import { useState } from 'react'
import Link from 'next/link'

/* Mock data — will be replaced with Supabase queries */
const mockStats = {
  totalLeads: 147,
  hotLeads: 23,
  pipelineValue: 842000,
  meetingsThisWeek: 8,
  conversionRate: 34,
  avgCycleTime: 18,
}

const mockPipeline = [
  { stage: 'New', count: 34, value: 120000, color: '#CCCCCC' },
  { stage: 'Qualified', count: 28, value: 195000, color: '#68D1E6' },
  { stage: 'Discovery', count: 19, value: 210000, color: '#36C2DE' },
  { stage: 'Proposal', count: 12, value: 168000, color: '#00B5D6' },
  { stage: 'Negotiation', count: 7, value: 149000, color: '#009BB8' },
]

const mockRecentLeads = [
  { id: '1', name: 'Dr. Sarah Chen', practice: 'Bay Area Anesthesia Group', specialty: 'Anesthesia', score: 92, temp: 'hot' as const, source: 'Website Chat', time: '12 min ago' },
  { id: '2', name: 'Michael Torres', practice: 'Spine & Pain Institute', specialty: 'Pain Management', score: 78, temp: 'warm' as const, source: 'Voice Agent', time: '1 hr ago' },
  { id: '3', name: 'Dr. Priya Patel', practice: 'Summit Orthopedics', specialty: 'Orthopedics', score: 85, temp: 'hot' as const, source: 'Contact Form', time: '2 hrs ago' },
  { id: '4', name: 'James Wilson', practice: 'ClearMind Behavioral', specialty: 'Behavioral Health', score: 64, temp: 'warm' as const, source: 'Referral', time: '4 hrs ago' },
  { id: '5', name: 'Lisa Rodriguez', practice: 'Pacific Surgery Center', specialty: 'ASC', score: 45, temp: 'cold' as const, source: 'LinkedIn', time: '1 day ago' },
]

const mockMeetings = [
  { id: '1', lead: 'Dr. Sarah Chen', type: 'Discovery Call', time: 'Today 2:00 PM', status: 'scheduled' },
  { id: '2', lead: 'Dr. Priya Patel', type: 'Demo', time: 'Today 4:30 PM', status: 'scheduled' },
  { id: '3', lead: 'Michael Torres', type: 'Follow Up', time: 'Tomorrow 10:00 AM', status: 'scheduled' },
]

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? '#00B5D6' : 'white',
      borderRadius: 12, padding: '24px 20px',
      border: accent ? 'none' : '1px solid #E6E6E6',
    }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: accent ? 'rgba(255,255,255,0.7)' : '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color: accent ? 'white' : '#000', fontFamily: "'Reddit Sans', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.6)' : '#CCCCCC', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function TempBadge({ temp }: { temp: 'hot' | 'warm' | 'cold' }) {
  const colors = { hot: { bg: '#FAECE7', text: '#993C1D' }, warm: { bg: '#FAEEDA', text: '#854F0B' }, cold: { bg: '#E6F1FB', text: '#185FA5' } }
  const c = colors[temp]
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

export default function CRMDashboard() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Real-time overview of your sales pipeline</p>
        </div>
        <button style={{
          background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8,
          padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'Reddit Sans', sans-serif",
        }}>
          + Add Lead
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard label="Total Leads" value={mockStats.totalLeads.toString()} />
        <StatCard label="Hot Leads" value={mockStats.hotLeads.toString()} accent />
        <StatCard label="Pipeline Value" value={`$${(mockStats.pipelineValue / 1000).toFixed(0)}K`} sub="Monthly recurring" />
        <StatCard label="Meetings" value={mockStats.meetingsThisWeek.toString()} sub="This week" />
        <StatCard label="Conversion" value={`${mockStats.conversionRate}%`} sub="Last 30 days" />
        <StatCard label="Avg Cycle" value={`${mockStats.avgCycleTime}d`} sub="Days to close" />
      </div>

      {/* Pipeline mini-bar */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '24px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Pipeline Overview</h2>
          <Link href="/crm/pipeline" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View Full Pipeline →</Link>
        </div>
        {/* Bar */}
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 32, marginBottom: 16 }}>
          {mockPipeline.map((s, i) => (
            <div key={i} style={{ flex: s.count, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'white', minWidth: 40, transition: 'flex 0.3s' }} title={`${s.stage}: ${s.count} leads`}>
              {s.count}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {mockPipeline.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#616161' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              {s.stage} <span style={{ fontWeight: 600, color: '#000' }}>${(s.value / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: Recent Leads + Upcoming Meetings */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Recent Leads */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: 0 }}>Recent Leads</h2>
            <Link href="/crm/leads" style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E6E6E6' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialty</th>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</th>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temp</th>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 500, color: '#616161', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>When</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F5F5F5', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFAFA' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ fontWeight: 500, color: '#000' }}>{lead.name}</div>
                    <div style={{ fontSize: 12, color: '#616161' }}>{lead.practice}</div>
                  </td>
                  <td style={{ padding: '12px 0', color: '#616161' }}>{lead.specialty}</td>
                  <td style={{ padding: '12px 0' }}><ScoreBadge score={lead.score} /></td>
                  <td style={{ padding: '12px 0' }}><TempBadge temp={lead.temp} /></td>
                  <td style={{ padding: '12px 0', color: '#616161' }}>{lead.source}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: '#CCCCCC', fontSize: 12 }}>{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Meetings */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000', margin: '0 0 20px' }}>Upcoming Meetings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockMeetings.map(m => (
              <div key={m.id} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid #E6E6E6', transition: 'border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00B5D6' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6E6E6' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#000', marginBottom: 4 }}>{m.lead}</div>
                <div style={{ fontSize: 12, color: '#616161' }}>{m.type}</div>
                <div style={{ fontSize: 12, color: '#00B5D6', fontWeight: 500, marginTop: 6 }}>{m.time}</div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: 16, padding: '10px',
            background: 'transparent', border: '1px dashed #CCCCCC',
            borderRadius: 8, fontSize: 13, color: '#616161', cursor: 'pointer',
            fontFamily: "'Reddit Sans', sans-serif",
          }}>
            + Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  )
}
