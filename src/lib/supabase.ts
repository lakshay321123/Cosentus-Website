import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') console.warn('Supabase env vars missing — CRM features will not work')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

export type Specialty = 'anesthesia' | 'orthopedics' | 'pain_management' | 'asc' | 'behavioral_health' | 'urgent_care' | 'obgyn' | 'other'
export type Temperature = 'hot' | 'warm' | 'cold'
export type LeadStatus = 'new' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'website_chat' | 'voice_agent' | 'contact_form' | 'referral' | 'linkedin' | 'event' | 'email' | 'other'

export interface Lead {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  practice_name: string | null
  specialty: Specialty
  provider_count: number | null
  monthly_charges: number | null
  ai_score: number
  temperature: Temperature
  revenue_potential: number | null
  status: LeadStatus
  source: LeadSource
  assigned_to: string | null
  last_activity: string
  next_follow_up: string | null
  notes: string | null
  tags: string[]
  campaign_id: string | null
}

export interface Activity {
  id: string
  lead_id: string | null
  created_at: string
  type: 'call' | 'email' | 'chat' | 'meeting' | 'note' | 'status_change' | 'task'
  description: string
  metadata: Record<string, unknown> | null
}

export interface Meeting {
  id: string
  lead_id: string | null
  created_at: string
  scheduled_at: string
  duration_minutes: number
  type: 'discovery' | 'demo' | 'proposal' | 'follow_up'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  assigned_to: string | null
  notes: string | null
  recording_url: string | null
}
