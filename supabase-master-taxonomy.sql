-- =========================================================
-- 🔥 TUTORS PARLIAMENT: MASTER TAXONOMY ENGINE (v1.0) 🔥
-- =========================================================

-- 1. LEARNING CATEGORIES (Top Level)
CREATE TABLE IF NOT EXISTS learning_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LEARNING SUBCATEGORIES (Main Content Layer)
CREATE TABLE IF NOT EXISTS learning_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES learning_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LEARNING TOPICS (Granular Targeting Layer)
CREATE TABLE IF NOT EXISTS learning_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID REFERENCES learning_subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  keywords TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TUTOR TAXONOMY MAPPING (The Brain Connection)
CREATE TABLE IF NOT EXISTS tutor_taxonomy_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate', -- beginner | intermediate | advanced
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tutor_id, topic_id)
);

-- 5. RLS POLICIES
ALTER TABLE learning_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_taxonomy_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view taxonomy" ON learning_categories;
DROP POLICY IF EXISTS "Public can view subcategories" ON learning_subcategories;
DROP POLICY IF EXISTS "Public can view topics" ON learning_topics;
DROP POLICY IF EXISTS "Public can view tutor mappings" ON tutor_taxonomy_mapping;

CREATE POLICY "Public can view taxonomy" ON learning_categories FOR SELECT TO public USING (true);
CREATE POLICY "Public can view subcategories" ON learning_subcategories FOR SELECT TO public USING (true);
CREATE POLICY "Public can view topics" ON learning_topics FOR SELECT TO public USING (true);
CREATE POLICY "Public can view tutor mappings" ON tutor_taxonomy_mapping FOR SELECT TO public USING (true);

-- =========================================================
-- 📦 SEED DATA: THE INITIAL KNOWLEDGE GRAPH
-- =========================================================

-- A. Categories
INSERT INTO learning_categories (name, slug, icon, sort_order) VALUES
('My Child', 'my-child', '👨👩👧', 1),
('Myself', 'myself', '🎓', 2),
('Competitive Exams', 'competitive-exams', '🎯', 3),
('Skill / Language', 'skill-language', '💡', 4),
('Hobby / Extra', 'hobby-extra', '🎨', 5),
('Counselling', 'counselling', '🤝', 6)
ON CONFLICT (slug) DO UPDATE SET icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;

-- B. Subcategories
DO $$
DECLARE
    cat_child UUID;
    cat_self UUID;
    cat_exam UUID;
    cat_skill UUID;
    cat_hobby UUID;
    cat_counsel UUID;
    sub_school UUID;
    sub_grad UUID;
    sub_eng UUID;
    sub_prog UUID;
    sub_music UUID;
    sub_counsel_career UUID;
