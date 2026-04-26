-- =========================================================
-- 🔥 TUTORS PARLIAMENT: ENTERPRISE LEAD NORMALIZATION 🔥
-- =========================================================

-- 1. JOIN TABLES FOR LEADS (High Performance Matching)
CREATE TABLE IF NOT EXISTS lead_subjects (
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES master_subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, subject_id)
);

CREATE TABLE IF NOT EXISTS lead_classes (
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES master_classes(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, class_id)
);

CREATE TABLE IF NOT EXISTS lead_boards (
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    board_id INTEGER REFERENCES master_boards(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, board_id)
);

-- 2. ENHANCE LEADS TABLE FOR DROP-OFF ANALYTICS
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS abandoned_at_step TEXT,
ADD COLUMN IF NOT EXISTS lead_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. RLS POLICIES
ALTER TABLE lead_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert lead subjects" ON lead_subjects FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert lead classes" ON lead_classes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert lead boards" ON lead_boards FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view lead details" ON lead_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view lead classes" ON lead_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view lead boards" ON lead_boards FOR SELECT TO authenticated USING (true);
