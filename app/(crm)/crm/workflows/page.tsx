'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Workflow { id: string; name: string; description: string | null; status: string; trigger_type: string; trigger_config: any; actions: any[]; executions: number; last_executed_at: string | null; created_at: string }

const triggerLabels: Record<string, string> = { lead_created: 'New lead created', score_change: 'AI score changes', stage_change: 'Pipeline stage changes', form_submit: 'Form submitted', manual: 'Manual trigger' }
const actionTypes = [
  { value: 'send_email', label: 'Send email template' },
  { value: 'assign_rep', label: 'Assign to rep' },
  { value: 'change_stage', label: 'Move to pipeline stage' },
  { value: 'create_task', label: 'Create task' },
  { value: 'add_tag', label: 'Add tag' },
  { value: 'enroll_sequence', label: 'Enroll in sequence' },
  { value: 'notify', label: 'Send notification' },
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    supabase.from('workflows').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setWorkflows(data as Workflow[]); setLoading(false) })
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const actions = []
    const actionType = fd.get('action_type') as string
    const actionValue = fd.get('action_value') as string
    if (actionType) actions.push({ type: actionType, value: actionValue, order: 1 })
    const condField = fd.get('condition_field') as string
    const condOp = fd.get('condition_op') as string
    const condVal = fd.get('condition_value') as string
    const wf = {
      name: fd.get('name') as string,
      description: fd.get('description') as string || null,
      trigger_type: fd.get('trigger_type') as string,
      trigger_config: condField ? { field: condField, operator: condOp, value: condVal } : {},
      actions,
      status: 'draft',
    }
    const { data } = await supabase.from('workflows').insert(wf).select()
    if (data) { setWorkflows(prev => [data[0] as Workflow, ...prev]); setShowCreate(false) }
  }

  const toggleStatus = async (wf: Workflow) => {
    const s = wf.status === 'active' ? 'paused' : 'active'
    setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, status: s } : w))
    await supabase.from('workflows').update({ status: s }).eq('id', wf.id)
  }

  if (loading) return <div style={{ padding: 40, color: '#616161' }}>Loading workflows...</div>

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Workflows</h1>
          <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Automate actions based on triggers</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Create Workflow</button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 12, border: '1px solid #00B5D6', padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>New Workflow</h3>
          <input name="name" placeholder="Workflow name *" required style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 12, boxSizing: 'border-box' as const }} />
          <input name="description" placeholder="Description" style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' as const }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#FAFAFA', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6', marginBottom: 8 }}>WHEN (Trigger)</div>
              <select name="trigger_type" required style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, background: 'white', marginBottom: 8 }}>
                {Object.entries(triggerLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <div style={{ fontSize: 11, color: '#616161', marginBottom: 8 }}>Condition (optional):</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 6 }}>
                <select name="condition_field" style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, background: 'white' }}>
                  <option value="">Field...</option><option value="ai_score">AI Score</option>
                  <option value="specialty">Specialty</option><option value="temperature">Temperature</option>
                  <option value="source">Source</option><option value="status">Stage</option>
                </select>
                <select name="condition_op" style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12, background: 'white' }}>
                  <option value="equals">equals</option><option value="gt">greater than</option>
                  <option value="lt">less than</option><option value="contains">contains</option>
                </select>
                <input name="condition_value" placeholder="Value" style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #E6E6E6', fontSize: 12 }} />
              </div>
            </div>
            <div style={{ background: '#FAFAFA', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#00B5D6', marginBottom: 8 }}>THEN (Action)</div>
              <select name="action_type" required style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, background: 'white', marginBottom: 8 }}>
                {actionTypes.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <input name="action_value" placeholder="Value (rep name, stage, template, etc)" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 13, boxSizing: 'border-box' as const }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create Workflow</button>
            <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#616161', border: '1px solid #E6E6E6', borderRadius: 6, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {workflows.map(wf => (
          <div key={wf.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: wf.status === 'active' ? '#E1F5EE' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={wf.status === 'active' ? '#085041' : '#CCCCCC'} strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{wf.name}</div>
              <div style={{ fontSize: 12, color: '#616161', marginTop: 2 }}>
                When <strong>{triggerLabels[wf.trigger_type]}</strong>
                {wf.trigger_config?.field && <> and {wf.trigger_config.field} {wf.trigger_config.operator} {wf.trigger_config.value}</>}
                {wf.actions?.[0] && <> → <strong>{actionTypes.find(a => a.value === wf.actions[0].type)?.label}</strong>: {wf.actions[0].value}</>}
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#616161', textAlign: 'right' }}>
              <div>{wf.executions} runs</div>
            </div>
            <button onClick={() => toggleStatus(wf)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E6E6E6', background: 'white', fontSize: 12, cursor: 'pointer', color: wf.status === 'active' ? '#854F0B' : '#085041' }}>
              {wf.status === 'active' ? 'Pause' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
