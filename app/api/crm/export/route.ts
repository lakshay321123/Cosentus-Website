import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twvmglnkahuitvdttawq.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dm1nbG5rYWh1aXR2ZHR0YXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNzgyODAsImV4cCI6MjA5MTY1NDI4MH0.wjTyUU9Zo-5h9zXroXYRbEZu2zFl6Q0Dpd7f1oT32ko'
)

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from('leads').select('*').order('ai_score', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = ['First Name','Last Name','Email','Phone','Practice','Specialty','Providers','Monthly Charges','AI Score','Temperature','Status','Source','Assigned To','Revenue Potential','Created','Notes']
  const rows = (data || []).map(l => [
    l.first_name, l.last_name, l.email || '', l.phone || '', l.practice_name || '',
    l.specialty, l.provider_count || '', l.monthly_charges || '',
    l.ai_score, l.temperature, l.status, l.source, l.assigned_to || '',
    l.revenue_potential || '', l.created_at?.split('T')[0] || '', (l.notes || '').replace(/,/g, ';'),
  ])

  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cosentus-leads-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
