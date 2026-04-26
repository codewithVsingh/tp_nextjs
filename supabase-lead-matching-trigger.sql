-- =========================================================
-- 🔥 TUTORS PARLIAMENT: LEAD MATCHING ENGINE (v1.0) 🔥
-- =========================================================

-- 1. AUTO-MATCH FUNCTION
-- This function takes a lead and finds the best tutors, then populates lead_matches
CREATE OR REPLACE FUNCTION match_lead_to_tutors(p_lead_id UUID) 
RETURNS VOID AS $$
DECLARE
    v_subject TEXT;
    v_area TEXT;
    v_class TEXT;
    v_board TEXT;
BEGIN
    -- 1. Get lead parameters
    SELECT 
        (SELECT name FROM UNNEST(subjects) name LIMIT 1), -- Primary subject
        area,
        class_level,
        board
    INTO v_subject, v_area, v_class, v_board
    FROM leads 
    WHERE id = p_lead_id;

    -- 2. Clear old matches for this lead (if any)
    DELETE FROM lead_matches WHERE lead_id = p_lead_id;

    -- 3. Run matching logic and insert top 10 matches
    INSERT INTO lead_matches (lead_id, tutor_id, match_score, match_reasons)
    SELECT 
        p_lead_id,
        m.tutor_id,
        m.match_score,
        m.match_reasons
    FROM match_tutors_for_params(
        v_subject,
        v_area,
        v_class,
        v_board
    ) m
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 2. TRIGGER ON LEAD COMPLETION
-- Fires when a lead finishes the form (step_reached = 11 or similar)
CREATE OR REPLACE FUNCTION trigger_lead_matching()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger matching if the lead has reached the final step
    -- and they have at least subjects/area filled.
    IF (NEW.step_reached >= 8 AND (OLD.step_reached < 8 OR OLD.step_reached IS NULL)) THEN
        PERFORM match_lead_to_tutors(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_lead_completion_match ON leads;
CREATE TRIGGER on_lead_completion_match
AFTER UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_lead_matching();
