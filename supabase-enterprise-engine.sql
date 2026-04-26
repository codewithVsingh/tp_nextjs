-- =========================================================
-- 🔥 TUTORS PARLIAMENT: ENTERPRISE ENGINE (v2.0) 🔥
-- =========================================================

-- 1. CLEANUP & SCHEMA SYNC
ALTER TABLE tutor_registrations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS step_reached INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS drop_off_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS drop_off_reason TEXT,
ADD COLUMN IF NOT EXISTS source_page TEXT,
ADD COLUMN IF NOT EXISTS source_cta TEXT;

-- 2. ROBUST MATCHING ENGINE
-- Drop first to ensure signature change doesn't conflict
DROP FUNCTION IF EXISTS match_tutors_for_params(TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION match_tutors_for_params(
    p_subject TEXT DEFAULT NULL,
    p_area_slug TEXT DEFAULT NULL,
    p_class_label TEXT DEFAULT NULL,
    p_board_name TEXT DEFAULT NULL
)
RETURNS TABLE (
    tutor_id UUID,
    tutor_name TEXT,
    phone TEXT,
    match_score INTEGER,
    match_reasons TEXT[],
    step_reached INTEGER,
    status TEXT,
    city TEXT,
    experience TEXT,
    qualification TEXT,
    expected_fees TEXT,
    teaching_mode TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_area_id INTEGER := NULL;
BEGIN
    -- Resolve Area ID if slug provided
    IF p_area_slug IS NOT NULL THEN
        SELECT id INTO v_area_id FROM areas WHERE slug = p_area_slug LIMIT 1;
    END IF;

    RETURN QUERY
    WITH matching_tutors AS (
        SELECT 
            tr.id as tid,
            tr.name as tname,
            tr.phone as tphone,
            tr.step_reached as tstep,
            tr.status as tstatus,
            tr.city as tcity,
            tr.experience as texp,
            tr.qualification as tqual,
            tr.expected_fees as tfees,
            tr.teaching_mode as tmode,
            tr.created_at as tcreated,
            -- Scoring logic
            (CASE WHEN (p_subject IS NULL OR EXISTS (
                SELECT 1 FROM tutor_subjects ts 
                JOIN master_subjects ms ON ms.id = ts.subject_id 
                WHERE ts.tutor_id = tr.id AND (ms.name ILIKE p_subject OR ms.name ILIKE '%' || p_subject || '%')
            )) THEN 40 ELSE 0 END +
             CASE WHEN (p_class_label IS NULL OR EXISTS (
                SELECT 1 FROM tutor_classes tc 
                JOIN master_classes mc ON mc.id = tc.class_id 
                WHERE tc.tutor_id = tr.id AND (mc.label = p_class_label OR mc.value = p_class_label)
            )) THEN 30 ELSE 0 END +
             CASE WHEN (v_area_id IS NULL OR EXISTS (
                SELECT 1 FROM tutor_locations loc 
                WHERE loc.tutor_id = tr.id AND loc.area_id = v_area_id
            )) THEN 30 ELSE 0 END) as score,
            -- Reason tracking
            ARRAY_REMOVE(ARRAY[
                CASE WHEN EXISTS (SELECT 1 FROM tutor_subjects ts JOIN master_subjects ms ON ms.id = ts.subject_id WHERE ts.tutor_id = tr.id AND (ms.name ILIKE p_subject OR ms.name ILIKE '%' || p_subject || '%')) THEN 'Subject Match' ELSE NULL END,
                CASE WHEN EXISTS (SELECT 1 FROM tutor_classes tc JOIN master_classes mc ON mc.id = tc.class_id WHERE tc.tutor_id = tr.id AND (mc.label = p_class_label OR mc.value = p_class_label)) THEN 'Class Match' ELSE NULL END,
                CASE WHEN (v_area_id IS NOT NULL AND EXISTS (SELECT 1 FROM tutor_locations loc WHERE loc.tutor_id = tr.id AND loc.area_id = v_area_id)) THEN 'Local Area Match' ELSE NULL END
            ], NULL) as reasons
        FROM tutor_registrations tr
        WHERE tr.step_reached >= 2 -- At least basic profile completed
    )
    SELECT tid, tname, tphone, score, reasons, tstep, tstatus, tcity, texp, tqual, tfees, tmode, tcreated
    FROM matching_tutors
    WHERE score > 0
    ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. DROP-OFF ANALYTICS VIEW (INTELLIGENT)
DROP VIEW IF EXISTS registration_drop_offs;
CREATE OR REPLACE VIEW registration_drop_offs AS
SELECT 
    id,
    name,
    phone,
    city,
    state,
    step_reached,
    created_at,
    CASE 
        WHEN step_reached = 1 THEN 'Identity & Location'
        WHEN step_reached = 2 THEN 'Teaching Profile'
        WHEN step_reached = 3 THEN 'Experience & Availability'
        WHEN step_reached = 4 THEN 'Verification'
        ELSE 'Unknown'
    END as last_step_name,
    CASE
        WHEN step_reached = 1 AND (city IS NULL OR city = '') THEN 'Abandoned at Location Selection'
        WHEN step_reached = 2 AND (subjects IS NULL OR array_length(subjects, 1) = 0) THEN 'Abandoned at Subject Selection'
        WHEN step_reached = 3 AND (experience IS NULL OR experience = '') THEN 'Abandoned at Experience details'
        WHEN step_reached < 4 THEN 'Likely Document Friction'
        ELSE 'Incomplete'
    END as friction_point
FROM tutor_registrations
WHERE step_reached < 4
ORDER BY created_at DESC;
