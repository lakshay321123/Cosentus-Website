'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string; type: 'lead' | 'task' | 'meeting'
  title: string; subtitle: string; href: string; score?: number
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timeout = setTimeout(async () => {
      const q = `%${query}%`
      const [leads, tasks] = await Promise.all([
        supabase.from('leads').select('id, first_name, last_name, practice_name, specialty, ai_score').or(`first_name.ilike.${q},last_name.ilike.${q},practice_name.ilike.${q},email.ilike.${q}`).limit(6),
        supabase.from('tasks').select('id, title, assigned_to, status').ilike('title', q).limit(4),
      ])
      const r: SearchResult[] = []
      leads.data?.forEach(l => r.push({ id: l.id, type: 'lead', title: `${l.first_name} ${l.last_name}`, subtitle: `${l.practice_name || ''} · ${l.specialty?.replace('_', ' ')}`, href: `/crm/leads/${l.id}`, score: l.ai_score }))
      tasks.data?.forEach(t => r.push({ id: t.id, type: 'task', title: t.title, subtitle: `${t.status} · ${t.assigned_to || 'Unassigned'}`, href: '/crm/tasks' }))
      setResults(r)
      setSelected(0)
    }, 200)
    return () => clearTimeout(timeout)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(p => Math.min(p + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) { router.push(results[selected].href); setOpen(false); setQuery('') }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={ref} style={{ padding: '12px 12px 0', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: '#F5F5F5', border: open ? '1px solid #00B5D6' : '1px solid transparent' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={query} onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)} onKeyDown={handleKeyDown}
          placeholder="Search leads, tasks..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#000', fontFamily: "'Reddit Sans', sans-serif" }} />
        {query && <button onClick={() => { setQuery(''); setResults([]) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCCCCC', fontSize: 14 }}>×</button>}
      </div>
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 12, right: 12, background: 'white', borderRadius: 8, border: '1px solid #E6E6E6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 50, overflow: 'hidden', marginTop: 4 }}>
          {results.map((r, i) => (
            <div key={`${r.type}-${r.id}`} onClick={() => { router.push(r.href); setOpen(false); setQuery('') }}
              style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: i === selected ? '#F5F5F5' : 'transparent', borderBottom: i < results.length - 1 ? '1px solid #F5F5F5' : 'none' }}
              onMouseEnter={() => setSelected(i)}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', background: r.type === 'lead' ? 'rgba(0,181,214,0.1)' : '#F5F5F5', color: r.type === 'lead' ? '#00B5D6' : '#616161' }}>{r.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#CCCCCC' }}>{r.subtitle}</div>
              </div>
              {r.score !== undefined && <span style={{ fontSize: 11, fontWeight: 600, color: r.score >= 80 ? '#00B5D6' : r.score >= 50 ? '#EF9F27' : '#CCCCCC' }}>{r.score}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
