-- =========================================================
-- 🚀 TUTORS PARLIAMENT: ENTERPRISE SCALING PHASE 🚀
-- Goal: Normalize all tutor attributes for 10,000+ scaling
-- =========================================================

-- 1. MASTER TABLES (Metadata Control)
CREATE TABLE IF NOT EXISTS master_subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT, -- e.g., 'Academic', 'Music', 'Language'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master_classes (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS master_boards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS master_languages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS master_days (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS master_time_slots (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    sort_order INTEGER
);

-- 2. NORMALIZATION JOIN TABLES (High Performance Matching)
CREATE TABLE IF NOT EXISTS tutor_subjects (
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES master_subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, subject_id)
);

CREATE TABLE IF NOT EXISTS tutor_classes (
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES master_classes(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, class_id)
);

CREATE TABLE IF NOT EXISTS tutor_boards (
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    board_id INTEGER REFERENCES master_boards(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, board_id)
);

CREATE TABLE IF NOT EXISTS tutor_languages (
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES master_languages(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, language_id)
);

CREATE TABLE IF NOT EXISTS tutor_availability (
    tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
    day_id INTEGER REFERENCES master_days(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES master_time_slots(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, day_id, slot_id)
);

-- 3. SEED INITIAL DATA (Matching Frontend Constants)
INSERT INTO master_subjects (name) VALUES 
('Mathematics'), ('Physics'), ('Chemistry'), ('Biology'), 
('English'), ('Hindi'), ('Science'), ('Social Studies'), 
('Computer Science'), ('Economics'), ('Accountancy'), 
('French'), ('German'), ('Spanish')
ON CONFLICT (name) DO NOTHING;

INSERT INTO master_classes (label, value, sort_order) VALUES 
('1–5', '1-5', 1), 
('6–8', '6-8', 2), 
('9–10', '9-10', 3), 
('11–12', '11-12', 4), 
('Competitive Exams', 'competitive', 5)
ON CONFLICT (value) DO NOTHING;

INSERT INTO master_boards (name) VALUES 
('CBSE'), ('ICSE'), ('IB'), ('State Board'), ('IGCSE')
ON CONFLICT (name) DO NOTHING;

INSERT INTO master_languages (name) VALUES 
('English'), ('Hindi'), ('Punjabi'), ('Urdu'), ('French'), ('German'), ('Spanish')
ON CONFLICT (name) DO NOTHING;

INSERT INTO master_days (name, sort_order) VALUES 
('Monday', 1), ('Tuesday', 2), ('Wednesday', 3), ('Thursday', 4), ('Friday', 5), ('Saturday', 6), ('Sunday', 7)
ON CONFLICT (name) DO NOTHING;

INSERT INTO master_time_slots (label, sort_order) VALUES 
('Morning (8–12)', 1), ('Afternoon (12–4)', 2), ('Evening (4–8)', 3)
ON CONFLICT (label) DO NOTHING;

-- 4. ENABLE RLS
ALTER TABLE master_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES
CREATE POLICY "Public read master_subjects" ON master_subjects FOR SELECT TO public USING (true);
CREATE POLICY "Public read master_classes" ON master_classes FOR SELECT TO public USING (true);
CREATE POLICY "Public read master_boards" ON master_boards FOR SELECT TO public USING (true);
CREATE POLICY "Public read master_languages" ON master_languages FOR SELECT TO public USING (true);
CREATE POLICY "Public read master_days" ON master_days FOR SELECT TO public USING (true);
CREATE POLICY "Public read master_time_slots" ON master_time_slots FOR SELECT TO public USING (true);

CREATE POLICY "Public insert tutor_subjects" ON tutor_subjects FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert tutor_classes" ON tutor_classes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert tutor_boards" ON tutor_boards FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert tutor_languages" ON tutor_languages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert tutor_availability" ON tutor_availability FOR INSERT TO public WITH CHECK (true);

-- Indexes for ultra-fast matching
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_sid ON tutor_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_tutor_classes_cid ON tutor_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_tutor_locations_aid ON tutor_locations(area_id);
CREATE INDEX IF NOT EXISTS idx_tutor_avail_day ON tutor_availability(day_id);
CREATE INDEX IF NOT EXISTS idx_tutor_avail_slot ON tutor_availability(slot_id);
