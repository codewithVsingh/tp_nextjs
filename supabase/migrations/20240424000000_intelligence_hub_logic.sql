-- Evolution to Trust Intelligence Network
-- This migration adds the Intelligence Alerts system and hardens RLS.

-- 1. Create Intelligence Alerts table
CREATE TABLE IF NOT EXISTS public.intelligence_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES public.entity_clusters(id),
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    description TEXT,
    is_resolved BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Agency Intelligence Tracking Table
CREATE TABLE IF NOT EXISTS public.agency_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.trust_users(id),
    action_type TEXT NOT NULL, -- 'login', 'report_submission', 'search', 'verification_action'
    ip_address TEXT,
    device_fingerprint TEXT,
    location_approx TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add workflow status to entity_reports
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entity_reports' AND column_name='status') THEN
        ALTER TABLE public.entity_reports ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_info'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entity_reports' AND column_name='admin_notes') THEN
        ALTER TABLE public.entity_reports ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- 2. Enable RLS on Intelligence Alerts
ALTER TABLE public.intelligence_alerts ENABLE ROW LEVEL SECURITY;

-- 3. Trigger for Intelligence Alerts (8-Point Advanced Fraud Detection)
CREATE OR REPLACE FUNCTION analyze_intelligence_signal()
RETURNS TRIGGER AS $$
DECLARE
    v_unique_reporters INT;
    v_distinct_names INT;
    v_distinct_cities INT;
    v_distinct_types INT;
    v_recent_burst INT;
