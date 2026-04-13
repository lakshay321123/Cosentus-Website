import { NextRequest, NextResponse } from 'next/server'
import { generateEmail, templateList } from '@/lib/email-templates'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

/** POST — preview or send an email */
export async function POST(req: NextRequest) {
  const { template_id, lead_id, action, sender_name, sender_title } = await req.json()

  // Get lead data if provided
  let leadData: any = {}
  if (lead_id) {
    const { data } = await supabase.from('leads').select('*').eq('id', lead_id).single()
    if (data) leadData = data
  }

  const emailData = {
    first_name: leadData.first_name || 'there',
    last_name: leadData.last_name || '',
    practice_name: leadData.practice_name || 'your practice',
    specialty: leadData.specialty || 'healthcare',
    sender_name: sender_name || 'Allen Ranjan',
    sender_title: sender_title || 'Chief Revenue Officer',
  }

  const { subject, html, text } = generateEmail(template_id, emailData)

  if (action === 'preview') {
    return NextResponse.json({ subject, html, text })
  }

  if (action === 'send') {
    // Log the email activity
    if (lead_id) {
      await supabase.from('activities').insert({
        lead_id,
        type: 'email',
        description: `Email sent: "${subject}" (template: ${template_id})`,
      })
    }
    // In production, integrate with SendGrid/SES here
    return NextResponse.json({ success: true, message: 'Email logged (connect SendGrid for actual sending)', subject })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

/** GET — list available templates */
export async function GET() {
  return NextResponse.json({ templates: templateList })
}
