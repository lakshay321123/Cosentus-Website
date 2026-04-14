-- Cosentus CRM Database Schema (complete)
-- Generated from live Supabase database — April 2026
-- Run this in Supabase SQL Editor to recreate all tables

-- ============================================================
-- CAMPAIGNS (referenced by leads.campaign_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'email' CHECK (type IN ('email','event','content','ad','referral','other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','completed','cancelled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  budget NUMERIC DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  leads_generated INT DEFAULT 0,
  deals_influenced INT DEFAULT 0,
  revenue_attributed NUMERIC DEFAULT 0,
  target_specialty TEXT,
  notes TEXT
);

-- ============================================================
-- LEADS
-- ============================================================
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
  tags TEXT[] DEFAULT '{}',
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  lost_reason TEXT CHECK (lost_reason IS NULL OR lost_reason IN ('competitor','budget','timing','no_response','not_a_fit','went_in_house','other')),
  stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
  expected_close_date TIMESTAMPTZ
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT CHECK (type IN ('call','email','chat','meeting','note','status_change','task')),
  description TEXT NOT NULL,
  metadata JSONB
);

-- ============================================================
-- MEETINGS
-- ============================================================
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

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  assigned_to TEXT,
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- CRM USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'sales' CHECK (role IN ('admin','sales','marketing','viewer')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('new_lead','task_overdue','meeting_soon','deal_won','workflow','system')),
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  link TEXT
);

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'other' CHECK (type IN ('proposal','contract','case_study','presentation','invoice','other')),
  file_url TEXT,
  file_size INT,
  uploaded_by TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','signed','expired')),
  is_email_template BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- EMAIL TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  category TEXT DEFAULT 'custom' CHECK (category IN ('outreach','follow_up','meeting','survey','custom')),
  variables TEXT[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  used_count INT DEFAULT 0,
  design_json TEXT
);

-- ============================================================
-- EMAIL SEQUENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','paused','completed')),
  steps JSONB DEFAULT '[]',
  enrolled_count INT DEFAULT 0,
  open_rate NUMERIC DEFAULT 0,
  reply_rate NUMERIC DEFAULT 0
);

-- ============================================================
-- SEQUENCE ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  current_step INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused','bounced','replied')),
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ
);

-- ============================================================
-- SURVEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'nps' CHECK (type IN ('nps','csat','custom')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','closed')),
  questions JSONB DEFAULT '[]',
  responses_count INT DEFAULT 0,
  avg_score NUMERIC DEFAULT 0
);

-- ============================================================
-- SURVEY RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  respondent_email TEXT,
  respondent_name TEXT,
  score INT,
  answers JSONB DEFAULT '{}',
  feedback TEXT
);

-- ============================================================
-- CRM FORMS
-- ============================================================
CREATE TABLE IF NOT EXISTS crm_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
  submissions_count INT DEFAULT 0,
  redirect_url TEXT,
  notify_email TEXT
);

-- ============================================================
-- WEBHOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  success_count INT DEFAULT 0,
  fail_count INT DEFAULT 0
);

-- ============================================================
-- WEBHOOK LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  payload JSONB,
  response_status INT,
  response_body TEXT,
  success BOOLEAN
);

-- ============================================================
-- WORKFLOWS
-- ============================================================
CREATE TABLE IF NOT EXISTS workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','draft')),
  trigger_type TEXT CHECK (trigger_type IN ('lead_created','score_change','stage_change','form_submit','manual')),
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  executions INT DEFAULT 0,
  last_executed_at TIMESTAMPTZ
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lead','meeting','task','campaign','document','workflow')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create','update','delete','stage_change','score_change','assign')),
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  metadata JSONB
);

-- ============================================================
-- FORECASTS
-- ============================================================
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  period TEXT NOT NULL UNIQUE,
  predicted_revenue NUMERIC,
  actual_revenue NUMERIC,
  predicted_deals INT,
  actual_deals INT,
  confidence NUMERIC,
  model_data JSONB
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_specialty ON leads(specialty);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON leads(temperature);
CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_lead ON meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled ON meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_tasks_lead ON tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_lead ON notifications(lead_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_documents_lead ON documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_lead ON sequence_enrollments(lead_id);
CREATE INDEX IF NOT EXISTS idx_sequence_enrollments_sequence ON sequence_enrollments(sequence_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS (enabled with allow-all policies — tighten for production)
-- ============================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;

-- NOTE: Current policies are allow-all. Replace with role-based policies
-- when client-side writes are migrated to server-side API routes.

-- ============================================================
-- STORAGE
-- ============================================================
-- Storage bucket: crm-documents (public, for file uploads)
-- Created via Supabase dashboard, not SQL
