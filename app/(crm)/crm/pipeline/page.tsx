'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { supabase, Lead, LostReason } from '@/lib/supabase'
import Link from 'next/link'

const stages = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost']
const stageLabels: Record<string, string> = { new: 'New Leads', qualified: 'Qualified', discovery: 'Discovery', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' }
const stageProb: Record<string, number> = { new: 5, qualified: 15, discovery: 30, proposal: 50, negotiation: 75, won: 100, lost: 0 }
const lostReasons: { value: LostReason; label: string }[] = [
  { value: 'competitor', label: 'Went with competitor' },
  { value: 'budget', label: 'Budget constraints' },
  { value: 'timing', label: 'Bad timing' },
  { value: 'no_response', label: 'No response / ghosted' },
  { value: 'not_a_fit', label: 'Not a fit' },
  { value: 'went_in_house', label: 'Went in-house' },
  { value: 'other', label: 'Other' },
]

const S = { fontFamily: "'Reddit Sans', sans-serif" } as const

function daysAgo(dateStr: string | null): number {
  if (!dateStr) return 0
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = daysAgo(dateStr)
  if (d === 0) return 'Today'
  if (d === 1) return '1d ago'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

function initials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// Confetti burst for Won deals
function WonConfetti({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -10,
          width: 8 + Math.random() * 8,
          height: 8 + Math.random() * 8,
          borderRadius: Math.random() > 0.5 ? '50%' : 2,
          background: ['#00B5D6', '#36C2DE', '#68D1E6', '#FFD700', '#FF6B6B', '#4CAF50'][Math.floor(Math.random() * 6)],
          animation: `confettiFall ${1.5 + Math.random() * 1.5}s ease-in forwards`,
          animationDelay: `${Math.random() * 0.5}s`,
          opacity: 0.9,
        }} />
      ))}
      <style>{`@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(${360 + Math.random() * 720}deg); opacity: 0; } }`}</style>
    </div>
  )
}

// Lost Reason Modal
function LostReasonModal({ onConfirm, onCancel }: { onConfirm: (reason: LostReason, note: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState<LostReason>('no_response')
  const [note, setNote] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 16px 48px rgba(0,0,0,0.12)', ...S }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px', color: '#000' }}>Why was this deal lost?</h3>
        <p style={{ fontSize: 13, color: '#616161', margin: '0 0 20px' }}>This helps improve win rate analysis.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {lostReasons.map(r => (
            <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#000', cursor: 'pointer', padding: '8px 12px', borderRadius: 10, background: reason === r.value ? 'rgba(0,181,214,0.08)' : 'transparent', border: reason === r.value ? '1px solid #00B5D6' : '1px solid transparent', transition: 'all 0.15s' }}>
              <input type="radio" name="reason" checked={reason === r.value} onChange={() => setReason(r.value)} style={{ accentColor: '#00B5D6' }} />
              {r.label}
            </label>
          ))}
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional notes..." rows={2}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', ...S }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid #E6E6E6', background: '#fff', fontSize: 13, cursor: 'pointer', ...S }}>Cancel</button>
          <button onClick={() => onConfirm(reason, note)} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: '#00B5D6', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', ...S }}>Mark as Lost</button>
        </div>
      </div>
    </div>
  )
}

// Quick Add Lead inline form
function QuickAddForm({ stage, onSave, onCancel }: { stage: string; onSave: (data: any) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [practice, setPractice] = useState('')
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])

  const handleSave = () => {
    const parts = name.trim().split(' ')
    if (!parts[0]) return
    onSave({ first_name: parts[0], last_name: parts.slice(1).join(' ') || 'Unknown', practice_name: practice || null, revenue_potential: value ? parseFloat(value) * 1000 : null, status: stage })
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 12, border: '2px solid #00B5D6' }}>
      <input ref={ref} value={name} onChange={e => setName(e.target.value)} placeholder="Contact name" onKeyDown={e => e.key === 'Enter' && handleSave()}
        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 6, outline: 'none', boxSizing: 'border-box', ...S }} />
      <input value={practice} onChange={e => setPractice(e.target.value)} placeholder="Practice name"
        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 6, outline: 'none', boxSizing: 'border-box', ...S }} />
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Value ($K)" type="number"
        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 8, outline: 'none', boxSizing: 'border-box', ...S }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={handleSave} style={{ flex: 1, padding: '6px', borderRadius: 8, border: 'none', background: '#00B5D6', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', ...S }}>Add</button>
        <button onClick={onCancel} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E6E6E6', background: '#fff', fontSize: 12, cursor: 'pointer', ...S }}>✕</button>
      </div>
    </div>
  )
}

