-- 1. Create Trust Users table (Institutes/Agencies)
CREATE TABLE IF NOT EXISTS public.trust_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile TEXT UNIQUE NOT NULL,
    institute_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    city TEXT NOT NULL,
    trust_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Entity Reports table (Reports on Tutors/Parents)
CREATE TABLE IF NOT EXISTS public.entity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by_user_id UUID REFERENCES public.trust_users(id),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('tutor', 'parent')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    normalized_phone TEXT,
    city TEXT,
    category TEXT NOT NULL,
    fraud_type TEXT, -- For tutors
    issue_type TEXT, -- For parents
    description TEXT,
    amount DECIMAL(10,2) DEFAULT 0,
    evidence_urls TEXT[], 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Entity Clusters (Aggregated intelligence/Repeat offenders)
CREATE TABLE IF NOT EXISTS public.entity_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    normalized_phone TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL,
    primary_name TEXT NOT NULL,
    city TEXT,
    risk_score INT DEFAULT 0,
    report_count INT DEFAULT 1,
    unique_reporters_count INT DEFAULT 1,
    status TEXT DEFAULT 'normal', -- 'normal', 'high_risk', 'repeat_offender'
    categories TEXT[], -- Array of reason categories
    last_reported_at TIMESTAMPTZ DEFAULT NOW(),
    reported_names TEXT[], -- Array of all names used
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.trust_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_clusters ENABLE ROW LEVEL SECURITY;

-- Allow all access (Adjust for production)
DROP POLICY IF EXISTS "Allow all access to trust_users" ON public.trust_users;
DROP POLICY IF EXISTS "Allow all access to entity_reports" ON public.entity_reports;
DROP POLICY IF EXISTS "Allow all access to entity_clusters" ON public.entity_clusters;

CREATE POLICY "Allow all access to trust_users" ON public.trust_users FOR ALL USING (true);
CREATE POLICY "Allow all access to entity_reports" ON public.entity_reports FOR ALL USING (true);
CREATE POLICY "Allow all access to entity_clusters" ON public.entity_clusters FOR ALL USING (true);

-- 5. Helper: Phone Normalization Function
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN RIGHT(REGEXP_REPLACE(phone, '\D', '', 'g'), 10);
END;
$$ LANGUAGE plpgsql;

-- 6. Logic: Automated Matching Engine (Trigger)
CREATE OR REPLACE FUNCTION process_entity_report()
RETURNS TRIGGER AS $$
DECLARE
    norm_phone TEXT;
    cluster_id UUID;
    v_report_count INT;
    v_risk_score INT;
BEGIN
    norm_phone := normalize_phone(NEW.phone);
    
    -- Check if cluster exists
    SELECT id, report_count, risk_score INTO cluster_id, v_report_count, v_risk_score 
    FROM public.entity_clusters WHERE normalized_phone = norm_phone;
    
    IF cluster_id IS NULL THEN
        -- Create new cluster
        INSERT INTO public.entity_clusters (
            normalized_phone, 
            entity_type, 
            primary_name, 
            city, 
            risk_score, 
            report_count, 
            unique_reporters_count,
            categories,
            reported_names
        )
        VALUES (
            norm_phone, 
            NEW.entity_type, 
            NEW.name, 
            NEW.city, 
            10, 
            1, 
            1,
            ARRAY[NEW.category],
            ARRAY[NEW.name]
        );
    ELSE
        -- Update existing cluster
        UPDATE public.entity_clusters 
        SET 
            risk_score = risk_score + 25,
            report_count = report_count + 1,
            last_reported_at = NOW(),
            updated_at = NOW(),
            primary_name = NEW.name, 
            city = COALESCE(NEW.city, city),
            reported_names = ARRAY_APPEND(reported_names, NEW.name),
            categories = ARRAY_APPEND(categories, NEW.category),
            status = CASE 
                WHEN (report_count + 1) >= 3 THEN 'repeat_offender'
                WHEN (risk_score + 25) >= 50 THEN 'high_risk'
                ELSE 'normal'
            END
        WHERE id = cluster_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_report_submitted ON public.entity_reports;
CREATE TRIGGER on_report_submitted
AFTER INSERT ON public.entity_reports
FOR EACH ROW EXECUTE FUNCTION process_entity_report();
