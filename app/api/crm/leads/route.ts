import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Simple AI scoring based on available data
function calculateAIScore(data: Record<string, unknown>): number {
  let score = 30 // base

  // Specialty match bonus
  const highValueSpecialties = ['anesthesia', 'orthopedics', 'asc', 'pain_management']
  if (highValueSpecialties.includes(data.specialty as string)) score += 15

  // Provider count bonus
  const providers = data.provider_count as number || 0
  if (providers >= 10) score += 20
  else if (providers >= 5) score += 10
  else if (providers >= 2) score += 5

  // Monthly charges bonus
  const charges = data.monthly_charges as number || 0
  if (charges >= 500000) score += 20
  else if (charges >= 200000) score += 15
  else if (charges >= 100000) score += 10

  // Contact completeness bonus
  if (data.email) score += 5
  if (data.phone) score += 5

  // Source bonus (inbound > outbound)
  const highIntentSources = ['website_chat', 'contact_form', 'voice_agent']
  if (highIntentSources.includes(data.source as string)) score += 10

  return Math.min(score, 100)
}

function calculateTemperature(score: number): string {
  if (score >= 75) return 'hot'
  if (score >= 45) return 'warm'
  return 'cold'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { first_name, last_name, email, phone, practice_name, specialty, provider_count, monthly_charges, source, notes, status: requestedStatus, revenue_potential: requestedRevenue } = body

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 })
    }

    // Check for duplicates by email, phone, or practice+name combo
    let existingId: string | null = null
    if (email) {
      const { data } = await supabase.from('leads').select('id').eq('email', email).limit(1)
      if (data && data.length > 0) existingId = data[0].id
    }
    if (!existingId && phone) {
      const { data } = await supabase.from('leads').select('id').eq('phone', phone).limit(1)
      if (data && data.length > 0) existingId = data[0].id
    }
    if (!existingId && practice_name && last_name) {
      const { data } = await supabase.from('leads').select('id').eq('practice_name', practice_name).eq('last_name', last_name).limit(1)
      if (data && data.length > 0) existingId = data[0].id
    }
    if (existingId) {
      await supabase.from('leads').update({ last_activity: new Date().toISOString() }).eq('id', existingId)
      await supabase.from('activities').insert({
        lead_id: existingId,
        type: source === 'voice_agent' ? 'call' : 'chat',
        description: `Returning lead — new ${source?.replace('_', ' ')} interaction${notes ? ': ' + notes : ''}`,
      })
      return NextResponse.json({ success: true, lead_id: existingId, duplicate: true })
    }

    // Calculate AI score
    const ai_score = calculateAIScore(body)
    const temperature = calculateTemperature(ai_score)
    const revenue_potential = requestedRevenue != null ? requestedRevenue : (monthly_charges ? Math.round(monthly_charges * 0.08) : null)

    const validStatuses = ['new', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost']
    const leadStatus = requestedStatus && validStatuses.includes(requestedStatus) ? requestedStatus : 'new'

    const { data, error } = await supabase.from('leads').insert({
      first_name, last_name, email, phone, practice_name,
      specialty: specialty || 'other',
      provider_count: provider_count || null,
      monthly_charges: monthly_charges || null,
      source: source || 'other',
      ai_score, temperature, revenue_potential,
      status: leadStatus,
      notes: notes || null,
      tags: source === 'website_chat' ? ['chat-capture'] : source === 'voice_agent' ? ['voice-capture'] : ['manual'],
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert({
      lead_id: data.id,
      type: source === 'voice_agent' ? 'call' : source === 'website_chat' ? 'chat' : 'note',
      description: `New lead captured via ${source?.replace('_', ' ') || 'manual entry'}${notes ? ': ' + notes : ''}`,
    })

    // Auto-assign based on specialty
    const assignmentRules: Record<string, string[]> = {
      anesthesia: ['Logan Lowry', 'Allen Ranjan'],
      orthopedics: ['Mark Wines', 'Allen Ranjan'],
      pain_management: ['Allen Ranjan'],
      asc: ['Mark Wines', 'Allen Ranjan'],
      behavioral_health: ['Allen Ranjan'],
      urgent_care: ['Allen Ranjan'],
      other: ['Allen Ranjan'],
    }
    const reps = assignmentRules[specialty || 'other'] || assignmentRules.other
    const assignee = reps[Math.floor(Math.random() * reps.length)]
    await supabase.from('leads').update({ assigned_to: assignee }).eq('id', data.id)
    await supabase.from('activities').insert({ lead_id: data.id, type: 'note', description: `Auto-assigned to ${assignee}` })

    // Create notification
    const { error: notifError } = await supabase.from('notifications').insert({ type: 'new_lead', title: 'New lead captured', body: `${first_name} ${last_name} from ${practice_name || 'unknown practice'} (${specialty || 'other'})`, lead_id: data.id, link: `/crm/leads/${data.id}`, read: false })
    if (notifError) console.error('Notification insert failed:', notifError.message)

    return NextResponse.json({ success: true, lead_id: data.id, lead: data, ai_score, temperature, assigned_to: assignee, duplicate: false })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: list leads with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialty = searchParams.get('specialty')
  const temperature = searchParams.get('temperature')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase.from('leads').select('*').order('ai_score', { ascending: false }).limit(limit)

  if (specialty) query = query.eq('specialty', specialty)
  if (temperature) query = query.eq('temperature', temperature)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data, count: data?.length || 0 })
}

// PATCH: update lead with audit logging
export async function PATCH(req: NextRequest) {
  try {
    const { lead_id, updates, changed_by } = await req.json()
    if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )

    // Get current values for audit
    const { data: current } = await supabase.from('leads').select('*').eq('id', lead_id).single()
    if (!current) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    // Constrain to allowed fields
    const allowed = ['status', 'temperature', 'ai_score', 'assigned_to', 'notes', 'tags', 'revenue_potential', 'next_follow_up', 'first_name', 'last_name', 'email', 'phone', 'practice_name', 'specialty', 'provider_count', 'monthly_charges', 'campaign_id']
    const safeUpdates: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(updates)) { if (allowed.includes(k)) safeUpdates[k] = v }
    const { error } = await supabase.from('leads').update({ ...safeUpdates, updated_at: new Date().toISOString() }).eq('id', lead_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log each changed field to audit_log
    for (const [key, value] of Object.entries(updates)) {
      if (current[key] !== value) {
        await supabase.from('audit_log').insert({
          entity_type: 'lead', entity_id: lead_id,
          action: key === 'status' ? 'stage_change' : key === 'ai_score' ? 'score_change' : key === 'assigned_to' ? 'assign' : 'update',
          field_changed: key, old_value: String(current[key] ?? ''), new_value: String(value ?? ''), changed_by: changed_by || 'system',
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Update failed' }, { status: 500 }) }
}
