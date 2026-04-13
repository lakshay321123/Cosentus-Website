import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const SCORING_PROMPT = `You are an AI lead scoring engine for Cosentus, a healthcare revenue cycle management company. Analyze this lead and return ONLY a JSON object with no other text.

Score from 0-100 based on:
- Specialty match (anesthesia, orthopedics, pain management, ASC, behavioral health are high value)
- Practice size (provider count and monthly charges)
- Source quality (website chat and voice agent indicate high intent)
- Contact completeness (email + phone = more engaged)
- Notes/conversation signals (urgency, pain points, switching intent)

Return exactly this JSON format:
{"score": <number 0-100>, "temperature": "<hot|warm|cold>", "reasoning": "<1-2 sentence explanation>", "next_action": "<recommended next step>", "revenue_estimate": <monthly revenue potential in dollars>}`

export async function POST(req: NextRequest) {
  try {
    const { lead_id } = await req.json()
    if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 400 })

    // Fetch lead with activities
    const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single()
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const { data: activities } = await supabase.from('activities').select('*').eq('lead_id', lead_id).order('created_at', { ascending: false }).limit(10)

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Fallback to rule-based scoring
      return NextResponse.json(ruleBasedScore(lead))
    }

    const leadContext = `
Lead: ${lead.first_name} ${lead.last_name}
Practice: ${lead.practice_name || 'Unknown'}
Specialty: ${lead.specialty}
Providers: ${lead.provider_count || 'Unknown'}
Monthly Charges: ${lead.monthly_charges ? '$' + lead.monthly_charges.toLocaleString() : 'Unknown'}
Source: ${lead.source}
Current Stage: ${lead.status}
Email: ${lead.email || 'None'}
Phone: ${lead.phone || 'None'}
Notes: ${lead.notes || 'None'}
Activities: ${(activities || []).map(a => `${a.type}: ${a.description}`).join('; ') || 'None'}
Tags: ${(lead.tags || []).join(', ') || 'None'}
`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SCORING_PROMPT,
        messages: [{ role: 'user', content: leadContext }],
      }),
    })

    if (!response.ok) return NextResponse.json(ruleBasedScore(lead))

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let result
    try {
      result = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
    } catch {
      return NextResponse.json(ruleBasedScore(lead))
    }

    // Update lead in database
    await supabase.from('leads').update({
      ai_score: Math.min(Math.max(result.score, 0), 100),
      temperature: result.temperature,
      revenue_potential: result.revenue_estimate || lead.revenue_potential,
    }).eq('id', lead_id)

    // Log activity
    await supabase.from('activities').insert({
      lead_id, type: 'note',
      description: `AI Score updated to ${result.score} (${result.temperature}). ${result.reasoning} Next: ${result.next_action}`,
    })

    return NextResponse.json({
      score: result.score,
      temperature: result.temperature,
      reasoning: result.reasoning,
      next_action: result.next_action,
      revenue_estimate: result.revenue_estimate,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  }
}

function ruleBasedScore(lead: any) {
  let score = 30
  const highValue = ['anesthesia', 'orthopedics', 'asc', 'pain_management']
  if (highValue.includes(lead.specialty)) score += 15
  if ((lead.provider_count || 0) >= 10) score += 20
  else if ((lead.provider_count || 0) >= 5) score += 10
  if ((lead.monthly_charges || 0) >= 500000) score += 20
  else if ((lead.monthly_charges || 0) >= 200000) score += 15
  else if ((lead.monthly_charges || 0) >= 100000) score += 10
  if (lead.email) score += 5
  if (lead.phone) score += 5
  if (['website_chat', 'contact_form', 'voice_agent'].includes(lead.source)) score += 10
  score = Math.min(score, 100)
  const temperature = score >= 75 ? 'hot' : score >= 45 ? 'warm' : 'cold'
  return { score, temperature, reasoning: 'Rule-based scoring (AI unavailable)', next_action: 'Review lead manually', revenue_estimate: (lead.monthly_charges || 0) * 0.08 }
}
