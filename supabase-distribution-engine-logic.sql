-- =========================================================
-- 🔥 DISTRIBUTION ENGINE: MATCHING & ANALYTICS 🔥
-- =========================================================

-- 1. ADD ANALYTICS & STATUS TO REGISTRATIONS
ALTER TABLE tutor_registrations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
ADD COLUMN IF NOT EXISTS step_reached INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS drop_off_status TEXT DEFAULT 'active', -- 'active', 'dropped', 'completed'
ADD COLUMN IF NOT EXISTS source_page TEXT,
ADD COLUMN IF NOT EXISTS source_cta TEXT;

-- 2. CREATE THE MATCHING ENGINE FUNCTION
-- This function finds the best tutors for a given lead based on normalized data
CREATE OR REPLACE FUNCTION match_tutors_for_lead(p_lead_id UUID)
RETURNS TABLE (
    tutor_id UUID,
    tutor_name TEXT,
    match_score INTEGER,
    match_reasons TEXT[]
) AS $$
DECLARE
    v_lead_subject TEXT;
    v_lead_class TEXT;
    v_lead_area TEXT;
    v_lead_city TEXT;
    v_lead_mode TEXT;
    v_area_id INTEGER;
BEGIN
    -- 1. Get lead details
    -- Assuming leads table has these columns. If not, we might need to adjust.
    SELECT 
        (subjects[1]), -- taking first subject for now
        class_level, 
        area, 
        city, 
        mode 
    INTO v_lead_subject, v_lead_class, v_lead_area, v_lead_city, v_lead_mode
    FROM leads 
    WHERE id = p_lead_id;

    -- 2. Resolve Lead Area ID
    SELECT id INTO v_area_id FROM areas WHERE name = v_lead_area AND city_id = (SELECT id FROM cities WHERE name = v_lead_city LIMIT 1) LIMIT 1;

    RETURN QUERY
    WITH matching_tutors AS (
        SELECT 
            tr.id as tid,
            tr.name as tname,
            -- Scoring logic
            (CASE WHEN s.id IS NOT NULL THEN 40 ELSE 0 END +
             CASE WHEN c.id IS NOT NULL THEN 30 ELSE 0 END +
             CASE WHEN loc.area_id IS NOT NULL THEN 30 ELSE 0 END) as score,
            -- Reason tracking
            ARRAY_REMOVE(ARRAY[
                CASE WHEN s.id IS NOT NULL THEN 'Subject Match' ELSE NULL END,
                CASE WHEN c.id IS NOT NULL THEN 'Class Match' ELSE NULL END,
                CASE WHEN loc.area_id IS NOT NULL THEN 'Local Area Match' ELSE NULL END
            ], NULL) as reasons
        FROM tutor_registrations tr
        -- Join with Subjects
        LEFT JOIN tutor_subjects ts ON ts.tutor_id = tr.id
        LEFT JOIN master_subjects s ON s.id = ts.subject_id AND s.name = v_lead_subject
        -- Join with Classes
        LEFT JOIN tutor_classes tc ON tc.tutor_id = tr.id
        LEFT JOIN master_classes c ON c.id = tc.class_id AND (c.label = v_lead_class OR c.value = v_lead_class)
        -- Join with Locations
        LEFT JOIN tutor_locations loc ON loc.tutor_id = tr.id AND loc.area_id = v_area_id
        WHERE tr.status = 'approved' OR tr.status = 'pending'
    )
    SELECT tid, tname, score, reasons
    FROM matching_tutors
    WHERE score > 0
    ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. CREATE A VIEW FOR DROP-OFF ANALYTICS
CREATE OR REPLACE VIEW registration_drop_offs AS
SELECT 
    id,
    name,
    phone,
    city,
    step_reached,
    created_at,
    CASE 
        WHEN step_reached = 1 THEN 'Identity & Location'
        WHEN step_reached = 2 THEN 'Teaching Profile'
        WHEN step_reached = 3 THEN 'Experience & Availability'
        WHEN step_reached = 4 THEN 'Verification'
        ELSE 'Unknown'
    END as last_step_name
FROM tutor_registrations
WHERE status = 'pending' -- Only look at pending ones as drop-offs
ORDER BY created_at DESC;
-- 4. PARAMETER-BASED MATCHING (For SEO Page Analysis)
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
    status TEXT
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
            -- Scoring logic
            (CASE WHEN (p_subject IS NULL OR s.id IS NOT NULL) THEN 40 ELSE 0 END +
             CASE WHEN (p_class_label IS NULL OR c.id IS NOT NULL) THEN 30 ELSE 0 END +
             CASE WHEN (v_area_id IS NULL OR loc.area_id IS NOT NULL) THEN 30 ELSE 0 END) as score,
            -- Reason tracking
            ARRAY_REMOVE(ARRAY[
                CASE WHEN s.id IS NOT NULL THEN 'Subject Match' ELSE NULL END,
                CASE WHEN c.id IS NOT NULL THEN 'Class Match' ELSE NULL END,
                CASE WHEN loc.area_id IS NOT NULL THEN 'Local Area Match' ELSE NULL END
            ], NULL) as reasons
        FROM tutor_registrations tr
        -- Join with Subjects
        LEFT JOIN tutor_subjects ts ON ts.tutor_id = tr.id
        LEFT JOIN master_subjects s ON s.id = ts.subject_id AND (p_subject IS NULL OR s.name ILIKE p_subject OR s.name ILIKE '%' || p_subject || '%')
        -- Join with Classes
        LEFT JOIN tutor_classes tc ON tc.tutor_id = tr.id
        LEFT JOIN master_classes c ON c.id = tc.class_id AND (p_class_label IS NULL OR c.label = p_class_label OR c.value = p_class_label)
        -- Join with Locations
        LEFT JOIN tutor_locations loc ON loc.tutor_id = tr.id AND (v_area_id IS NULL OR loc.area_id = v_area_id)
        -- Join with Boards
        LEFT JOIN tutor_boards tb ON tb.tutor_id = tr.id
        LEFT JOIN master_boards b ON b.id = tb.board_id AND (p_board_name IS NULL OR b.name = p_board_name)
        
        WHERE tr.step_reached >= 2 -- At least basic profile completed
    )
    SELECT tid, tname, tphone, MAX(score) as score, reasons, tstep, tstatus
    FROM matching_tutors
    WHERE score > 0
    GROUP BY tid, tname, tphone, reasons, tstep, tstatus
    ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;
