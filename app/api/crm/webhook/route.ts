import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

/** POST /api/crm/webhook — receive external events */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data, source, secret } = body

    // Verify webhook secret if configured
    if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
    }

    // Handle different event types
    if (event === 'lead.create' && data) {
      const res = await fetch(`${req.nextUrl.origin}/api/crm/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: source || 'other' }),
      })
      const result = await res.json()
      await logWebhook(event, body, res.status, result)
      return NextResponse.json(result)
    }

    if (event === 'lead.update' && data?.lead_id) {
      const updates: Record<string, unknown> = {}
      if (data.status) updates.status = data.status
      if (data.notes) updates.notes = data.notes
      if (data.assigned_to) updates.assigned_to = data.assigned_to
      if (data.tags) updates.tags = data.tags
      const { error } = await supabase.from('leads').update(updates).eq('id', data.lead_id)
      const result = error ? { error: error.message } : { success: true }
      await logWebhook(event, body, error ? 500 : 200, result)
      return NextResponse.json(result, { status: error ? 500 : 200 })
    }

    if (event === 'activity.create' && data?.lead_id) {
      const { error } = await supabase.from('activities').insert({
        lead_id: data.lead_id, type: data.type || 'note', description: data.description || 'External activity',
      })
      const result = error ? { error: error.message } : { success: true }
      await logWebhook(event, body, error ? 500 : 200, result)
      return NextResponse.json(result, { status: error ? 500 : 200 })
    }

    if (event === 'meeting.create' && data?.lead_id) {
      const { error } = await supabase.from('meetings').insert({
        lead_id: data.lead_id, scheduled_at: data.scheduled_at, type: data.type || 'discovery',
        duration_minutes: data.duration || 30, assigned_to: data.assigned_to, status: 'scheduled',
      })
      const result = error ? { error: error.message } : { success: true }
      await logWebhook(event, body, error ? 500 : 200, result)
      return NextResponse.json(result, { status: error ? 500 : 200 })
    }

    // Fire outbound webhooks for internal events
    if (event === 'internal.lead_created' || event === 'internal.deal_won') {
      await fireOutboundWebhooks(event, data)
      return NextResponse.json({ success: true })
    }

    await logWebhook(event || 'unknown', body, 400, { error: 'Unknown event' })
    return NextResponse.json({ error: 'Unknown event type', supported: ['lead.create', 'lead.update', 'activity.create', 'meeting.create'] }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

/** GET /api/crm/webhook — list registered webhooks */
export async function GET() {
  const { data } = await supabase.from('webhooks').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ webhooks: data || [] })
}

async function logWebhook(event: string, payload: unknown, status: number, response: unknown) {
  await supabase.from('webhook_logs').insert({ event, payload, response_status: status, response_body: JSON.stringify(response), success: status < 400 })
}

async function fireOutboundWebhooks(event: string, data: unknown) {
  const { data: hooks } = await supabase.from('webhooks').select('*').eq('is_active', true).contains('events', [event])
  if (!hooks) return
  for (const hook of hooks) {
    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(hook.secret ? { 'X-Webhook-Secret': hook.secret } : {}) },
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
      })
      await supabase.from('webhooks').update({ last_triggered: new Date().toISOString(), success_count: (hook.success_count || 0) + 1 }).eq('id', hook.id)
      await logWebhook(event, data, res.status, { sent_to: hook.url })
    } catch (err) {
      await supabase.from('webhooks').update({ fail_count: (hook.fail_count || 0) + 1 }).eq('id', hook.id)
      await logWebhook(event, data, 500, { error: String(err), url: hook.url })
    }
  }
}
