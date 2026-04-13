'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1C1C1E', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#8E8E93', margin: '4px 0 0' }}>CRM configuration and integrations</p>
      </div>

      {/* Lead Capture */}
      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Lead Capture API</h3>
        <p style={{ fontSize: 13, color: '#C7C7CC', marginBottom: 16 }}>Use this endpoint to send leads from your chat widget, voice agent, or external forms.</p>
        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 12, padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, color: '#1C1C1E', marginBottom: 12, overflowX: 'auto' as const }}>
          POST /api/crm/leads
        </div>
        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 12, padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#8E8E93', overflowX: 'auto' as const, whiteSpace: 'pre' as const }}>
{`{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@practice.com",
  "phone": "(555) 123-4567",
  "practice_name": "Smith Orthopedics",
  "specialty": "orthopedics",
  "provider_count": 5,
  "monthly_charges": 250000,
  "source": "website_chat",
  "notes": "Interested in billing services"
}`}
        </div>
        <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 12 }}>
          Returns: <code style={{ background: 'rgba(0,0,0,0.03)', padding: '2px 6px', borderRadius: 4 }}>{'{ success, lead_id, ai_score, temperature, duplicate }'}</code>
        </p>
      </div>

      {/* AI Scoring */}
      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>AI Lead Scoring Rules</h3>
        <p style={{ fontSize: 13, color: '#C7C7CC', marginBottom: 16 }}>How leads are automatically scored (0-100)</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500, color: '#8E8E93', fontSize: 11, textTransform: 'uppercase' }}>Signal</th>
              <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 500, color: '#8E8E93', fontSize: 11, textTransform: 'uppercase' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {[
              { signal: 'Base score', points: '+30' },
              { signal: 'High-value specialty (anesthesia, ortho, ASC, pain)', points: '+15' },
              { signal: 'Providers: 10+', points: '+20' },
              { signal: 'Providers: 5-9', points: '+10' },
              { signal: 'Monthly charges: $500K+', points: '+20' },
              { signal: 'Monthly charges: $200-500K', points: '+15' },
              { signal: 'Monthly charges: $100-200K', points: '+10' },
              { signal: 'Has email', points: '+5' },
              { signal: 'Has phone', points: '+5' },
              { signal: 'High-intent source (chat, form, voice)', points: '+10' },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}>
                <td style={{ padding: '8px 0', color: '#1C1C1E' }}>{r.signal}</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#00B5D6' }}>{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 12, color: '#8E8E93' }}>
          Temperature: <span style={{ color: '#D85A30', fontWeight: 600 }}>Hot</span> = 75+, <span style={{ color: '#EF9F27', fontWeight: 600 }}>Warm</span> = 45-74, <span style={{ color: '#85B7EB', fontWeight: 600 }}>Cold</span> = 0-44
        </div>
      </div>

      {/* Pipeline Stages */}
      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Pipeline Stages</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {['New', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Won'].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: '#00B5D6', color: 'white', opacity: 0.4 + (i * 0.12) }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Database */}
      <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93' }}>Database</h3>
        <p style={{ fontSize: 13, color: '#C7C7CC', marginBottom: 16 }}>Supabase connection</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
          <div>
            <div style={{ color: '#8E8E93', marginBottom: 4 }}>Project</div>
            <div style={{ fontWeight: 500, color: '#1C1C1E' }}>Website (twvmglnkahuitvdttawq)</div>
          </div>
          <div>
            <div style={{ color: '#8E8E93', marginBottom: 4 }}>Region</div>
            <div style={{ fontWeight: 500, color: '#1C1C1E' }}>US East 2</div>
          </div>
          <div>
            <div style={{ color: '#8E8E93', marginBottom: 4 }}>Tables</div>
            <div style={{ fontWeight: 500, color: '#1C1C1E' }}>leads, activities, meetings</div>
          </div>
          <div>
            <div style={{ color: '#8E8E93', marginBottom: 4 }}>Status</div>
            <div style={{ fontWeight: 500, color: '#0F6E56' }}>Active & Healthy</div>
          </div>
        </div>
      </div>
    </div>
  )
}