BEGIN
    -- 1. Network Consensus (Cross-Agency Match)
    IF NEW.unique_reporters_count >= 2 AND (OLD.unique_reporters_count < 2 OR OLD.unique_reporters_count IS NULL) THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'cross_agency_match', 'high', 'Entity reported by multiple independent agencies. Pattern confirmed.');
    END IF;

    -- 2. Identity Conflict (Multiple Names)
    v_distinct_names := array_length(ARRAY(SELECT DISTINCT UNNEST(NEW.reported_names)), 1);
    IF v_distinct_names >= 2 AND (OLD.reported_names IS NULL OR array_length(OLD.reported_names, 1) < array_length(NEW.reported_names, 1)) THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'identity_conflict', 'medium', 'Multiple aliases detected for this phone number: ' || array_to_string(NEW.reported_names, ', '));
    END IF;

    -- 3. Role Duality (Tutor vs Parent)
    -- This requires checking if different types are reported in the cluster
    SELECT count(DISTINCT entity_type) INTO v_distinct_types FROM public.entity_reports WHERE normalized_phone = NEW.normalized_phone;
    IF v_distinct_types > 1 THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'role_duality', 'medium', 'Entity acting as both Tutor and Parent. Potential identity manipulation.');
    END IF;

    -- 4. High-Frequency Burst
    SELECT count(*) INTO v_recent_burst FROM public.entity_reports 
    WHERE normalized_phone = NEW.normalized_phone AND created_at > NOW() - INTERVAL '24 hours';
    IF v_recent_burst >= 3 THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'rapid_reporting_burst', 'high', 'High volume of reports (3+) within 24 hours. Potential active fraud campaign.');
    END IF;

    -- 5. Geographic Displacement
    v_distinct_cities := array_length(ARRAY(SELECT DISTINCT city FROM public.entity_reports WHERE normalized_phone = NEW.normalized_phone), 1);
    IF v_distinct_cities >= 2 THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'geo_anomaly', 'medium', 'Entity reported in multiple cities. Verify location legitimacy.');
    END IF;

    -- 6. High-Value Financial Risk
    IF EXISTS (SELECT 1 FROM public.entity_reports WHERE normalized_phone = NEW.normalized_phone AND amount >= 5000) THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'high_value_fraud', 'critical', 'Financial loss reported exceeds ₹5000 threshold. Immediate legal review suggested.');
    END IF;

    -- 7. High Risk Threshold
    IF NEW.risk_score >= 75 AND (OLD.risk_score < 75 OR OLD.risk_score IS NULL) THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'critical_risk_score', 'critical', 'Consolidated risk score crossed the critical 75% threshold.');
    END IF;

    -- 8. Repeat Offender Recurrence
    IF NEW.status = 'repeat_offender' AND (OLD.status != 'repeat_offender' OR OLD.status IS NULL) THEN
        INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
        VALUES (NEW.id, 'repeat_offender_confirmed', 'critical', 'ENTITY BLACKLISTED: Multiple independent reports confirm repeat offender status.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Dynamic Trust Score Calculation for Agencies
CREATE OR REPLACE FUNCTION calculate_agency_trust_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_reports INT;
    v_verified_reports INT;
    v_rejected_reports INT;
    v_score INT := 50; -- Starting base score
BEGIN
    SELECT count(*) INTO v_total_reports FROM public.entity_reports WHERE reported_by_user_id = p_user_id;
    SELECT count(*) INTO v_verified_reports FROM public.entity_reports WHERE reported_by_user_id = p_user_id AND status = 'verified';
    SELECT count(*) INTO v_rejected_reports FROM public.entity_reports WHERE reported_by_user_id = p_user_id AND status = 'rejected';

    -- Logic: +5 for verified, -10 for rejected, +1 for contribution
    v_score := LEAST(100, GREATEST(0, v_score + (v_verified_reports * 5) - (v_rejected_reports * 10) + (v_total_reports)));

    UPDATE public.trust_users 
    SET trust_score = v_score, updated_at = NOW() 
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger to update agency trust score on report status change
CREATE OR REPLACE FUNCTION trigger_update_agency_trust()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM calculate_agency_trust_score(NEW.reported_by_user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_agency_trust ON public.entity_reports;
CREATE TRIGGER trg_update_agency_trust
AFTER UPDATE ON public.entity_reports
FOR EACH ROW
EXECUTE FUNCTION trigger_update_agency_trust();

DROP TRIGGER IF EXISTS on_cluster_update ON public.entity_clusters;
CREATE TRIGGER on_cluster_update
AFTER UPDATE ON public.entity_clusters
FOR EACH ROW EXECUTE FUNCTION analyze_intelligence_signal();

-- 4. Hardened RLS Policies

-- trust_users: Strictly private profiles
DROP POLICY IF EXISTS "Allow all access to trust_users" ON public.trust_users;
CREATE POLICY "View own profile" ON public.trust_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Update own profile" ON public.trust_users FOR UPDATE USING (auth.uid() = id);

-- entity_reports: Submission and private view
DROP POLICY IF EXISTS "Allow all access to entity_reports" ON public.entity_reports;
CREATE POLICY "View own reports" ON public.entity_reports FOR SELECT USING (reported_by_user_id = auth.uid());
CREATE POLICY "Submit reports" ON public.entity_reports FOR INSERT WITH CHECK (reported_by_user_id = auth.uid());

-- entity_clusters: Global intelligence access for authenticated trust users
DROP POLICY IF EXISTS "Allow all access to entity_clusters" ON public.entity_clusters;
CREATE POLICY "View global intelligence" ON public.entity_clusters FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trust_users WHERE id = auth.uid())
);

-- intelligence_alerts: Admin only surveillance
DROP POLICY IF EXISTS "Admin view alerts" ON public.intelligence_alerts;
CREATE POLICY "Admin view alerts" ON public.intelligence_alerts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trust_users WHERE id = auth.uid() AND trust_score >= 100)
);

-- 5. Maintenance: Risk Score Decay
CREATE OR REPLACE FUNCTION decay_risk_scores()
RETURNS VOID AS $$
BEGIN
    UPDATE public.entity_clusters
    SET risk_score = GREATEST(0, risk_score - 5),
        updated_at = NOW()
    WHERE last_reported_at < NOW() - INTERVAL '30 days'
    AND risk_score > 0;
END;
$$ LANGUAGE plpgsql;
