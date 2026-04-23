-- =========================================================
-- 🔥 REVENUE TRACKING INIT 🔥
-- Execute this entirely inside your Supabase SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS revenue_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    assignment_id UUID REFERENCES lead_tutor_assignments(id) ON DELETE CASCADE,
    note TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE revenue_notes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated Admins full pipeline access
CREATE POLICY "Admins have full access to revenue notes" 
ON revenue_notes 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
