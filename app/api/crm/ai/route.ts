import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function askClaude(prompt: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
  })
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

type AIAction = 'write_email' | 'meeting_prep' | 'next_best_action' | 'lead_summary' | 'subject_lines' | 'pipeline_risks' | 'auto_tag' | 'write_block' | 'improve_text'

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const body = await req.json()
    const action: AIAction = body.action
    const lead_id: string | undefined = body.lead_id
    const context: Record<string, string> = body.context || {}

    if (!action) return NextResponse.json({ error: 'action required. Supported: write_email, meeting_prep, next_best_action, lead_summary, subject_lines, pipeline_risks, auto_tag, write_block, improve_text' }, { status: 400 })

    // Fetch lead context (sanitized — no raw email/phone sent to model)
    let leadContext = ''
    let lead: any = null
    if (lead_id) {
      const { data: l } = await supabase.from('leads').select('first_name, last_name, practice_name, specialty, ai_score, temperature, status, revenue_potential, provider_count, monthly_charges, source, assigned_to, tags, notes').eq('id', lead_id).single()
      lead = l
      const { data: a } = await supabase.from('activities').select('type, description, created_at').eq('lead_id', lead_id).order('created_at', { ascending: false }).limit(10)
      if (lead) {
        leadContext = `Lead: ${lead.first_name} ${lead.last_name}\nPractice: ${lead.practice_name || 'Unknown'}\nSpecialty: ${lead.specialty}\nScore: ${lead.ai_score}/100 | Temp: ${lead.temperature}\nStage: ${lead.status} | Revenue: $${lead.revenue_potential || 'Unknown'}\nProviders: ${lead.provider_count || 'Unknown'} | Monthly: $${lead.monthly_charges || 'Unknown'}\nSource: ${lead.source} | Assigned: ${lead.assigned_to || 'Unassigned'}\nTags: ${(lead.tags || []).join(', ') || 'None'}\nActivity: ${(a || []).slice(0, 5).map((x: any) => `${x.type}: ${x.description}`).join(' | ') || 'None'}`
      }
    }

    const cosentusContext = 'Cosentus: 25-year specialty medical billing & RCM company. >98% net collection, >99% clean claims, up to 30% revenue growth. Uses Real + Artificial Intelligence. Independently owned.'

    if (action === 'write_email') {
      const tone = context.tone || 'professional'
      const purpose = context.purpose || 'follow-up'
      const text = await askClaude(`You are a sales rep at Cosentus. Write a ${tone} ${purpose} email.\n\n${leadContext}\n\n${cosentusContext}\n\nWrite ONLY the email body. Under 150 words. Specific to their specialty. Include CTA to book a call.`)
      const subject = await askClaude(`Write one email subject line under 50 chars for a ${purpose} email to a ${lead?.specialty || 'healthcare'} practice. Return ONLY the subject line.`)
      return NextResponse.json({ subject: subject.trim(), body: text.trim() })
    }

    if (action === 'write_block') {
      const blockType = context.block_type || 'text'
      const purpose = context.purpose || 'marketing email body'
      const text = await askClaude(`Write content for a ${blockType} block in a marketing email for Cosentus.\nPurpose: ${purpose}\n${leadContext ? `\nTarget: ${leadContext}` : ''}\n${cosentusContext}\n\nWrite ONLY the content. ${blockType === 'heading' ? 'One line, under 10 words.' : 'Under 80 words. Conversational, not salesy.'}`)
      return NextResponse.json({ content: text.trim() })
    }

    if (action === 'improve_text') {
      const text = context.text || ''
      const instruction = context.instruction || 'make it more compelling and professional'
      if (!text) return NextResponse.json({ error: 'context.text required' }, { status: 400 })
      const improved = await askClaude(`Improve this email text. Instruction: ${instruction}\n\nOriginal:\n${text.slice(0, 1000)}\n\nReturn ONLY the improved text. Keep same approximate length.`)
      return NextResponse.json({ content: improved.trim() })
    }

    if (action === 'subject_lines') {
      const purpose = context.purpose || 'outreach'
      const text = await askClaude(`Generate 5 email subject lines for a ${purpose} email to a ${lead?.specialty || 'healthcare'} practice. ${cosentusContext}\n\nReturn ONLY 5 subject lines, one per line, numbered. Each under 50 chars.`)
      const lines = text.split('\n').filter((l: string) => l.trim()).map((l: string) => l.replace(/^\d+[\.\)]\s*/, '').trim())
      return NextResponse.json({ subject_lines: lines })
    }

    if (action === 'meeting_prep') {
      const text = await askClaude(`Generate a meeting prep brief for a sales call.\n\n${leadContext}\n\n${cosentusContext}\n\nInclude:\n1. KEY TALKING POINTS (3-4)\n2. QUESTIONS TO ASK (3)\n3. VALUE PROPS (2-3 for their specialty)\n4. LIKELY OBJECTIONS (2 + how to handle)\n5. NEXT STEPS`)
      return NextResponse.json({ prep: text.trim() })
    }

    if (action === 'next_best_action') {
      const days = lead ? Math.round((Date.now() - new Date(lead.last_activity || lead.created_at).getTime()) / (24*60*60*1000)) : 0
      const text = await askClaude(`Based on this lead, what should the sales rep do RIGHT NOW? One specific recommendation.\n\n${leadContext}\nDays since activity: ${days}\n\nReturn JSON: { "action": "send_email|make_call|schedule_meeting|send_case_study|escalate|close|nurture", "reason": "one sentence", "message": "specific talking point", "urgency": "high|medium|low" }`)
      try { const json = text.match(/\{[\s\S]*\}/); if (json) return NextResponse.json({ recommendation: JSON.parse(json[0]) }) } catch {}
      return NextResponse.json({ recommendation: { action: 'follow_up', reason: text.slice(0, 200), urgency: 'medium' } })
    }

    if (action === 'lead_summary') {
      const text = await askClaude(`Summarize this lead in 3-4 sentences for a sales rep about to call.\n\n${leadContext}`)
      return NextResponse.json({ summary: text.trim() })
    }

    if (action === 'pipeline_risks') {
      const { data: allLeads } = await supabase.from('leads').select('first_name, last_name, practice_name, status, ai_score, last_activity, revenue_potential').not('status', 'in', '("won","lost")').order('last_activity', { ascending: true })
      if (!allLeads?.length) return NextResponse.json({ at_risk: [], likely_close: [] })
      const summary = allLeads.map((l: any) => `${l.first_name} ${l.last_name} | ${l.practice_name} | ${l.status} | Score:${l.ai_score} | Last:${l.last_activity} | $${l.revenue_potential || 0}`).join('\n')
      const text = await askClaude(`Identify TOP 3 at-risk deals and TOP 3 likely to close.\n\nPipeline:\n${summary.slice(0, 3000)}\n\nReturn JSON: { "at_risk": [{"name":"...","reason":"...","action":"..."}], "likely_close": [{"name":"...","reason":"...","action":"..."}] }`)
      try { const json = text.match(/\{[\s\S]*\}/); if (json) return NextResponse.json(JSON.parse(json[0])) } catch {}
      return NextResponse.json({ at_risk: [], likely_close: [] })
    }

    if (action === 'auto_tag') {
      const text = await askClaude(`Suggest 3-5 tags for this lead. Tags: lowercase, hyphenated, useful for filtering.\n\n${leadContext}\n\nReturn ONLY a JSON array of strings.`)
      try { const json = text.match(/\[[\s\S]*\]/); if (json) return NextResponse.json({ tags: JSON.parse(json[0]) }) } catch {}
      return NextResponse.json({ tags: [] })
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
