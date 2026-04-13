/**
 * CRM Lead Capture Utility
 * 
 * Call this from the chat widget or voice agent to create/update leads in the CRM.
 * 
 * Usage in ChatWidget:
 *   import { captureLeadFromChat } from '@/lib/crm-capture'
 *   await captureLeadFromChat({ first_name: 'John', last_name: 'Smith', email: 'john@practice.com', specialty: 'orthopedics' })
 * 
 * Usage in CindyVoiceAgent:
 *   import { captureLeadFromVoice } from '@/lib/crm-capture'
 *   await captureLeadFromVoice({ first_name: 'Jane', last_name: 'Doe', phone: '555-1234', practice_name: 'ABC Clinic' })
 */

interface LeadCaptureData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  practice_name?: string
  specialty?: string
  provider_count?: number
  monthly_charges?: number
  notes?: string
}

interface CaptureResult {
  success: boolean
  lead_id?: string
  ai_score?: number
  temperature?: string
  duplicate?: boolean
  error?: string
}

async function captureLead(data: LeadCaptureData, source: string): Promise<CaptureResult> {
  try {
    const res = await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, source }),
    })
    return await res.json()
  } catch (err) {
    console.error('[CRM] Lead capture failed:', err)
    return { success: false, error: 'Network error' }
  }
}

/** Call from COSE AI chat widget when lead info is collected */
export async function captureLeadFromChat(data: LeadCaptureData): Promise<CaptureResult> {
  return captureLead(data, 'website_chat')
}

/** Call from Cindy voice agent when caller info is collected */
export async function captureLeadFromVoice(data: LeadCaptureData): Promise<CaptureResult> {
  return captureLead(data, 'voice_agent')
}

/** Call from contact/revenue analysis forms */
export async function captureLeadFromForm(data: LeadCaptureData): Promise<CaptureResult> {
  return captureLead(data, 'contact_form')
}

/**
 * Extract lead info from a conversation transcript.
 * Pass the full chat transcript and this function will try to pull out contact details.
 * Returns partial data — merge with any known info before calling captureLead.
 */
export function extractLeadFromTranscript(transcript: string): Partial<LeadCaptureData> {
  const lead: Partial<LeadCaptureData> = {}

  // Email
  const emailMatch = transcript.match(/[\w.-]+@[\w.-]+\.\w{2,}/i)
  if (emailMatch) lead.email = emailMatch[0]

  // Phone
  const phoneMatch = transcript.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
  if (phoneMatch) lead.phone = phoneMatch[0]

  // Specialty keywords
  const specMap: Record<string, string> = {
    'anesthesia': 'anesthesia', 'anesthesiology': 'anesthesia',
    'orthopedic': 'orthopedics', 'ortho': 'orthopedics',
    'pain management': 'pain_management', 'pain clinic': 'pain_management',
    'surgery center': 'asc', 'asc': 'asc', 'ambulatory': 'asc',
    'behavioral': 'behavioral_health', 'mental health': 'behavioral_health', 'psychiatr': 'behavioral_health',
    'urgent care': 'urgent_care',
  }
  const lower = transcript.toLowerCase()
  for (const [keyword, spec] of Object.entries(specMap)) {
    if (lower.includes(keyword)) { lead.specialty = spec; break }
  }

  return lead
}
