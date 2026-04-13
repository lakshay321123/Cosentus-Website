-- Cosentus CRM Database Schema
-- Run this in Supabase SQL Editor

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  practice_name TEXT,
  specialty TEXT DEFAULT 'other' CHECK (specialty IN ('anesthesia','orthopedics','pain_management','asc','behavioral_health','urgent_care','obgyn','other')),
  provider_count INT,
  monthly_charges NUMERIC,

  ai_score INT DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
  temperature TEXT DEFAULT 'cold' CHECK (temperature IN ('hot','warm','cold')),
  revenue_potential NUMERIC,

  status TEXT DEFAULT 'new' CHECK (status IN ('new','qualified','discovery','proposal','negotiation','won','lost')),
  source TEXT DEFAULT 'other' CHECK (source IN ('website_chat','voice_agent','contact_form','referral','linkedin','event','email','other')),
  assigned_to TEXT,

  last_activity TIMESTAMPTZ DEFAULT NOW(),
  next_follow_up TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT CHECK (type IN ('call','email','chat','meeting','note','status_change','task')),
  description TEXT NOT NULL,
  metadata JSONB
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,
  type TEXT DEFAULT 'discovery' CHECK (type IN ('discovery','demo','proposal','follow_up')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  assigned_to TEXT,
  notes TEXT,
  recording_url TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_specialty ON leads(specialty);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON leads(temperature);
CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_lead ON meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled ON meetings(scheduled_at);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies (enable after setting up auth)
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