type SortKey = 'score' | 'value' | 'age' | 'name'

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterTemp, setFilterTemp] = useState('all')
  const [filterRep, setFilterRep] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('score')
  const [compactView, setCompactView] = useState(false)
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [lostModal, setLostModal] = useState<string | null>(null) // lead id pending lost reason
  const [quickAdd, setQuickAdd] = useState<string | null>(null) // stage for inline add
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  useEffect(() => {
    supabase.from('leads').select('*').order('ai_score', { ascending: false })
      .then(({ data }) => { if (data) setLeads(data as Lead[]); setLoading(false) })

    // Real-time sync
    const channel = supabase.channel('crm-pipeline')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (p) => {
        setLeads(prev => [p.new as Lead, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (p) => {
        setLeads(prev => prev.map(l => l.id === (p.new as Lead).id ? p.new as Lead : l))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' }, (p) => {
        setLeads(prev => prev.filter(l => l.id !== (p.old as any).id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // Get unique reps for filter
  const reps = useMemo(() => {
    const set = new Set(leads.map(l => l.assigned_to).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [leads])

  const filtered = useMemo(() => {
    let result = leads
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(l =>
        `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
        (l.practice_name || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q)
      )
    }
    if (filterSpec !== 'all') result = result.filter(l => l.specialty === filterSpec)
    if (filterTemp !== 'all') result = result.filter(l => l.temperature === filterTemp)
    if (filterRep !== 'all') result = result.filter(l => l.assigned_to === filterRep)
    return result
  }, [leads, search, filterSpec, filterTemp, filterRep])

  const sortedInStage = useCallback((stageLeads: Lead[]): Lead[] => {
    return [...stageLeads].sort((a, b) => {
      if (sortBy === 'score') return b.ai_score - a.ai_score
      if (sortBy === 'value') return (b.revenue_potential || 0) - (a.revenue_potential || 0)
      if (sortBy === 'age') return new Date(a.stage_changed_at || a.created_at).getTime() - new Date(b.stage_changed_at || b.created_at).getTime()
      if (sortBy === 'name') return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      return 0
    })
  }, [sortBy])

  const moveToStage = async (leadId: string, newStage: string, lostReason?: LostReason, lostNote?: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return
    const prev = lead.status

    // Optimistic update
    setLeads(p => p.map(l => l.id === leadId ? { ...l, status: newStage as Lead['status'], stage_changed_at: new Date().toISOString(), ...(lostReason ? { lost_reason: lostReason } : {}) } : l))

    const updates: Record<string, unknown> = { status: newStage, stage_changed_at: new Date().toISOString() }
    if (lostReason) { updates.lost_reason = lostReason }
    if (newStage !== 'lost') { updates.lost_reason = null }

    const { error } = await supabase.from('leads').update(updates).eq('id', leadId)
    if (error) {
      setLeads(p => p.map(l => l.id === leadId ? { ...l, status: prev as Lead['status'] } : l))
      alert('Failed to update stage')
    } else {
      const desc = lostReason ? `Moved to lost — ${lostReason}${lostNote ? ': ' + lostNote : ''}` : `Moved to ${newStage}`
      await supabase.from('activities').insert({ lead_id: leadId, type: 'status_change', description: desc })
      if (newStage === 'won') setShowConfetti(true)
    }
  }

  const handleDrop = (stage: string) => {
    if (!dragId) return
    setDragOverStage(null)
    if (stage === 'lost') {
      setLostModal(dragId)
    } else {
      moveToStage(dragId, stage)
    }
    setDragId(null)
  }

  const handleQuickAdd = async (data: any) => {
    const res = await fetch('/api/crm/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, source: 'other', specialty: 'other' }),
    })
    if (res.ok) {
      const result = await res.json()
      if (result.lead) setLeads(prev => [result.lead, ...prev])
      else {
        const { data: refreshed } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(1)
        if (refreshed?.[0]) setLeads(prev => [refreshed[0] as Lead, ...prev])
      }
    }
    setQuickAdd(null)
  }

  const toggleCollapse = (stage: string) => {
    setCollapsedStages(prev => {
      const next = new Set(prev)
      next.has(stage) ? next.delete(stage) : next.add(stage)
      return next
    })
  }

  // Summary stats
  const activePipeline = filtered.filter(l => !['won', 'lost'].includes(l.status))
  const totalPipelineVal = activePipeline.reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const weightedVal = activePipeline.reduce((s, l) => s + (l.revenue_potential || 0) * (stageProb[l.status] || 0) / 100, 0)
  const wonVal = filtered.filter(l => l.status === 'won').reduce((s, l) => s + (l.revenue_potential || 0), 0)
  const avgAge = activePipeline.length > 0
    ? Math.round(activePipeline.reduce((s, l) => s + daysAgo(l.stage_changed_at || l.created_at), 0) / activePipeline.length)
    : 0

  const tempColor = (t: string) => t === 'hot' ? '#00B5D6' : t === 'warm' ? '#68D1E6' : '#E6E6E6'
  const scoreColor = (s: number) => s >= 80 ? '#00B5D6' : s >= 50 ? '#68D1E6' : '#CCCCCC'
  const ageColor = (days: number) => days > 14 ? '#E53935' : days > 7 ? '#EF9F27' : '#CCCCCC'

  if (loading) return <div style={{ padding: 48, color: '#000000' }}>Loading pipeline...</div>

  return (
    <>
      {showConfetti && <WonConfetti onDone={() => setShowConfetti(false)} />}
      {lostModal && <LostReasonModal
        onConfirm={(reason, note) => { moveToStage(lostModal, 'lost', reason, note); setLostModal(null) }}
        onCancel={() => setLostModal(null)}
      />}

      <div style={{ padding: '28px 24px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: '#000', margin: 0 }}>Pipeline</h1>
            <p style={{ fontSize: 13, color: '#616161', margin: '4px 0 0' }}>{activePipeline.length} active deals · {filtered.length} total</p>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 8, padding: 2 }}>
              <button onClick={() => setViewMode('kanban')} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: viewMode === 'kanban' ? '#00B5D6' : 'transparent', color: viewMode === 'kanban' ? '#fff' : '#616161', fontSize: 12, fontWeight: 500, cursor: 'pointer', ...S }}>Board</button>
              <button onClick={() => setViewMode('list')} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: viewMode === 'list' ? '#00B5D6' : 'transparent', color: viewMode === 'list' ? '#fff' : '#616161', fontSize: 12, fontWeight: 500, cursor: 'pointer', ...S }}>List</button>
            </div>
            <button onClick={() => setCompactView(!compactView)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E6E6E6', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#616161', ...S }}>{compactView ? 'Expand' : 'Compact'}</button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Pipeline Value', value: `$${Math.round(totalPipelineVal / 1000)}K` },
            { label: 'Weighted', value: `$${Math.round(weightedVal / 1000)}K` },
            { label: 'Won', value: `$${Math.round(wonVal / 1000)}K` },
            { label: 'Active Deals', value: `${activePipeline.length}` },
            { label: 'Avg Days in Stage', value: `${avgAge}d` },
          ].map((s, i) => (
            <div key={i} className="crm-stat">
              <div className="crm-stat-label">{s.label}</div>
              <div className="crm-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '0 0 220px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, outline: 'none', boxSizing: 'border-box', ...S }} />
          </div>
          <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, color: '#000', background: '#fff', ...S }}>
            <option value="all">All Specialties</option>
            <option value="anesthesia">Anesthesia</option><option value="orthopedics">Orthopedics</option>
            <option value="pain_management">Pain Mgmt</option><option value="asc">ASC</option>
            <option value="behavioral_health">Behavioral</option><option value="urgent_care">Urgent Care</option>
          </select>
          <select value={filterTemp} onChange={e => setFilterTemp(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, color: '#000', background: '#fff', ...S }}>
            <option value="all">All Temps</option>
            <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
          </select>
          <select value={filterRep} onChange={e => setFilterRep(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, color: '#000', background: '#fff', ...S }}>
            <option value="all">All Reps</option>
            {reps.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 13, color: '#000', background: '#fff', ...S }}>
            <option value="score">Sort: AI Score</option>
            <option value="value">Sort: Value</option>
            <option value="age">Sort: Oldest First</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Pipeline value bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 6, marginBottom: 20, background: '#f5f5f5' }}>
          {stages.filter(s => s !== 'lost').map(stage => {
            const val = filtered.filter(l => l.status === stage).reduce((s, l) => s + (l.revenue_potential || 0), 0)
            const pct = totalPipelineVal + wonVal > 0 ? (val / (totalPipelineVal + wonVal)) * 100 : 0
            return pct > 0 ? <div key={stage} style={{ width: `${pct}%`, background: stage === 'won' ? '#4CAF50' : '#00B5D6', opacity: 0.3 + (stageProb[stage] / 100) * 0.7, transition: 'width 0.3s' }} /> : null
          })}
        </div>

        {/* KANBAN VIEW */}
        {viewMode === 'kanban' && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16 }}>
          {stages.map(stage => {
            const collapsed = collapsedStages.has(stage)
            const stageLeads = sortedInStage(filtered.filter(l => l.status === stage))
            const stageVal = stageLeads.reduce((s, l) => s + (l.revenue_potential || 0), 0)

            if (collapsed) {
              return (
                <div key={stage} onClick={() => toggleCollapse(stage)}
                  style={{ minWidth: 36, background: '#f5f5f5', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 4px', cursor: 'pointer', gap: 8 }}>
                  <div style={{ writingMode: 'vertical-rl', fontSize: 12, fontWeight: 600, color: '#616161', letterSpacing: '0.04em' }}>{stageLabels[stage]}</div>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{stageLeads.length}</div>
                </div>
              )
            }

            return (
              <div key={stage} style={{ flex: '1 1 0', minWidth: 190 }}
                onDragOver={e => { e.preventDefault(); setDragOverStage(stage) }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage)}
              >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => toggleCollapse(stage)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#CCCCCC' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </button>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{stageLabels[stage]}</div>
                      <div style={{ fontSize: 11, color: '#616161' }}>{stageLeads.length} · ${Math.round(stageVal / 1000)}K{stageProb[stage] > 0 ? ` · ${stageProb[stage]}%` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{stageLeads.length}</div>
                    {stage !== 'won' && stage !== 'lost' && (
                      <button onClick={() => setQuickAdd(quickAdd === stage ? null : stage)} style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid #E6E6E6', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: '#00B5D6', fontWeight: 600 }}>+</button>
                    )}
                  </div>
                </div>

                {/* Cards container */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80, padding: 6, borderRadius: 12,
                  background: dragOverStage === stage ? 'rgba(0,181,214,0.08)' : '#f5f5f5',
                  border: dragOverStage === stage ? '2px dashed #00B5D6' : '2px solid transparent',
                  transition: 'background 0.2s, border 0.2s',
                }}>
                  {/* Quick add form */}
                  {quickAdd === stage && (
                    <QuickAddForm stage={stage} onSave={handleQuickAdd} onCancel={() => setQuickAdd(null)} />
                  )}

                  {stageLeads.map(lead => {
                    const age = daysAgo(lead.stage_changed_at || lead.created_at)
                    const stale = age > 14
                    const warning = age > 7 && age <= 14

                    return (
                      <div key={lead.id} draggable onDragStart={() => setDragId(lead.id)}
                        style={{
                          background: '#fff', borderRadius: 10, padding: compactView ? '10px 12px' : '14px',
                          cursor: 'grab', border: `1px solid ${stale ? '#E53935' : warning ? '#EF9F27' : '#E6E6E6'}`,
                          transition: 'box-shadow 0.2s, border-color 0.2s', position: 'relative',
                          opacity: dragId === lead.id ? 0.4 : 1,
                        }}
                        onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                        onMouseLeave={e => { (e.currentTarget).style.boxShadow = 'none' }}
                      >
                        {/* Stale indicator */}
                        {(stale || warning) && (
                          <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 10, fontWeight: 600, color: stale ? '#E53935' : '#EF9F27', background: stale ? '#FFEBEE' : '#FFF8E1', padding: '1px 6px', borderRadius: 4 }}>
                            {age}d
                          </div>
                        )}

                        {/* Compact view: just name + value */}
                        {compactView ? (
                          <Link href={`/crm/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{lead.first_name} {lead.last_name}</div>
                              {lead.revenue_potential && <span style={{ fontSize: 13, fontWeight: 700, color: '#00B5D6' }}>${Math.round(lead.revenue_potential / 1000)}K</span>}
                            </div>
                          </Link>
                        ) : (
                          <>
                            {/* Name + temp */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                              <Link href={`/crm/leads/${lead.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#000', textDecoration: 'none' }}>{lead.first_name} {lead.last_name}</Link>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: tempColor(lead.temperature), flexShrink: 0, marginTop: 4 }} />
                            </div>
                            <div style={{ fontSize: 12, color: '#616161', marginBottom: 8 }}>{lead.practice_name}</div>

                            {/* Specialty + value */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#f5f5f5', color: '#616161', textTransform: 'capitalize' }}>{lead.specialty?.replace('_', ' ')}</span>
                              {lead.revenue_potential && <span style={{ fontSize: 14, fontWeight: 700, color: '#00B5D6' }}>${Math.round(lead.revenue_potential / 1000)}K</span>}
                            </div>

                            {/* Score + assigned + last activity */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 24, height: 3, borderRadius: 2, background: scoreColor(lead.ai_score) }} />
                                <span style={{ fontSize: 10, color: '#616161' }}>{lead.ai_score}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 10, color: ageColor(daysAgo(lead.last_activity)) }}>{relativeTime(lead.last_activity)}</span>
                                {lead.assigned_to && (
                                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }} title={lead.assigned_to}>
                                    {initials(lead.assigned_to)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Lost reason */}
                            {lead.status === 'lost' && lead.lost_reason && (
                              <div style={{ fontSize: 10, color: '#E53935', marginTop: 6, fontStyle: 'italic' }}>
                                {lostReasons.find(r => r.value === lead.lost_reason)?.label || lead.lost_reason}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
                  {['Contact', 'Practice', 'Stage', 'Value', 'Score', 'Temp', 'Rep', 'Days', 'Last Activity'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 500, fontSize: 11, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedInStage(filtered).map(lead => {
                  const age = daysAgo(lead.stage_changed_at || lead.created_at)
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                      onMouseEnter={e => { (e.currentTarget).style.background = '#FAFAFA' }}
                      onMouseLeave={e => { (e.currentTarget).style.background = 'transparent' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <Link href={`/crm/leads/${lead.id}`} style={{ fontWeight: 500, color: '#000', textDecoration: 'none' }}>{lead.first_name} {lead.last_name}</Link>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#616161' }}>{lead.practice_name}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#f5f5f5', textTransform: 'capitalize' }}>{lead.status}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#00B5D6' }}>{lead.revenue_potential ? `$${Math.round(lead.revenue_potential / 1000)}K` : '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(lead.ai_score) }}>{lead.ai_score}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: tempColor(lead.temperature) }} />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {lead.assigned_to ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{initials(lead.assigned_to)}</div>
                            <span style={{ fontSize: 12, color: '#616161' }}>{lead.assigned_to.split(' ')[0]}</span>
                          </div>
                        ) : <span style={{ color: '#CCCCCC' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: 12, color: ageColor(age) }}>{age}d</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#616161' }}>{relativeTime(lead.last_activity)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
