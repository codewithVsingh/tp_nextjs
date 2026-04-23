-- =========================================================
-- 🔥 TUTOR ASSIGNMENT SYSTEM INIT 🔥
-- Execute this entirely inside your Supabase SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS lead_tutor_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    lead_id UUID,
    lead_name TEXT,
    lead_phone TEXT,
    location TEXT,
    class_level TEXT,
    tutor_id UUID,
    tutor_name TEXT,
    tutor_phone TEXT,
    start_date DATE NOT NULL,
    fee NUMERIC,
    notes TEXT,
    status TEXT DEFAULT 'Active'::text
);

-- Enable RLS
ALTER TABLE lead_tutor_assignments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated Admins full pipeline access
CREATE POLICY "Admins have full access to assignments" 
ON lead_tutor_assignments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
