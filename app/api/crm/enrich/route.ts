import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twvmglnkahuitvdttawq.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dm1nbG5rYWh1aXR2ZHR0YXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNzgyODAsImV4cCI6MjA5MTY1NDI4MH0.wjTyUU9Zo-5h9zXroXYRbEZu2zFl6Q0Dpd7f1oT32ko'
)

/** POST /api/crm/enrich — enrich lead with AI-analyzed data */
export async function POST(req: NextRequest) {
  try {
    const { lead_id } = await req.json()
    if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 400 })

    const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single()
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const prompt = `You are a healthcare practice data enrichment engine. Given this lead info, estimate the missing data based on your knowledge of healthcare practices.

Lead:
- Name: ${lead.first_name} ${lead.last_name}
- Practice: ${lead.practice_name || 'Unknown'}
- Specialty: ${lead.specialty}
- Current providers: ${lead.provider_count || 'Unknown'}
- Current monthly charges: ${lead.monthly_charges || 'Unknown'}

Return ONLY a JSON object (no markdown, no backticks) with your best estimates:
{
  "estimated_providers": <number or null>,
  "estimated_monthly_charges": <number or null>,
  "estimated_annual_revenue": <number or null>,
  "practice_type": "<solo|small_group|medium_group|large_group|health_system>",
  "likely_ehr": "<best guess of their EHR system>",
  "billing_complexity": "<low|medium|high>",
  "growth_potential": "<low|medium|high>",
  "key_pain_points": ["<pain point 1>", "<pain point 2>"],
  "recommended_services": ["<service 1>", "<service 2>"],
  "talking_points": ["<point 1>", "<point 2>", "<point 3>"]
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI enrichment failed' }, { status: 500 })

    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    let enriched
    try { enriched = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim()) } catch { return NextResponse.json({ error: 'Parse error' }, { status: 500 }) }

    // Update lead with enriched data
    const updates: Record<string, any> = {}
    if (enriched.estimated_providers && !lead.provider_count) updates.provider_count = enriched.estimated_providers
    if (enriched.estimated_monthly_charges && !lead.monthly_charges) updates.monthly_charges = enriched.estimated_monthly_charges
    if (enriched.estimated_monthly_charges && !lead.revenue_potential) updates.revenue_potential = Math.round(enriched.estimated_monthly_charges * 0.08)

    if (Object.keys(updates).length > 0) {
      await supabase.from('leads').update(updates).eq('id', lead_id)
    }

    // Log enrichment
    const enrichmentNote = `AI Enrichment: ${enriched.practice_type || 'unknown'} practice, ${enriched.billing_complexity || 'unknown'} billing complexity, ${enriched.growth_potential || 'unknown'} growth potential. Pain points: ${(enriched.key_pain_points || []).join(', ')}. Recommended: ${(enriched.recommended_services || []).join(', ')}.`
    await supabase.from('activities').insert({ lead_id, type: 'note', description: enrichmentNote })

    return NextResponse.json({ success: true, enriched, updates_applied: Object.keys(updates).length })
  } catch {
    return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 })
  }
}
