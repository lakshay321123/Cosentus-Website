import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return NextResponse.json({ error: 'Config missing' }, { status: 500 })
    const res = await fetch(`${supabaseUrl}/functions/v1/run-workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
    })
    if (!res.ok) return NextResponse.json({ error: 'Workflow execution failed' }, { status: 502 })
    const data = await res.json()
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), ...data })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
