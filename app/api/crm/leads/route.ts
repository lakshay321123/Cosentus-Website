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

/**
 * Mirror a lead into HubSpot as a Contact. Non-blocking and best-effort:
 * any failure is logged and swallowed so it never affects the Supabase
 * write or the API response. Supabase remains the system of record.
 *
 * Uses HubSpot's email-based upsert (idObjectProperty=email) so repeat
 * submissions update the existing contact instead of creating duplicates.
 * No-ops cleanly when HUBSPOT_TOKEN is not configured.
 */
async function syncToHubSpot(lead: {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  practice_name?: string
  specialty?: string
  source?: string
  notes?: string
}): Promise<void> {
  const token = process.env.HUBSPOT_TOKEN
  if (!token) return // feature off until token is configured
  if (!lead.email) return // HubSpot upsert key is email; skip if absent

  const extraParts = [
    lead.specialty ? `Specialty: ${lead.specialty}` : '',
    lead.source ? `Source: ${lead.source}` : '',
    lead.notes || '',
  ].filter(Boolean)

  const properties: Record<string, string> = {
    email: lead.email,
  }
  if (lead.first_name) properties.firstname = lead.first_name
  if (lead.last_name) properties.lastname = lead.last_name
  if (lead.phone) properties.phone = lead.phone
  if (lead.practice_name) properties.company = lead.practice_name
  if (extraParts.length) properties.message = extraParts.join(' | ')

  try {
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(lead.email)}?idProperty=email`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      },
    )

    // 404 means the contact does not exist yet — create it.
    if (res.status === 404) {
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      })
      if (!createRes.ok) {
        console.error('[HubSpot] contact create failed:', createRes.status, await createRes.text())
      }
      return
    }

    if (!res.ok) {
      console.error('[HubSpot] contact upsert failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[HubSpot] sync error:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { first_name, last_name, email, phone, practice_name, specialty, provider_count, monthly_charges, source, notes } = body

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
        description: `Returning lead, new ${source?.replace('_', ' ')} interaction${notes ? ': ' + notes : ''}`,
      })
      await syncToHubSpot({ first_name, last_name, email, phone, practice_name, specialty, source, notes })
      return NextResponse.json({ success: true, lead_id: existingId, duplicate: true })
    }

    // Calculate AI score
    const ai_score = calculateAIScore(body)
    const temperature = calculateTemperature(ai_score)
    const revenue_potential = monthly_charges ? Math.round(monthly_charges * 0.08) : null // ~8% of monthly charges

    const { data, error } = await supabase.from('leads').insert({
      first_name, last_name, email, phone, practice_name,
      specialty: specialty || 'other',
      provider_count: provider_count || null,
      monthly_charges: monthly_charges || null,
      source: source || 'other',
      ai_score, temperature, revenue_potential,
      status: 'new',
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

    // Mirror to HubSpot (non-blocking, best-effort)
    await syncToHubSpot({ first_name, last_name, email, phone, practice_name, specialty, source, notes })

    return NextResponse.json({ success: true, lead_id: data.id, ai_score, temperature, assigned_to: assignee, duplicate: false })
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
