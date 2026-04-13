import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

async function askClaude(prompt: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return ''
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
  })
  if (!res.ok) return ''
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export async function POST(req: NextRequest) {
  try {
    const { action, lead_id, context } = await req.json()

    // Fetch lead data if lead_id provided
    let lead: any = null
    let activities: any[] = []
    if (lead_id) {
      const { data: l } = await supabase.from('leads').select('*').eq('id', lead_id).single()
      lead = l
      const { data: a } = await supabase.from('activities').select('*').eq('lead_id', lead_id).order('created_at', { ascending: false }).limit(20)
      activities = a || []
    }

    const leadContext = lead ? `
Lead: ${lead.first_name} ${lead.last_name}
Practice: ${lead.practice_name || 'Unknown'}
Specialty: ${lead.specialty}
Email: ${lead.email || 'N/A'} | Phone: ${lead.phone || 'N/A'}
AI Score: ${lead.ai_score}/100 | Temperature: ${lead.temperature}
Stage: ${lead.status} | Revenue Potential: $${lead.revenue_potential || 'Unknown'}
Provider Count: ${lead.provider_count || 'Unknown'}
Monthly Charges: $${lead.monthly_charges || 'Unknown'}
Source: ${lead.source} | Assigned: ${lead.assigned_to || 'Unassigned'}
Tags: ${(lead.tags || []).join(', ') || 'None'}
Notes: ${lead.notes || 'None'}
Recent Activity: ${activities.slice(0, 5).map((a: any) => `${a.type}: ${a.description}`).join(' | ') || 'None'}
`.trim() : ''

    // ============ AI ACTIONS ============

    if (action === 'write_email') {
      const tone = context?.tone || 'professional'
      const purpose = context?.purpose || 'follow-up'
      const text = await askClaude(`You are a sales rep at Cosentus, a medical billing and RCM company with 25 years of experience. Write a ${tone} ${purpose} email to this lead.

${leadContext}

About Cosentus: Specialty RCM company, >98% net collection rate, >99% clean claim rate, up to 30% revenue growth. Uses Real + Artificial Intelligence. Independently owned.

Write ONLY the email body (no subject line, no "Subject:", no "Dear" unless appropriate). Keep it under 150 words. Be specific to their specialty. Include a clear CTA to book a call.`)

      const subject = await askClaude(`Write a short email subject line (under 50 chars) for a ${purpose} email to ${lead?.first_name || 'a prospect'} at ${lead?.practice_name || 'a medical practice'} (${lead?.specialty || 'healthcare'}). Return ONLY the subject line, nothing else.`)

      return NextResponse.json({ subject: subject.trim(), body: text.trim() })
    }

    if (action === 'meeting_prep') {
      const text = await askClaude(`You are preparing a sales rep for a meeting with a prospect. Generate a meeting prep brief.

${leadContext}

Generate:
1. KEY TALKING POINTS (3-4 bullet points specific to their specialty and pain points)
2. QUESTIONS TO ASK (3 discovery questions to uncover their billing challenges)
3. COSENTUS VALUE PROPS (2-3 points most relevant to their specialty)
4. POTENTIAL OBJECTIONS (2 likely objections and how to handle them)
5. NEXT STEPS (what to propose at end of meeting)

Be specific to ${lead?.specialty || 'their'} specialty. Keep each section concise.`)

      return NextResponse.json({ prep: text.trim() })
    }

    if (action === 'next_best_action') {
      const text = await askClaude(`You are a sales AI assistant. Based on this lead's data and activity history, what should the sales rep do RIGHT NOW? Give ONE specific, actionable recommendation.

${leadContext}

Days since last activity: ${lead ? Math.round((Date.now() - new Date(lead.last_activity).getTime()) / (24*60*60*1000)) : 'unknown'}
Current stage: ${lead?.status || 'unknown'}

Return a JSON object with:
- action: one of "send_email", "make_call", "schedule_meeting", "send_case_study", "escalate", "close", "nurture"
- reason: one sentence explaining why
- message: a specific message or talking point to use
- urgency: "high", "medium", or "low"`)

      try {
        const json = text.match(/\{[\s\S]*\}/)
        if (json) return NextResponse.json({ recommendation: JSON.parse(json[0]) })
      } catch {}
      return NextResponse.json({ recommendation: { action: 'follow_up', reason: text.slice(0, 200), urgency: 'medium' } })
    }

    if (action === 'lead_summary') {
      const text = await askClaude(`Summarize this lead in 3-4 sentences for a sales rep about to make a call. Include: who they are, what stage they're in, what they need, and the best approach.

${leadContext}`)

      return NextResponse.json({ summary: text.trim() })
    }

    if (action === 'subject_lines') {
      const purpose = context?.purpose || 'outreach'
      const text = await askClaude(`Generate 5 email subject lines for a ${purpose} email to ${lead?.first_name || 'a prospect'} at ${lead?.practice_name || 'a medical practice'} (${lead?.specialty || 'healthcare'} specialty). Cosentus is a medical billing/RCM company.

Return ONLY 5 subject lines, one per line, numbered 1-5. Each under 50 characters. Mix styles: question, stat, personal, urgency, curiosity.`)

      const lines = text.split('\n').filter(l => l.trim()).map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
      return NextResponse.json({ subject_lines: lines })
    }

    if (action === 'pipeline_risks') {
      const { data: allLeads } = await supabase.from('leads').select('*').not('status', 'in', '("won","lost")').order('last_activity', { ascending: true })
      if (!allLeads || allLeads.length === 0) return NextResponse.json({ risks: [] })

      const leadsSummary = allLeads.map(l => `${l.first_name} ${l.last_name} | ${l.practice_name} | ${l.status} | Score:${l.ai_score} | Last activity: ${l.last_activity} | Revenue: $${l.revenue_potential || 0}`).join('\n')

      const text = await askClaude(`You are a sales manager reviewing the pipeline. Identify the TOP 3 at-risk deals and explain why. Also identify the TOP 3 most likely to close soon.

Pipeline:
${leadsSummary.slice(0, 3000)}

Return a JSON object with:
- at_risk: array of { name, reason, action } (top 3 deals at risk)
- likely_close: array of { name, reason, action } (top 3 most likely to close)`)

      try {
        const json = text.match(/\{[\s\S]*\}/)
        if (json) return NextResponse.json(JSON.parse(json[0]))
      } catch {}
      return NextResponse.json({ at_risk: [], likely_close: [], raw: text.slice(0, 500) })
    }

    if (action === 'auto_tag') {
      const text = await askClaude(`Based on this lead's data, suggest 3-5 tags to categorize them. Tags should be lowercase, hyphenated, and useful for filtering (e.g., "high-value", "needs-demo", "price-sensitive", "decision-maker", "multi-location").

${leadContext}

Return ONLY the tags as a JSON array of strings.`)

      try {
        const json = text.match(/\[[\s\S]*\]/)
        if (json) return NextResponse.json({ tags: JSON.parse(json[0]) })
      } catch {}
      return NextResponse.json({ tags: [] })
    }

    return NextResponse.json({ error: 'Unknown action. Supported: write_email, meeting_prep, next_best_action, lead_summary, subject_lines, pipeline_risks, auto_tag' }, { status: 400 })
  } catch (err) {
    console.error('AI API error:', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