BEGIN
    SELECT id INTO cat_child FROM learning_categories WHERE slug = 'my-child' LIMIT 1;
    SELECT id INTO cat_self FROM learning_categories WHERE slug = 'myself' LIMIT 1;
    SELECT id INTO cat_exam FROM learning_categories WHERE slug = 'competitive-exams' LIMIT 1;
    SELECT id INTO cat_skill FROM learning_categories WHERE slug = 'skill-language' LIMIT 1;
    SELECT id INTO cat_hobby FROM learning_categories WHERE slug = 'hobby-extra' LIMIT 1;
    SELECT id INTO cat_counsel FROM learning_categories WHERE slug = 'counselling' LIMIT 1;

    -- My Child Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_child, 'School Tuition', 'school-tuition') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_school;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_child, 'Early Learning', 'early-learning') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_child, 'Special Education', 'special-education') ON CONFLICT (slug) DO NOTHING;

    -- Myself Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_self, 'Graduation Subjects', 'graduation-subjects') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_grad;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_self, 'Post Graduation', 'post-graduation') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_self, 'Professional Courses', 'professional-courses') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_self, 'School Tuition (Adult)', 'school-tuition-adult') ON CONFLICT (slug) DO NOTHING;

    -- Competitive Exams Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_exam, 'Engineering Exams', 'engineering-exams') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_eng;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_exam, 'Medical Exams', 'medical-exams') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_exam, 'Government Exams', 'government-exams') ON CONFLICT (slug) DO NOTHING;

    -- Skill Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_skill, 'Programming', 'programming') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_prog;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_skill, 'Design', 'design') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_skill, 'Languages', 'languages') ON CONFLICT (slug) DO NOTHING;

    -- Hobby Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_hobby, 'Music', 'music') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_music;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_hobby, 'Dance', 'dance') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_hobby, 'Fitness', 'fitness') ON CONFLICT (slug) DO NOTHING;

    -- Counselling Subcategories
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_counsel, 'Career Counselling', 'career-counselling') 
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_counsel_career;
    
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_counsel, 'Student Counselling', 'student-counselling') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_counsel, 'Parent Counselling', 'parent-counselling') ON CONFLICT (slug) DO NOTHING;
    INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_counsel, 'Personal Wellbeing', 'personal-wellbeing') ON CONFLICT (slug) DO NOTHING;

    -- C. Topics
    -- School (Comprehensive list + All Subjects)
    INSERT INTO learning_topics (subcategory_id, name, slug) VALUES 
    (sub_school, 'All Subjects', 'all-subjects'),
    (sub_school, 'Mathematics', 'math'),
    (sub_school, 'Physics', 'physics'),
    (sub_school, 'Chemistry', 'chemistry'),
    (sub_school, 'Biology', 'biology'),
    (sub_school, 'English Literature', 'english-lit'),
    (sub_school, 'Hindi', 'hindi'),
    (sub_school, 'Sanskrit', 'sanskrit'),
    (sub_school, 'Computer Science', 'cs-school'),
    (sub_school, 'EVS / Social Studies', 'evs-sst')
    ON CONFLICT (slug) DO NOTHING;

    -- Hobby / Extra (Niche Skills)
    DECLARE
        sub_extra UUID;
    BEGIN
        INSERT INTO learning_subcategories (category_id, name, slug) VALUES (cat_hobby, 'Niche Skills', 'niche-skills')
        ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id RETURNING id INTO sub_extra;

        INSERT INTO learning_topics (subcategory_id, name, slug) VALUES 
        (sub_extra, 'Handwriting Improvement', 'handwriting'),
        (sub_extra, 'Calligraphy', 'calligraphy'),
        (sub_extra, 'Abacus Training', 'abacus'),
        (sub_extra, 'Vedic Maths', 'vedic-maths'),
        (sub_extra, 'Speed Writing', 'speed-writing'),
        (sub_extra, 'Phonics', 'phonics')
        ON CONFLICT (slug) DO NOTHING;
    END;

    -- Music
    INSERT INTO learning_topics (subcategory_id, name, slug) VALUES 
    (sub_music, 'Acoustic Guitar', 'guitar-acoustic'),
    (sub_music, 'Electric Guitar', 'guitar-electric'),
    (sub_music, 'Piano / Keyboard', 'piano'),
    (sub_music, 'Vocal Singing', 'vocal-singing'),
    (sub_music, 'Violin', 'violin'),
    (sub_music, 'Drums', 'drums')
    ON CONFLICT (slug) DO NOTHING;

    -- Counselling Topics (High Precision)
    INSERT INTO learning_topics (subcategory_id, name, slug) VALUES 
    (sub_counsel_career, 'Stream Selection (After 10th)', 'stream-selection'),
    (sub_counsel_career, 'Career Path (After 12th)', 'career-path-12th'),
    (sub_counsel_career, 'Overseas Education Consulting', 'overseas-ed'),
    (sub_counsel_career, 'Psychometric Testing', 'psychometric')
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- 6. TESTIMONIALS ENGINE (Social Proof Layer)
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    result TEXT,
    text TEXT NOT NULL,
    initials TEXT,
    type TEXT DEFAULT 'student', -- student | parent
    verified BOOLEAN DEFAULT true,
    rating INTEGER DEFAULT 5,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active testimonials" ON testimonials;
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- 🛡️ TRUST & SECURITY ENGINE (The Intelligence Layer)
-- =========================================================

-- 6a. ENTITY REPORTS (Signal Input)
CREATE TABLE IF NOT EXISTS public.entity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- tutor | parent
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    normalized_phone TEXT NOT NULL,
    city TEXT,
    category TEXT,
    fraud_type TEXT,
    issue_type TEXT,
    description TEXT,
    severity TEXT DEFAULT 'medium', -- low | medium | high | critical
    has_evidence BOOLEAN DEFAULT false,
    reporter_credibility_snapshot FLOAT DEFAULT 1.0,
    amount FLOAT DEFAULT 0,
    reported_by_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was already created in a previous version
ALTER TABLE public.entity_reports ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'medium';
ALTER TABLE public.entity_reports ADD COLUMN IF NOT EXISTS has_evidence BOOLEAN DEFAULT false;
ALTER TABLE public.entity_reports ADD COLUMN IF NOT EXISTS reporter_credibility_snapshot FLOAT DEFAULT 1.0;

-- 6b. INTELLIGENCE ALERTS (Anomaly Tracking)
CREATE TABLE IF NOT EXISTS public.intelligence_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_phone TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    message TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Policies
ALTER TABLE public.entity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Institutes can manage their own reports" ON public.entity_reports;
CREATE POLICY "Institutes can manage their own reports" ON public.entity_reports 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view intelligence" ON public.intelligence_alerts;
CREATE POLICY "Authenticated can view intelligence" ON public.intelligence_alerts 
FOR SELECT TO authenticated USING (true);

-- 7. RISK INTELLIGENCE ENGINE (Core Brain)
DROP FUNCTION IF EXISTS public.get_risk_score(TEXT) CASCADE;

-- Function to calculate dynamic risk score (0-100)
CREATE OR REPLACE FUNCTION public.get_risk_score(target_phone TEXT)
RETURNS JSONB AS $$
DECLARE
    final_score FLOAT := 0;
    report_count INT;
    unique_agencies INT;
    risk_level TEXT;
    base_points FLOAT := 0;
