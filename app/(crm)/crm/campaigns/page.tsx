'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Campaign {
  id: string; name: string; type: string; status: string; start_date: string | null
  end_date: string | null; budget: number; spent: number; leads_generated: number
  deals_influenced: number; revenue_attributed: number; target_specialty: string | null
  notes: string | null; created_at: string
}

const typeLabels: Record<string, string> = { email: 'Email', event: 'Event', content: 'Content', ad: 'Advertising', referral: 'Referral', other: 'Other' }
const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#F5F5F5', text: '#616161' }, active: { bg: '#E1F5EE', text: '#085041' },
  completed: { bg: '#E6F1FB', text: '#185FA5' }, cancelled: { bg: '#FCEBEB', text: '#791F1F' },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('campaigns').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCampaigns(data as Campaign[]); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter)
  const totalBudget = campaigns.filter(c => c.status === 'active').reduce((s, c) => s + (c.budget || 0), 0)
  const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0)
  const totalLeads = campaigns.reduce((s, c) => s + (c.leads_generated || 0), 0)
  const totalRevenue = campaigns.reduce((s, c) => s + (c.revenue_attributed || 0), 0)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const campaign = {
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      budget: parseFloat(fd.get('budget') as string) || 0,
      start_date: fd.get('start_date') as string || null,
      end_date: fd.get('end_date') as string || null,
      target_specialty: fd.get('target_specialty') as string || null,
      notes: fd.get('notes') as string || null,
      status: 'draft',
    }
    const { data } = await supabase.from('campaigns').insert(campaign).select()
    if (data) { setCampaigns(prev => [data[0] as Campaign, ...prev]); setShowCreate(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    await supabase.from('campaigns').update({ status }).eq('id', id)
  }

  if (loading) return <div style={{ padding: 40, color: '#8E8E93' }}>Loading campaigns...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1C1C1E', margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: 14, color: '#8E8E93', margin: '4px 0 0' }}>Track marketing campaigns and measure ROI</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ New Campaign</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Budget', value: `$${Math.round(totalBudget / 1000)}K` },
          { label: 'Total Spent', value: `$${Math.round(totalSpent / 1000)}K` },
          { label: 'Leads Generated', value: totalLeads.toString() },
          { label: 'Revenue Attributed', value: `$${Math.round(totalRevenue / 1000)}K` },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: '20px' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 300, color: '#1C1C1E', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'draft', 'active', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 10, border: 'none', fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
            background: filter === f ? '#00B5D6' : '#F5F5F5', color: filter === f ? 'white' : '#616161', fontWeight: filter === f ? 600 : 400,
          }}>{f}</button>
        ))}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,181,214,0.3)', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>New Campaign</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <input name="name" placeholder="Campaign name *" required style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, gridColumn: '1 / -1' }} />
            <select name="type" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, background: 'white' }}>
              <option value="email">Email Campaign</option><option value="event">Event</option>
              <option value="content">Content</option><option value="ad">Advertising</option>
              <option value="referral">Referral</option><option value="other">Other</option>
            </select>
            <input name="budget" type="number" placeholder="Budget ($)" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13 }} />
            <select name="target_specialty" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, background: 'white' }}>
              <option value="">All Specialties</option><option value="anesthesia">Anesthesia</option>
              <option value="orthopedics">Orthopedics</option><option value="pain_management">Pain Management</option>
              <option value="asc">ASC</option><option value="behavioral_health">Behavioral Health</option>
            </select>
            <input name="start_date" type="date" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13 }} />
            <input name="end_date" type="date" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13 }} />
            <textarea name="notes" placeholder="Campaign notes..." rows={2} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, gridColumn: '1 / -1', fontFamily: "'Reddit Sans', sans-serif", resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create Campaign</button>
            <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#8E8E93', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', borderRadius: 10, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Campaign list */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(c => {
          const sc = statusColors[c.status] || statusColors.draft
          const roi = c.spent > 0 ? Math.round(((c.revenue_attributed - c.spent) / c.spent) * 100) : 0
          return (
            <div key={c.id} style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E' }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{c.status}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.03)', color: '#8E8E93' }}>{typeLabels[c.type] || c.type}</span>
                  </div>
                  {c.notes && <div style={{ fontSize: 13, color: '#8E8E93' }}>{c.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {c.status === 'draft' && <button onClick={() => updateStatus(c.id, 'active')} style={{ padding: '6px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', background: 'white', fontSize: 12, cursor: 'pointer', color: '#085041' }}>Launch</button>}
                  {c.status === 'active' && <button onClick={() => updateStatus(c.id, 'completed')} style={{ padding: '6px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', background: 'white', fontSize: 12, cursor: 'pointer', color: '#185FA5' }}>Complete</button>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, paddingTop: 12, borderTop: '1px solid #F5F5F5', fontSize: 12 }}>
                <div><span style={{ color: '#8E8E93' }}>Budget</span><div style={{ fontWeight: 600, color: '#1C1C1E', marginTop: 2 }}>${(c.budget || 0).toLocaleString()}</div></div>
                <div><span style={{ color: '#8E8E93' }}>Spent</span><div style={{ fontWeight: 600, color: '#1C1C1E', marginTop: 2 }}>${(c.spent || 0).toLocaleString()}</div></div>
                <div><span style={{ color: '#8E8E93' }}>Leads</span><div style={{ fontWeight: 600, color: '#1C1C1E', marginTop: 2 }}>{c.leads_generated}</div></div>
                <div><span style={{ color: '#8E8E93' }}>Revenue</span><div style={{ fontWeight: 600, color: '#1C1C1E', marginTop: 2 }}>${Math.round((c.revenue_attributed || 0) / 1000)}K</div></div>
                <div><span style={{ color: '#8E8E93' }}>ROI</span><div style={{ fontWeight: 600, color: roi > 0 ? '#085041' : '#791F1F', marginTop: 2 }}>{roi > 0 ? '+' : ''}{roi}%</div></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
