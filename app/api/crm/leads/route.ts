import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twvmglnkahuitvdttawq.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dm1nbG5rYWh1aXR2ZHR0YXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNzgyODAsImV4cCI6MjA5MTY1NDI4MH0.wjTyUU9Zo-5h9zXroXYRbEZu2zFl6Q0Dpd7f1oT32ko'
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

    const { first_name, last_name, email, phone, practice_name, specialty, provider_count, monthly_charges, source, notes } = body

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 })
    }

    // Check for duplicates by email
    if (email) {
      const { data: existing } = await supabase.from('leads').select('id').eq('email', email).limit(1)
      if (existing && existing.length > 0) {
        // Update existing lead's last_activity and add activity log
        await supabase.from('leads').update({ last_activity: new Date().toISOString() }).eq('id', existing[0].id)
        await supabase.from('activities').insert({
          lead_id: existing[0].id,
          type: source === 'voice_agent' ? 'call' : 'chat',
          description: `Returning lead — new ${source?.replace('_', ' ')} interaction${notes ? ': ' + notes : ''}`,
        })
        return NextResponse.json({ success: true, lead_id: existing[0].id, duplicate: true })
      }
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
