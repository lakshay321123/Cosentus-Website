import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Specialty → rep assignment rules
const assignmentRules: Record<string, string[]> = {
  anesthesia: ['Logan Lowry', 'Allen Ranjan'],
  orthopedics: ['Mark Wines', 'Allen Ranjan'],
  pain_management: ['Allen Ranjan'],
  asc: ['Mark Wines', 'Allen Ranjan'],
  behavioral_health: ['Allen Ranjan'],
  urgent_care: ['Allen Ranjan'],
  other: ['Allen Ranjan'],
}

// Round-robin index per specialty
const roundRobin: Record<string, number> = {}

function getAssignee(specialty: string): string {
  const reps = assignmentRules[specialty] || assignmentRules.other
  const idx = roundRobin[specialty] || 0
  const assignee = reps[idx % reps.length]
  roundRobin[specialty] = idx + 1
  return assignee
}

/** POST /api/crm/automate — run automation tasks */
export async function POST(req: NextRequest) {
  const { action } = await req.json()

  if (action === 'run_workflows') {
    // Execute all active workflows
    const { data: workflows } = await supabase.from('workflows').select('*').eq('status', 'active')
    if (!workflows || workflows.length === 0) return NextResponse.json({ executed: 0 })

    let totalExecuted = 0
    for (const wf of workflows) {
      let leads: any[] = []

      // Get leads matching trigger
      if (wf.trigger_type === 'lead_created') {
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data } = await supabase.from('leads').select('*').gte('created_at', fiveMinAgo)
        leads = data || []
      } else if (wf.trigger_type === 'score_change') {
        const { data } = await supabase.from('leads').select('*').not('status', 'in', '("won","lost")')
        leads = data || []
      } else if (wf.trigger_type === 'stage_change') {
        const { data } = await supabase.from('leads').select('*').not('status', 'in', '("won","lost")')
        leads = data || []
      }

      // Apply conditions
      if (wf.trigger_config?.field && wf.trigger_config?.value) {
        const { field, operator, value } = wf.trigger_config
        leads = leads.filter(l => {
          const v = l[field]
          if (operator === 'equals') return String(v) === String(value)
          if (operator === 'gt') return Number(v) > Number(value)
          if (operator === 'lt') return Number(v) < Number(value)
          if (operator === 'contains') return String(v).includes(String(value))
          return true
        })
      }

      // Execute actions for matching leads
      for (const lead of leads) {
        for (const act of (wf.actions || [])) {
          if (act.type === 'assign_rep') await supabase.from('leads').update({ assigned_to: act.value }).eq('id', lead.id)
          if (act.type === 'change_stage') await supabase.from('leads').update({ status: act.value }).eq('id', lead.id)
          if (act.type === 'create_task') await supabase.from('tasks').insert({ lead_id: lead.id, title: act.value || `Follow up with ${lead.first_name}`, priority: 'medium' })
          if (act.type === 'add_tag') {
            const tags = [...(lead.tags || []), act.value].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
            await supabase.from('leads').update({ tags }).eq('id', lead.id)
          }
          if (act.type === 'notify') await supabase.from('activities').insert({ lead_id: lead.id, type: 'note', description: `Workflow "${wf.name}": ${act.value}` })
          totalExecuted++
        }
      }

      await supabase.from('workflows').update({ executions: (wf.executions || 0) + leads.length, last_executed_at: new Date().toISOString() }).eq('id', wf.id)
    }

    return NextResponse.json({ success: true, executed: totalExecuted })
  }

  if (action === 'auto_assign') {
    // Assign all unassigned leads based on specialty
    const { data: unassigned } = await supabase.from('leads').select('id, specialty').is('assigned_to', null)
    if (!unassigned || unassigned.length === 0) return NextResponse.json({ assigned: 0 })

    let count = 0
    for (const lead of unassigned) {
      const assignee = getAssignee(lead.specialty || 'other')
      await supabase.from('leads').update({ assigned_to: assignee }).eq('id', lead.id)
      await supabase.from('activities').insert({ lead_id: lead.id, type: 'note', description: `Auto-assigned to ${assignee} based on specialty (${lead.specialty})` })
      count++
    }
    return NextResponse.json({ success: true, assigned: count })
  }

  if (action === 'stale_alerts') {
    // Find deals stuck in a stage for 7+ days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: stale } = await supabase
      .from('leads')
      .select('id, first_name, last_name, practice_name, status, assigned_to, last_activity')
      .not('status', 'in', '("won","lost","new")')
      .lt('last_activity', sevenDaysAgo)

    if (!stale || stale.length === 0) return NextResponse.json({ stale_count: 0, leads: [] })

    // Create tasks for stale deals
    for (const lead of stale) {
      const days = Math.round((Date.now() - new Date(lead.last_activity).getTime()) / (24 * 60 * 60 * 1000))
      // Check if task already exists
      const { data: existing } = await supabase.from('tasks').select('id').eq('lead_id', lead.id).eq('title', `Follow up: ${lead.first_name} ${lead.last_name} (stale ${days}d)`).limit(1)
      if (!existing || existing.length === 0) {
        await supabase.from('tasks').insert({
          lead_id: lead.id,
          title: `Follow up: ${lead.first_name} ${lead.last_name} (stale ${days}d)`,
          description: `This deal has been in "${lead.status}" for ${days} days with no activity. Needs immediate follow-up.`,
          priority: days > 14 ? 'high' : 'medium',
          assigned_to: lead.assigned_to,
          due_date: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({ success: true, stale_count: stale.length, leads: stale })
  }

  if (action === 'score_all') {
    // Re-score all leads with rule-based scoring
    const { data: leads } = await supabase.from('leads').select('*')
    if (!leads) return NextResponse.json({ scored: 0 })

    let count = 0
    for (const lead of leads) {
      let score = 30
      if (['anesthesia', 'orthopedics', 'asc', 'pain_management'].includes(lead.specialty)) score += 15
      if ((lead.provider_count || 0) >= 10) score += 20
      else if ((lead.provider_count || 0) >= 5) score += 10
      if ((lead.monthly_charges || 0) >= 500000) score += 20
      else if ((lead.monthly_charges || 0) >= 200000) score += 15
      else if ((lead.monthly_charges || 0) >= 100000) score += 10
      if (lead.email) score += 5
      if (lead.phone) score += 5
      if (['website_chat', 'contact_form', 'voice_agent'].includes(lead.source)) score += 10
      score = Math.min(score, 100)
      const temp = score >= 75 ? 'hot' : score >= 45 ? 'warm' : 'cold'

      if (score !== lead.ai_score || temp !== lead.temperature) {
        await supabase.from('leads').update({ ai_score: score, temperature: temp }).eq('id', lead.id)
        count++
      }
    }
    return NextResponse.json({ success: true, scored: count })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
