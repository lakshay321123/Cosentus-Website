import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ── Types ── */
export type LeadStatus = 'new' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'website_chat' | 'voice_agent' | 'contact_form' | 'referral' | 'linkedin' | 'event' | 'email' | 'other'
export type LeadTemp = 'hot' | 'warm' | 'cold'
export type Specialty = 'anesthesia' | 'orthopedics' | 'pain_management' | 'asc' | 'behavioral_health' | 'urgent_care' | 'obgyn' | 'other'

export interface Lead {
  id: string
  created_at: string
  updated_at: string

  /* Contact */
  first_name: string
  last_name: string
  email: string
  phone: string
  practice_name: string
  specialty: Specialty
  provider_count: number | null
  monthly_charges: number | null

  /* Scoring */
  ai_score: number
  temperature: LeadTemp
  revenue_potential: number | null

  /* Pipeline */
  status: LeadStatus
  source: LeadSource
  assigned_to: string | null

  /* Tracking */
  last_activity: string
  next_follow_up: string | null
  notes: string | null
  tags: string[]
}

export interface Activity {
  id: string
  lead_id: string
  created_at: string
  type: 'call' | 'email' | 'chat' | 'meeting' | 'note' | 'status_change' | 'task'
  description: string
  metadata: Record<string, unknown> | null
}

export interface Meeting {
  id: string
  lead_id: string
  created_at: string
  scheduled_at: string
  duration_minutes: number
  type: 'discovery' | 'demo' | 'proposal' | 'follow_up'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  assigned_to: string
  notes: string | null
  recording_url: string | null
}
