'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string; created_at: string; lead_id: string | null; title: string
  description: string | null; due_date: string | null; priority: string
  status: string; assigned_to: string | null; completed_at: string | null
  lead?: { first_name: string; last_name: string; practice_name: string } | null
}

interface LeadOption { id: string; first_name: string; last_name: string; practice_name: string }

const priorityColors: Record<string, { bg: string; text: string }> = {
  high: { bg: '#FAECE7', text: '#993C1D' }, medium: { bg: '#FAEEDA', text: '#854F0B' }, low: { bg: '#E6F1FB', text: '#185FA5' },
}

function PriorityBadge({ p }: { p: string }) {
  const c = priorityColors[p] || priorityColors.medium
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: c.bg, color: c.text, textTransform: 'uppercase' }}>{p}</span>
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')

  useEffect(() => {
    Promise.all([
      supabase.from('tasks').select('*, lead:leads(first_name, last_name, practice_name)').order('due_date', { ascending: true }),
      supabase.from('leads').select('id, first_name, last_name, practice_name').order('first_name'),
    ]).then(([tRes, lRes]) => {
      if (tRes.data) setTasks(tRes.data as Task[])
      if (lRes.data) setLeads(lRes.data as LeadOption[])
      setLoading(false)
    })
  }, [])

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'completed' && t.status !== 'cancelled'
    if (filter === 'completed') return t.status === 'completed'
    return true
  })

  const overdue = filtered.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status === 'pending').length

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const task = {
      title: fd.get('title') as string,
      description: fd.get('description') as string || null,
      lead_id: fd.get('lead_id') as string || null,
      due_date: fd.get('due_date') as string || null,
      priority: fd.get('priority') as string || 'medium',
      assigned_to: fd.get('assigned_to') as string || null,
    }
    const { data } = await supabase.from('tasks').insert(task).select('*, lead:leads(first_name, last_name, practice_name)')
    if (data) { setTasks(prev => [data[0] as Task, ...prev]); setShowAdd(false) }
    // Log activity if linked to a lead
    if (task.lead_id) {
      await supabase.from('activities').insert({ lead_id: task.lead_id, type: 'task', description: `Task created: ${task.title}` })
    }
  }

  const toggleComplete = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus, completed_at: completedAt } : t))
    await supabase.from('tasks').update({ status: newStatus, completed_at: completedAt }).eq('id', task.id)
  }

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }

  const isOverdue = (t: Task) => t.due_date && new Date(t.due_date) < new Date() && t.status === 'pending'

  if (loading) return <div style={{ padding: 40, color: '#9ca3af' }}>Loading tasks...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1f2937', margin: 0 }}>Tasks</h1>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '4px 0 0' }}>
            {filtered.length} tasks{overdue > 0 && <span style={{ color: '#E24B4A', fontWeight: 600 }}> · {overdue} overdue</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6' }}>
            {(['pending', 'completed', 'all'] as const).map(v => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '8px 14px', fontSize: 12, border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                background: filter === v ? '#00B5D6' : 'white', color: filter === v ? 'white' : '#616161', fontWeight: filter === v ? 600 : 400,
              }}>{v}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add Task</button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,181,214,0.3)', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>New Task</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input name="title" placeholder="Task title *" required style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13, gridColumn: '1 / -1' }} />
            <input name="description" placeholder="Description (optional)" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13, gridColumn: '1 / -1' }} />
            <select name="lead_id" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13, background: 'white' }}>
              <option value="">Link to lead (optional)</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.practice_name}</option>)}
            </select>
            <input name="due_date" type="datetime-local" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13 }} />
            <select name="priority" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13, background: 'white' }}>
              <option value="high">High Priority</option>
              <option value="medium" selected>Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <input name="assigned_to" placeholder="Assigned to" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create Task</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: '#9ca3af', border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', borderRadius: 10, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px #eef0f2, 0 4px 12px #f3f4f6', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#9ca3af' }}>No {filter === 'all' ? '' : filter} tasks</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(task => (
            <div key={task.id} style={{
              background: 'white', borderRadius: 10, border: `1px solid ${isOverdue(task) ? '#E24B4A' : '#E6E6E6'}`,
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
              opacity: task.status === 'completed' ? 0.6 : 1,
            }}>
              {/* Checkbox */}
              <button onClick={() => toggleComplete(task)} style={{
                width: 22, height: 22, borderRadius: 10, border: `2px solid ${task.status === 'completed' ? '#00B5D6' : '#CCCCCC'}`,
                background: task.status === 'completed' ? '#00B5D6' : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {task.status === 'completed' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
              </button>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {task.lead && (
                    <Link href={`/crm/leads/${task.lead_id}`} style={{ fontSize: 12, color: '#00B5D6', textDecoration: 'none' }}>
                      {task.lead.first_name} {task.lead.last_name}
                    </Link>
                  )}
                  {task.due_date && (
                    <span style={{ fontSize: 11, color: isOverdue(task) ? '#E24B4A' : '#616161', fontWeight: isOverdue(task) ? 600 : 400 }}>
                      Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  )}
                  {task.assigned_to && <span style={{ fontSize: 11, color: '#d1d5db' }}>{task.assigned_to}</span>}
                </div>
              </div>

              <PriorityBadge p={task.priority} />

              <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 16, padding: '4px 8px' }} title="Delete">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
