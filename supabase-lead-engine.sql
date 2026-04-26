-- =========================================================
-- 🔥 TUTORS PARLIAMENT: LEAD ENGINE UPGRADE (v1.0) 🔥
-- =========================================================

-- 1. ENHANCE LEADS SCHEMA
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS step_reached INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS source_page TEXT,
ADD COLUMN IF NOT EXISTS source_cta TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS mode TEXT, -- 'online' | 'home' | 'both'
ADD COLUMN IF NOT EXISTS board TEXT,
ADD COLUMN IF NOT EXISTS course TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS exam_category TEXT,
ADD COLUMN IF NOT EXISTS prep_level TEXT,
ADD COLUMN IF NOT EXISTS skill_type TEXT,
ADD COLUMN IF NOT EXISTS skill_goal TEXT,
ADD COLUMN IF NOT EXISTS hobby_type TEXT,
ADD COLUMN IF NOT EXISTS hobby_goal TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS urgency TEXT,
ADD COLUMN IF NOT EXISTS preferred_tutor_gender TEXT,
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_temperature TEXT DEFAULT 'Cold';

-- 2. CREATE LEAD MATCHES TABLE (Join between leads and tutors)
CREATE TABLE IF NOT EXISTS lead_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    match_score INTEGER,
    match_reasons TEXT[],
    status TEXT DEFAULT 'pending', -- pending | accepted | rejected | contacting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS FOR LEAD MATCHES
ALTER TABLE lead_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert lead matches" ON lead_matches;
CREATE POLICY "Public can insert lead matches" ON lead_matches FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Only admins can view lead matches" ON lead_matches;
CREATE POLICY "Only admins can view lead matches" ON lead_matches FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Only admins can update lead matches" ON lead_matches;
CREATE POLICY "Only admins can update lead matches" ON lead_matches FOR UPDATE TO authenticated USING (true);
