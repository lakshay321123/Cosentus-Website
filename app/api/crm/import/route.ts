import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const VALID_SPECIALTIES = ['anesthesia', 'orthopedics', 'pain_management', 'asc', 'behavioral_health', 'urgent_care', 'obgyn', 'other']
const VALID_SOURCES = ['website_chat', 'voice_agent', 'contact_form', 'referral', 'linkedin', 'event', 'email', 'other']

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, '').replace(/\s+/g, '_'))
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || []
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    return row
  }).filter(row => row.first_name || row.name || row.contact_name)
}

function normalizeSpecialty(s: string): string {
  const lower = (s || '').toLowerCase().trim()
  if (lower.includes('anesth')) return 'anesthesia'
  if (lower.includes('ortho')) return 'orthopedics'
  if (lower.includes('pain')) return 'pain_management'
  if (lower.includes('asc') || lower.includes('surgery center') || lower.includes('ambulatory')) return 'asc'
  if (lower.includes('behav') || lower.includes('mental') || lower.includes('psych')) return 'behavioral_health'
  if (lower.includes('urgent')) return 'urgent_care'
  if (lower.includes('obgyn') || lower.includes('ob/gyn')) return 'obgyn'
  return 'other'
}

function calculateScore(row: Record<string, string>): number {
  let score = 30
  const spec = normalizeSpecialty(row.specialty || '')
  if (['anesthesia', 'orthopedics', 'asc', 'pain_management'].includes(spec)) score += 15
  const providers = parseInt(row.providers || row.provider_count || '0')
  if (providers >= 10) score += 20
  else if (providers >= 5) score += 10
  const charges = parseFloat((row.monthly_charges || '0').replace(/[$,]/g, ''))
  if (charges >= 500000) score += 20
  else if (charges >= 200000) score += 15
  else if (charges >= 100000) score += 10
  if (row.email) score += 5
  if (row.phone) score += 5
  return Math.min(score, 100)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const text = await file.text()
    const rows = parseCSV(text)
    if (rows.length === 0) return NextResponse.json({ error: 'No valid rows found' }, { status: 400 })

    let imported = 0, skipped = 0, errors = 0

    for (const row of rows) {
      try {
        // Parse name
        let firstName = row.first_name || ''
        let lastName = row.last_name || ''
        if (!firstName && row.name) {
          const parts = row.name.trim().split(' ')
          firstName = parts[0]
          lastName = parts.slice(1).join(' ')
        }
        if (!firstName && row.contact_name) {
          const parts = row.contact_name.trim().split(' ')
          firstName = parts[0]
          lastName = parts.slice(1).join(' ')
        }
        if (!firstName) { skipped++; continue }

        // Check duplicate
        if (row.email) {
          const { data: existing } = await supabase.from('leads').select('id').eq('email', row.email).limit(1)
          if (existing && existing.length > 0) { skipped++; continue }
        }

        const score = calculateScore(row)
        const charges = parseFloat((row.monthly_charges || '0').replace(/[$,]/g, ''))

        await supabase.from('leads').insert({
          first_name: firstName,
          last_name: lastName || 'Unknown',
          email: row.email || null,
          phone: row.phone || null,
          practice_name: row.practice_name || row.practice || row.company || null,
          specialty: normalizeSpecialty(row.specialty || ''),
          provider_count: parseInt(row.providers || row.provider_count || '0') || null,
          monthly_charges: charges || null,
          source: VALID_SOURCES.includes(row.source || '') ? row.source : 'other',
          ai_score: score,
          temperature: score >= 75 ? 'hot' : score >= 45 ? 'warm' : 'cold',
          revenue_potential: charges ? Math.round(charges * 0.08) : null,
          status: 'new',
          notes: row.notes || `Imported from CSV on ${new Date().toLocaleDateString()}`,
          tags: ['csv-import'],
        })
        imported++
      } catch { errors++ }
    }

    return NextResponse.json({ success: true, imported, skipped, errors, total: rows.length })
  } catch (err) {
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
