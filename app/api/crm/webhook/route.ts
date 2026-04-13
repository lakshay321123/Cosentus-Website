import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const header = req.headers.get('x-webhook-secret')
      if (header !== webhookSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { event, data, source } = await req.json()
    if (!event) return NextResponse.json({ error: 'event required' }, { status: 400 })

    let result: any = { error: 'Unknown event' }; let status = 400

    if (event === 'lead.create' && data) {
      const res = await fetch(`${req.nextUrl.origin}/api/crm/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: source || 'other' }) })
      result = await res.json(); status = res.status
    } else if (event === 'lead.update' && data?.lead_id) {
      const allowed = ['status', 'notes', 'assigned_to', 'tags', 'temperature']
      const updates: Record<string, unknown> = {}
      for (const k of allowed) { if (data[k] !== undefined) updates[k] = data[k] }
      const { error } = await supabase.from('leads').update(updates).eq('id', data.lead_id)
      result = error ? { error: error.message } : { success: true }; status = error ? 500 : 200
    } else if (event === 'activity.create' && data?.lead_id) {
      const { error } = await supabase.from('activities').insert({ lead_id: data.lead_id, type: data.type || 'note', description: data.description || 'External activity' })
      result = error ? { error: error.message } : { success: true }; status = error ? 500 : 200
    } else if (event === 'meeting.create' && data?.lead_id) {
      const { error } = await supabase.from('meetings').insert({ lead_id: data.lead_id, scheduled_at: data.scheduled_at, type: data.type || 'discovery', duration_minutes: data.duration || 30, assigned_to: data.assigned_to, status: 'scheduled' })
      result = error ? { error: error.message } : { success: true }; status = error ? 500 : 200
    }

    await supabase.from('webhook_logs').insert({ event, payload: { source }, response_status: status, response_body: JSON.stringify(result), success: status < 400 })
    await fireOutbound(event, data)
    return NextResponse.json(result, { status })
  } catch {
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('crm_session')?.value
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabase.from('webhooks').select('id, name, url, events, is_active, success_count, fail_count, last_triggered').order('created_at', { ascending: false })
  return NextResponse.json({ webhooks: data || [] })
}

async function fireOutbound(event: string, data: unknown) {
  const { data: hooks } = await supabase.from('webhooks').select('*').eq('is_active', true).contains('events', [event])
  if (!hooks) return
  for (const hook of hooks) {
    try {
      const res = await fetch(hook.url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(hook.secret ? { 'X-Webhook-Secret': hook.secret } : {}) }, body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }) })
      const success = res.ok
      await supabase.from('webhooks').update({ last_triggered: new Date().toISOString(), ...(success ? { success_count: (hook.success_count || 0) + 1 } : { fail_count: (hook.fail_count || 0) + 1 }) }).eq('id', hook.id)
    } catch {
      await supabase.from('webhooks').update({ fail_count: (hook.fail_count || 0) + 1 }).eq('id', hook.id)
    }
  }
}