BEGIN
    -- 1. Aggregrate signals for this identity
    SELECT 
        COUNT(*),
        COUNT(DISTINCT reported_by_user_id),
        COALESCE(SUM(
            CASE 
                WHEN severity = 'critical' THEN 40
                WHEN severity = 'high' THEN 25
                WHEN severity = 'medium' THEN 15
                ELSE 5
            END * 
            (CASE WHEN has_evidence THEN 1.5 ELSE 1.0 END) *
            (CASE 
                WHEN created_at > NOW() - INTERVAL '30 days' THEN 1.0
                WHEN created_at > NOW() - INTERVAL '90 days' THEN 0.7
                WHEN created_at > NOW() - INTERVAL '180 days' THEN 0.4
                ELSE 0.1
            END)
        ), 0)
    INTO report_count, unique_agencies, base_points
    FROM public.entity_reports
    WHERE normalized_phone = target_phone;

    -- 2. Apply Agency Multiplier (Network Effect)
    -- Reports from multiple unique agencies carry exponential weight
    final_score := base_points * (1 + (unique_agencies * 0.2));

    -- 3. Cap and Leveling
    final_score := LEAST(100, GREATEST(0, final_score));

    IF final_score >= 80 THEN risk_level := 'BLACKLISTED';
    ELSIF final_score >= 50 THEN risk_level := 'RISKY';
    ELSIF final_score >= 20 THEN risk_level := 'CAUTION';
    ELSE risk_level := 'SAFE';
    END IF;

    RETURN jsonb_build_object(
        'score', ROUND(final_score::numeric, 0),
        'level', risk_level,
        'signals', report_count,
        'agencies', unique_agencies
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Materialized View for instant dashboard lookups
DROP MATERIALIZED VIEW IF EXISTS public.entity_intelligence_matrix;
CREATE MATERIALIZED VIEW public.entity_intelligence_matrix AS
SELECT 
    normalized_phone,
    (public.get_risk_score(normalized_phone)->>'score')::INT as risk_score,
    (public.get_risk_score(normalized_phone)->>'level') as risk_level,
    (public.get_risk_score(normalized_phone)->>'signals')::INT as total_signals,
    MAX(created_at) as last_seen
FROM public.entity_reports
GROUP BY normalized_phone;

CREATE UNIQUE INDEX IF NOT EXISTS idx_matrix_phone ON public.entity_intelligence_matrix(normalized_phone);

-- Trigger to refresh matrix
CREATE OR REPLACE FUNCTION public.refresh_intelligence_matrix()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.entity_intelligence_matrix;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 8. REPORTER REPUTATION ENGINE (The Immunology Layer)
CREATE TABLE IF NOT EXISTS public.reporter_trust_metrics (
    user_id UUID PRIMARY KEY,
    trust_score FLOAT DEFAULT 0.5, -- 0.0 to 1.0 (Neutral start)
    total_verified_reports INT DEFAULT 0,
    total_rejected_reports INT DEFAULT 0,
    is_power_contributor BOOLEAN DEFAULT false,
    last_recalculation TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.report_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.entity_reports(id) ON DELETE CASCADE,
    verified_by_admin_id UUID,
    outcome TEXT NOT NULL, -- verified | rejected | disputed
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update reporter trust based on verification outcome
CREATE OR REPLACE FUNCTION public.update_reporter_trust()
RETURNS TRIGGER AS $$
DECLARE
    reporter_id UUID;
    v_outcome TEXT;
    current_trust FLOAT;
BEGIN
    -- Get the reporter of the original report
    SELECT reported_by_user_id INTO reporter_id FROM public.entity_reports WHERE id = NEW.report_id;
    v_outcome := NEW.outcome;

    -- Ensure metrics entry exists
    INSERT INTO public.reporter_trust_metrics (user_id) 
    VALUES (reporter_id) 
    ON CONFLICT (user_id) DO NOTHING;

    -- Calculate new trust
    SELECT trust_score INTO current_trust FROM public.reporter_trust_metrics WHERE user_id = reporter_id;

    IF v_outcome = 'verified' THEN
        current_trust := LEAST(1.0, current_trust + 0.05);
    ELSIF v_outcome = 'rejected' THEN
        current_trust := GREATEST(0.0, current_trust - 0.20);
    ELSIF v_outcome = 'disputed' THEN
        current_trust := current_trust * 0.5; -- Massive penalty
    END IF;

    UPDATE public.reporter_trust_metrics 
    SET 
        trust_score = current_trust,
        total_verified_reports = total_verified_reports + (CASE WHEN v_outcome = 'verified' THEN 1 ELSE 0 END),
        total_rejected_reports = total_rejected_reports + (CASE WHEN v_outcome = 'rejected' THEN 1 ELSE 0 END),
        last_recalculation = NOW()
    WHERE user_id = reporter_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_on_verification ON public.report_verifications;
CREATE TRIGGER trg_on_verification
AFTER INSERT ON public.report_verifications
FOR EACH ROW EXECUTE FUNCTION public.update_reporter_trust();

-- v2 of Risk Score Engine (Now accounts for Reporter Trust)
CREATE OR REPLACE FUNCTION public.get_risk_score(target_phone TEXT)
RETURNS JSONB AS $$
DECLARE
    final_score FLOAT := 0;
    report_count INT;
    unique_agencies INT;
    risk_level TEXT;
    base_points FLOAT := 0;
BEGIN
    -- 1. Aggregrate signals with Reporter Trust Weighting
    SELECT 
        COUNT(*),
        COUNT(DISTINCT r.reported_by_user_id),
        COALESCE(SUM(
            (CASE 
                WHEN r.severity = 'critical' THEN 40
                WHEN r.severity = 'high' THEN 25
                WHEN r.severity = 'medium' THEN 15
                ELSE 5
            END) * 
            (CASE WHEN r.has_evidence THEN 1.5 ELSE 1.0 END) *
            (CASE 
                WHEN r.created_at > NOW() - INTERVAL '30 days' THEN 1.0
                WHEN r.created_at > NOW() - INTERVAL '90 days' THEN 0.7
                WHEN r.created_at > NOW() - INTERVAL '180 days' THEN 0.4
                ELSE 0.1
            END) *
            COALESCE(tm.trust_score, 0.5) -- THE REPUTATION MULTIPLIER
        ), 0)
    INTO report_count, unique_agencies, base_points
    FROM public.entity_reports r
    LEFT JOIN public.reporter_trust_metrics tm ON r.reported_by_user_id = tm.user_id
    WHERE r.normalized_phone = target_phone;

    -- 2. Apply Agency Multiplier (Network Effect)
    final_score := base_points * (1 + (unique_agencies * 0.2));

    -- 3. Cap and Leveling
    final_score := LEAST(100, GREATEST(0, final_score));

    IF final_score >= 80 THEN risk_level := 'BLACKLISTED';
    ELSIF final_score >= 50 THEN risk_level := 'RISKY';
    ELSIF final_score >= 20 THEN risk_level := 'CAUTION';
    ELSE risk_level := 'SAFE';
    END IF;

    RETURN jsonb_build_object(
        'score', ROUND(final_score::numeric, 0),
        'level', risk_level,
        'signals', report_count,
        'agencies', unique_agencies
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. EVIDENCE & VERIFICATION ENGINE (The Truth Layer)
ALTER TABLE public.entity_reports 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted'; -- submitted | under_review | verified | rejected | disputed

CREATE TABLE IF NOT EXISTS public.report_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.entity_reports(id) ON DELETE CASCADE,
    evidence_url TEXT NOT NULL,
    evidence_type TEXT, -- screenshot | document | audio
    strength_score INT DEFAULT 5, -- 1 to 10
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.report_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.entity_reports(id) ON DELETE CASCADE,
    disputed_by_user_id UUID,
    reason TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT DEFAULT 'pending', -- pending | resolved | dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.verification_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.entity_reports(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- status_change | evidence_added | dispute_raised
    previous_state TEXT,
    new_state TEXT,
    performed_by_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- v3 of Risk Score Engine (Now accounts for Reporter Trust AND Verification Status)
CREATE OR REPLACE FUNCTION public.get_risk_score(target_phone TEXT)
RETURNS JSONB AS $$
DECLARE
    final_score FLOAT := 0;
    report_count INT;
    unique_agencies INT;
    risk_level TEXT;
    base_points FLOAT := 0;
BEGIN
    -- 1. Aggregrate signals with Truth & Reputation Weighting
    SELECT 
        COUNT(*),
        COUNT(DISTINCT r.reported_by_user_id),
        COALESCE(SUM(
            (CASE 
                WHEN r.severity = 'critical' THEN 40
                WHEN r.severity = 'high' THEN 25
                WHEN r.severity = 'medium' THEN 15
                ELSE 5
            END) * 
            (CASE WHEN r.has_evidence THEN 1.5 ELSE 1.0 END) *
            -- THE TRUTH MULTIPLIER (Lifecycle Weight)
            (CASE 
                WHEN r.status = 'verified' THEN 1.0
                WHEN r.status = 'disputed' THEN -0.5 -- Dispute reduces impact significantly
                WHEN r.status = 'rejected' THEN 0.0
                ELSE 0.3 -- Submitted / Under Review starts at 30% weight
            END) *
            (CASE 
                WHEN r.created_at > NOW() - INTERVAL '30 days' THEN 1.0
                WHEN r.created_at > NOW() - INTERVAL '90 days' THEN 0.7
                WHEN r.created_at > NOW() - INTERVAL '180 days' THEN 0.4
                ELSE 0.1
            END) *
            COALESCE(tm.trust_score, 0.5) -- THE REPUTATION MULTIPLIER
        ), 0)
    INTO report_count, unique_agencies, base_points
    FROM public.entity_reports r
    LEFT JOIN public.reporter_trust_metrics tm ON r.reported_by_user_id = tm.user_id
    WHERE r.normalized_phone = target_phone;

    -- 2. Apply Agency Multiplier (Network Effect)
    final_score := base_points * (1 + (unique_agencies * 0.2));

    -- 3. Cap and Leveling
    final_score := LEAST(100, GREATEST(0, final_score));

    IF final_score >= 80 THEN risk_level := 'BLACKLISTED';
    ELSIF final_score >= 50 THEN risk_level := 'RISKY';
    ELSIF final_score >= 20 THEN risk_level := 'CAUTION';
    ELSE risk_level := 'SAFE';
    END IF;

    RETURN jsonb_build_object(
        'score', ROUND(final_score::numeric, 0),
        'level', risk_level,
        'signals', report_count,
        'agencies', unique_agencies
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger to Auto-Verify based on Consensus
CREATE OR REPLACE FUNCTION public.check_for_auto_verify()
RETURNS TRIGGER AS $$
DECLARE
    high_trust_reports INT;
BEGIN
    -- Logic: If 3+ DIFFERENT agencies with trust > 0.8 report same phone with evidence
    SELECT COUNT(DISTINCT r.reported_by_user_id) INTO high_trust_reports
    FROM public.entity_reports r
    JOIN public.reporter_trust_metrics tm ON r.reported_by_user_id = tm.user_id
    WHERE r.normalized_phone = NEW.normalized_phone
      AND tm.trust_score >= 0.8
      AND r.has_evidence = true;

    IF high_trust_reports >= 3 THEN
        UPDATE public.entity_reports 
        SET status = 'verified' 
        WHERE normalized_phone = NEW.normalized_phone AND status = 'submitted';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_verify ON public.entity_reports;
CREATE TRIGGER trg_auto_verify
AFTER INSERT ON public.entity_reports
FOR EACH ROW EXECUTE FUNCTION public.check_for_auto_verify();

-- 10. ANOMALY DETECTION & TRUST EVOLUTION (Anti-Gaming)
CREATE TABLE IF NOT EXISTS public.reporter_anomaly_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.reporter_trust_metrics(user_id),
    anomaly_type TEXT NOT NULL, -- mass_reporting | suspicious_evidence | collusion_flag
    severity_score INT DEFAULT 5,
    is_investigated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to detect mass-reporting anomalies
CREATE OR REPLACE FUNCTION public.detect_reporting_anomalies()
RETURNS TRIGGER AS $$
DECLARE
    recent_count INT;
BEGIN
    -- Count reports by this user in the last hour
    SELECT COUNT(*) INTO recent_count 
    FROM public.entity_reports 
    WHERE reported_by_user_id = NEW.reported_by_user_id 
      AND created_at > NOW() - INTERVAL '1 hour';

    IF recent_count >= 5 THEN
        INSERT INTO public.reporter_anomaly_logs (user_id, anomaly_type, severity_score)
        VALUES (NEW.reported_by_user_id, 'mass_reporting', 8);
        
        -- Automatically freeze trust for investigation
        UPDATE public.reporter_trust_metrics 
        SET trust_score = trust_score * 0.8 
        WHERE user_id = NEW.reported_by_user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_detect_anomalies ON public.entity_reports;
CREATE TRIGGER trg_detect_anomalies
AFTER INSERT ON public.entity_reports
FOR EACH ROW EXECUTE FUNCTION public.detect_reporting_anomalies();

-- Evolution: Trust Forgiveness Logic (Runs daily or on recalculation)
CREATE OR REPLACE FUNCTION public.apply_trust_evolution(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    last_rejection TIMESTAMP WITH TIME ZONE;
    current_trust FLOAT;
BEGIN
    SELECT trust_score INTO current_trust FROM public.reporter_trust_metrics WHERE user_id = target_user_id;
    
    -- Find last rejected report
    SELECT MAX(created_at) INTO last_rejection 
    FROM public.report_verifications v
    JOIN public.entity_reports r ON v.report_id = r.id
    WHERE r.reported_by_user_id = target_user_id AND v.outcome = 'rejected';

    -- If no rejections in 90 days, apply forgiveness (+0.1 trust)
    IF last_rejection IS NULL OR last_rejection < NOW() - INTERVAL '90 days' THEN
        UPDATE public.reporter_trust_metrics 
        SET trust_score = LEAST(1.0, trust_score + 0.1)
        WHERE user_id = target_user_id AND trust_score < 0.8;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 11. THE SENTINEL SYSTEM (Watchlist & Real-Time Alerts)
CREATE TABLE IF NOT EXISTS public.user_watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    normalized_phone TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, normalized_phone)
);

CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'normal', -- low | normal | high | emergency
    is_read BOOLEAN DEFAULT false,
    meta_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to trigger alerts when risk crosses thresholds
CREATE OR REPLACE FUNCTION public.process_sentinel_alerts()
RETURNS TRIGGER AS $$
DECLARE
    watcher RECORD;
    alert_msg TEXT;
    risk_level TEXT;
BEGIN
    risk_level := NEW.risk_level;

    -- 1. Check for Watchlist Hits
    FOR watcher IN 
        SELECT user_id FROM public.user_watchlist WHERE normalized_phone = NEW.normalized_phone
    LOOP
        INSERT INTO public.notification_queue (user_id, title, message, priority, meta_data)
        VALUES (
            watcher.user_id, 
            'Watchlist Update', 
            'An entity on your watchlist (' || NEW.normalized_phone || ') has a new risk status: ' || risk_level,
            'high',
            jsonb_build_object('phone', NEW.normalized_phone, 'score', NEW.risk_score)
        );
    END LOOP;

    -- 2. Threshold Escalation (System-wide Global Alerts for extreme cases)
    IF NEW.risk_score >= 85 AND (OLD.risk_score < 85 OR OLD.risk_score IS NULL) THEN
        -- Log as high-priority alert for ALL relevant agencies (Future: Location filtered)
        INSERT INTO public.intelligence_alerts (entity_phone, alert_type, message)
        VALUES (NEW.normalized_phone, 'blacklist_escalation', 'EMERGENCY: Entity ' || NEW.normalized_phone || ' has been Blacklisted by the network.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on the materialized view refresh is not possible directly, 
-- but we can trigger when the matrix entries are updated via the refresh function
-- Actually, a better approach: add this logic to the refresh trigger itself or a separate after statement trigger.
-- For now, let's tie it to report insertions which eventually update the matrix.

DROP TRIGGER IF EXISTS trg_sentinel_watch ON public.entity_reports;
CREATE TRIGGER trg_sentinel_watch
AFTER INSERT OR UPDATE ON public.entity_reports
FOR EACH ROW EXECUTE FUNCTION public.process_sentinel_alerts();

-- 12. CONTRIBUTION GATE & DATA ECONOMY (The Incentive Layer)
ALTER TABLE public.reporter_trust_metrics 
ADD COLUMN IF NOT EXISTS contribution_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS access_level INT DEFAULT 0; -- 0: Explorer | 1: Strategist | 2: Elite

-- Function to calculate Contribution Score and update Access Level
CREATE OR REPLACE FUNCTION public.recalculate_contribution_score(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    new_score INT := 0;
    v_count INT;
    r_count INT;
    e_bonus INT;
BEGIN
    -- 1. Base Score calculation
    SELECT total_verified_reports, total_rejected_reports 
    INTO v_count, r_count 
    FROM public.reporter_trust_metrics WHERE user_id = target_user_id;

    -- Verified = +10, Rejected = -50
    new_score := (COALESCE(v_count, 0) * 10) - (COALESCE(r_count, 0) * 50);

    -- 2. Evidence Bonus
    SELECT COALESCE(SUM(strength_score), 0) INTO e_bonus
    FROM public.report_evidence e
    JOIN public.entity_reports r ON e.report_id = r.id
    WHERE r.reported_by_user_id = target_user_id AND r.status = 'verified';

    new_score := new_score + e_bonus;

    -- 3. Determine Access Level
    -- Level 0: 0-19 pts
    -- Level 1: 20-99 pts
    -- Level 2: 100+ pts
    UPDATE public.reporter_trust_metrics 
    SET 
        contribution_score = GREATEST(0, new_score),
        access_level = (CASE 
            WHEN new_score >= 100 THEN 2
            WHEN new_score >= 20 THEN 1
            ELSE 0
        END)
    WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update contribution on verification change
CREATE OR REPLACE FUNCTION public.trigger_contribution_update()
RETURNS TRIGGER AS $$
DECLARE
    reporter_id UUID;
BEGIN
    SELECT reported_by_user_id INTO reporter_id FROM public.entity_reports WHERE id = NEW.report_id;
    PERFORM public.recalculate_contribution_score(reporter_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_contribution ON public.report_verifications;
CREATE TRIGGER trg_update_contribution
AFTER INSERT OR UPDATE ON public.report_verifications
FOR EACH ROW EXECUTE FUNCTION public.trigger_contribution_update();

-- Contribution Decay (Tax on silence)
CREATE OR REPLACE FUNCTION public.apply_contribution_decay()
RETURNS VOID AS $$
BEGIN
    -- If no verified report in 30 days, reduce score by 5
    UPDATE public.reporter_trust_metrics
    SET contribution_score = GREATEST(0, contribution_score - 5)
    WHERE user_id NOT IN (
        SELECT reported_by_user_id FROM public.entity_reports 
        WHERE status = 'verified' AND created_at > NOW() - INTERVAL '30 days'
    );
    
    -- Re-evaluate levels for everyone affected
    UPDATE public.reporter_trust_metrics 
    SET access_level = (CASE 
            WHEN contribution_score >= 100 THEN 2
            WHEN contribution_score >= 20 THEN 1
            ELSE 0
        END);
END;
$$ LANGUAGE plpgsql;

-- 13. AGENCY CRM & WORKFLOW SYSTEM (The Operational Core)
CREATE TABLE IF NOT EXISTS public.agency_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_phone TEXT NOT NULL,
    parent_name TEXT,
    student_name TEXT,
    subject TEXT,
    location_slug TEXT, -- Links to your existing slug system
    budget TEXT,
    status TEXT DEFAULT 'new', -- new | contacted | demo_scheduled | converted | dropped
    priority TEXT DEFAULT 'normal', -- low | normal | high
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.agency_leads(id) ON DELETE CASCADE,
    tutor_phone TEXT NOT NULL,
    tutor_name TEXT,
    status TEXT DEFAULT 'offered', -- offered | accepted | demo_pending | assigned | rejected
    commission_agreed FLOAT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.agency_leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES auth.users(id),
    interaction_type TEXT NOT NULL, -- call | note | status_change | demo
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.commission_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.lead_assignments(id) ON DELETE CASCADE,
    total_fee FLOAT,
    commission_amount FLOAT,
    status TEXT DEFAULT 'pending', -- pending | partially_paid | paid | defaulted
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation: Auto-create Interaction Log on Lead Status Change
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.lead_interactions (lead_id, agent_id, interaction_type, content)
        VALUES (NEW.id, NEW.agency_id, 'status_change', 'Status updated from ' || OLD.status || ' to ' || NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- RLS & Privacy for Agency CRM
ALTER TABLE public.agency_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agencies can manage their own leads" ON public.agency_leads;
CREATE POLICY "Agencies can manage their own leads" ON public.agency_leads 
    FOR ALL USING (agency_id = auth.uid()) WITH CHECK (agency_id = auth.uid());

DROP POLICY IF EXISTS "Agencies can manage their own assignments" ON public.lead_assignments;
CREATE POLICY "Agencies can manage their own assignments" ON public.lead_assignments 
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.agency_leads 
        WHERE id = lead_assignments.lead_id AND agency_id = auth.uid()
    )) WITH CHECK (EXISTS (
        SELECT 1 FROM public.agency_leads 
        WHERE id = lead_assignments.lead_id AND agency_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Agencies can manage their own interactions" ON public.lead_interactions;
CREATE POLICY "Agencies can manage their own interactions" ON public.lead_interactions 
    FOR ALL USING (agent_id = auth.uid()) WITH CHECK (agent_id = auth.uid());

DROP TRIGGER IF EXISTS trg_log_lead_status ON public.agency_leads;
CREATE TRIGGER trg_log_lead_status
AFTER UPDATE ON public.agency_leads
FOR EACH ROW EXECUTE FUNCTION public.log_lead_status_change();

-- 14. TUTOR SUPPLY ENGINE (Reputation & Matching)
DROP TABLE IF EXISTS public.tutor_reputation_metrics CASCADE;
DROP TABLE IF EXISTS public.tutor_locations CASCADE;
DROP TABLE IF EXISTS public.tutor_subjects CASCADE;
DROP TABLE IF EXISTS public.tutor_profiles CASCADE;

CREATE TABLE IF NOT EXISTS public.tutor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    normalized_phone TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    experience_years INT DEFAULT 0,
    min_fee FLOAT,
    max_fee FLOAT,
    mode TEXT DEFAULT 'both', -- online | offline | both
    bio TEXT,
    verification_level TEXT DEFAULT 'basic', -- basic | verified | premium
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tutor_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    grade_level TEXT,
    CONSTRAINT fk_subjects_tutor FOREIGN KEY (tutor_id) REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    UNIQUE(tutor_id, subject_name, grade_level)
);

CREATE TABLE IF NOT EXISTS public.tutor_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    location_slug TEXT NOT NULL, -- Links to your existing city/area slugs
    UNIQUE(tutor_id, location_slug)
);

CREATE TABLE IF NOT EXISTS public.tutor_reputation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    reputation_score INT DEFAULT 50, -- 0-100
    total_assignments INT DEFAULT 0,
    demo_conversion_rate FLOAT DEFAULT 0.0,
    last_recalculation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_reputation_tutor FOREIGN KEY (tutor_id) REFERENCES public.tutor_profiles(id) ON DELETE CASCADE
);

-- RLS & Permissions for Supply Engine
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_reputation_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on tutor_profiles" ON public.tutor_profiles;
CREATE POLICY "Allow public select on tutor_profiles" ON public.tutor_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on tutor_subjects" ON public.tutor_subjects;
CREATE POLICY "Allow public select on tutor_subjects" ON public.tutor_subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on tutor_locations" ON public.tutor_locations;
CREATE POLICY "Allow public select on tutor_locations" ON public.tutor_locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on tutor_reputation_metrics" ON public.tutor_reputation_metrics;
CREATE POLICY "Allow public select on tutor_reputation_metrics" ON public.tutor_reputation_metrics FOR SELECT USING (true);

-- Seed Data for Supply Engine
INSERT INTO public.tutor_profiles (full_name, normalized_phone, verification_level, bio, min_fee)
VALUES 
('Dr. Arjun Sharma', '9876543210', 'premium', 'Ex-IIT Professor specializing in Advanced Physics and Mathematics.', 1200),
('Sarah Jenkins', '9988776655', 'verified', 'CELTA certified English educator with 8 years of international experience.', 800),
('Vikas Singh', '9123456789', 'premium', 'Senior coding mentor specializing in Full Stack Development and AI.', 1500)
ON CONFLICT (normalized_phone) DO NOTHING;

INSERT INTO public.tutor_subjects (tutor_id, subject_name, grade_level)
SELECT id, 'Physics', 'Senior' FROM public.tutor_profiles WHERE full_name = 'Dr. Arjun Sharma'
UNION ALL
SELECT id, 'English', 'Primary' FROM public.tutor_profiles WHERE full_name = 'Sarah Jenkins'
UNION ALL
SELECT id, 'Computer Science', 'Advanced' FROM public.tutor_profiles WHERE full_name = 'Vikas Singh'
ON CONFLICT DO NOTHING;

INSERT INTO public.tutor_reputation_metrics (tutor_id, reputation_score, total_assignments)
SELECT id, 95, 120 FROM public.tutor_profiles WHERE full_name = 'Dr. Arjun Sharma'
UNION ALL
SELECT id, 88, 45 FROM public.tutor_profiles WHERE full_name = 'Sarah Jenkins'
UNION ALL
SELECT id, 92, 85 FROM public.tutor_profiles WHERE full_name = 'Vikas Singh'
ON CONFLICT DO NOTHING;

-- Grant Explicit Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Function to match tutors for a specific Lead (High Speed)
DROP FUNCTION IF EXISTS public.match_tutors_for_lead(UUID);
CREATE OR REPLACE FUNCTION public.match_tutors_for_lead(p_lead_id UUID)
RETURNS TABLE (
    tutor_id UUID,
    full_name TEXT,
    reputation_score INT,
    risk_score INT,
    match_iq INT
) AS $$
DECLARE
    v_subject TEXT;
    v_location TEXT;
BEGIN
    -- Get lead details
    SELECT subject, location_slug INTO v_subject, v_location 
    FROM public.agency_leads WHERE id = p_lead_id;

    RETURN QUERY
    SELECT 
        tp.id as tutor_id,
        tp.full_name,
        tr.reputation_score,
        COALESCE(m.risk_score, 0) as risk_score,
        -- Match IQ Formula: Reputation + (Subject Match Bonus) - (Risk Penalty)
        (tr.reputation_score + 20 - COALESCE(m.risk_score, 0)) as match_iq
    FROM public.tutor_profiles tp
    JOIN public.tutor_reputation_metrics tr ON tp.id = tr.tutor_id
    JOIN public.tutor_subjects ts ON tp.id = ts.tutor_id
    JOIN public.tutor_locations tl ON tp.id = tl.tutor_id
    LEFT JOIN public.entity_intelligence_matrix m ON tp.normalized_phone = m.normalized_phone
    WHERE ts.subject_name ILIKE v_subject
      AND tl.location_slug = v_location
      AND tp.is_active = true
    ORDER BY match_iq DESC;
END;
$$ LANGUAGE plpgsql;

-- Matrix Refresh Trigger (Final Anchor)
DROP TRIGGER IF EXISTS trg_refresh_matrix ON public.entity_reports;
CREATE TRIGGER trg_refresh_matrix
AFTER INSERT OR UPDATE OR DELETE ON public.entity_reports
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_intelligence_matrix();

-- 15. LEAD EXCHANGE SYSTEM (Marketplace & Distribution)
DROP TABLE IF EXISTS public.exchange_claims CASCADE;
DROP TABLE IF EXISTS public.exchange_leads CASCADE;

-- Core Exchange Table
CREATE TABLE public.exchange_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin_agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_phone TEXT NOT NULL,
    normalized_phone TEXT NOT NULL,
    parent_name TEXT,
    subject TEXT NOT NULL,
    grade_level TEXT,
    location_slug TEXT NOT NULL,
    budget_min FLOAT,
    budget_max FLOAT,
    mode TEXT DEFAULT 'both', -- online | offline | both
    notes TEXT,
    commission_percent FLOAT DEFAULT 50.0,
    payment_terms TEXT DEFAULT 'First Month 50%',
    visibility TEXT DEFAULT 'public', -- public | restricted | private
    status TEXT DEFAULT 'available', -- available | claimed | assigned | closed | expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours')
);

-- Claim Tracking
CREATE TABLE public.exchange_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.exchange_leads(id) ON DELETE CASCADE,
    claimer_agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending | accepted | rejected | converted
    claimer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lead_id, claimer_agency_id)
);

-- RLS & Permissions for Exchange
ALTER TABLE public.exchange_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public leads visible to all agencies" ON public.exchange_leads;
CREATE POLICY "Public leads visible to all agencies" ON public.exchange_leads
    FOR SELECT USING (visibility = 'public' OR origin_agency_id = auth.uid());

DROP POLICY IF EXISTS "Agencies can manage their own exchange leads" ON public.exchange_leads;
CREATE POLICY "Agencies can manage their own exchange leads" ON public.exchange_leads
    FOR ALL USING (origin_agency_id = auth.uid()) WITH CHECK (origin_agency_id = auth.uid());

DROP POLICY IF EXISTS "Agencies can manage their own claims" ON public.exchange_claims;
CREATE POLICY "Agencies can manage their own claims" ON public.exchange_claims
    FOR ALL USING (claimer_agency_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.exchange_leads WHERE id = exchange_claims.lead_id AND origin_agency_id = auth.uid()
    )) WITH CHECK (claimer_agency_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.exchange_leads WHERE id = exchange_claims.lead_id AND origin_agency_id = auth.uid()
    ));

-- View: Marketplace with Risk Signals
DROP VIEW IF EXISTS public.view_exchange_marketplace;
CREATE VIEW public.view_exchange_marketplace AS
SELECT 
    el.*,
    m.risk_score as parent_risk_score,
    m.risk_level as parent_risk_level,
    (SELECT COUNT(*) FROM public.exchange_claims WHERE lead_id = el.id) as claim_count
FROM public.exchange_leads el
LEFT JOIN public.entity_intelligence_matrix m ON el.normalized_phone = m.normalized_phone
WHERE el.status = 'available' AND el.expires_at > NOW();

GRANT SELECT ON public.view_exchange_marketplace TO anon, authenticated;
GRANT ALL ON public.exchange_leads TO authenticated;
GRANT ALL ON public.exchange_claims TO authenticated;
