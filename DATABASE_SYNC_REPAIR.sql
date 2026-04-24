-- 🔥 TUTORS PARLIAMENT: DATABASE REPAIR & SYNC 🔥
-- Run this in your Supabase SQL Editor to fix 400/404 errors

-- 1. REVENUE MODULE SYNC
-- Add missing analytics columns to payments table
ALTER TABLE IF EXISTS public.payments
  ADD COLUMN IF NOT EXISTS subscription_type  TEXT DEFAULT 'Monthly',
  ADD COLUMN IF NOT EXISTS monthly_fee        NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS start_date         DATE,
  ADD COLUMN IF NOT EXISTS expected_end_date  DATE,
  ADD COLUMN IF NOT EXISTS city               TEXT,
  ADD COLUMN IF NOT EXISTS commission_pct     NUMERIC DEFAULT 50,
  ADD COLUMN IF NOT EXISTS commission_amount  NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tutor_payout_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_status      TEXT DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS payout_date        DATE;

-- 2. INTELLIGENCE MODULE SYNC
-- Create missing tables for the Control Tower
CREATE TABLE IF NOT EXISTS public.trust_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    institute_name TEXT NOT NULL,
    city TEXT,
    trust_score INTEGER DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.entity_clusters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    primary_name TEXT NOT NULL,
    normalized_phone TEXT NOT NULL UNIQUE,
    entity_type TEXT NOT NULL, -- 'tutor' | 'parent'
    city TEXT,
    risk_score INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    unique_reporters_count INTEGER DEFAULT 0,
    categories TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.entity_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reported_by_user_id UUID REFERENCES auth.users(id),
    cluster_id UUID REFERENCES entity_clusters(id),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    city TEXT,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'verified' | 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.intelligence_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cluster_id UUID REFERENCES entity_clusters(id),
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    message TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agency_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SEO MODULE SYNC
-- Create missing SEO configuration table
CREATE TABLE IF NOT EXISTS public.seo_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
    is_indexed BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SECURITY (RLS)
-- Ensure Admins can access everything
ALTER TABLE IF EXISTS public.trust_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.entity_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.entity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.intelligence_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agency_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.seo_configurations ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admin full access" ON public.trust_users;
    CREATE POLICY "Admin full access" ON public.trust_users FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Admin full access" ON public.entity_clusters;
    CREATE POLICY "Admin full access" ON public.entity_clusters FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Admin full access" ON public.entity_reports;
    CREATE POLICY "Admin full access" ON public.entity_reports FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Admin full access" ON public.intelligence_alerts;
    CREATE POLICY "Admin full access" ON public.intelligence_alerts FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Admin full access" ON public.agency_activity_logs;
    CREATE POLICY "Admin full access" ON public.agency_activity_logs FOR ALL TO authenticated USING (true);
    
    DROP POLICY IF EXISTS "Admin full access" ON public.seo_configurations;
    CREATE POLICY "Admin full access" ON public.seo_configurations FOR ALL TO authenticated USING (true);
END $$;
