-- B2B Trust Intelligence Platform - Database Schema
-- Phase 1 & 2: Users, Reports, and Clusters

-- 1. Create Enums
CREATE TYPE entity_type AS ENUM ('tutor', 'parent');
CREATE TYPE cluster_status AS ENUM ('normal', 'repeat_offender', 'high_risk');

-- 2. Trust Users (Institutes / Agencies)
CREATE TABLE IF NOT EXISTS trust_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile TEXT UNIQUE NOT NULL,
    institute_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    city TEXT NOT NULL,
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Entity Reports (Unified Submission Table)
CREATE TABLE IF NOT EXISTS entity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type NOT NULL,
    name TEXT,
    phone TEXT NOT NULL,
    normalized_phone TEXT NOT NULL,
    city TEXT,
    state TEXT,
    category TEXT,
    fraud_type TEXT, -- Specific to tutors
    issue_type TEXT, -- Specific to parents
    description TEXT,
    incident_date DATE,
    amount DECIMAL(10, 2),
    proof_urls TEXT[],
    reported_by_user_id UUID REFERENCES trust_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_normalized_phone ON entity_reports(normalized_phone);

-- 4. Entity Clusters (The Intelligence Layer)
CREATE TABLE IF NOT EXISTS entity_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type entity_type NOT NULL,
    normalized_phone TEXT NOT NULL,
    primary_name TEXT,
    city TEXT,
    state TEXT,
    report_count INTEGER DEFAULT 1,
    unique_reporters_count INTEGER DEFAULT 1,
    categories TEXT[] DEFAULT '{}',
    status cluster_status DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, normalized_phone)
);

CREATE INDEX IF NOT EXISTS idx_clusters_normalized_phone ON entity_clusters(normalized_phone);

-- 5. Logic: Phone Normalization Function
CREATE OR REPLACE FUNCTION normalize_phone_number(p_phone TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Strip everything except digits
    RETURN regexp_replace(p_phone, '\D', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Logic: Matching & Cluster Update Trigger Function
CREATE OR REPLACE FUNCTION process_entity_report()
RETURNS TRIGGER AS $$
DECLARE
    v_cluster_id UUID;
    v_normalized_phone TEXT;
BEGIN
    -- Normalize the phone number
    v_normalized_phone := normalize_phone_number(NEW.phone);
    NEW.normalized_phone := v_normalized_phone;

    -- 1. Try to match cluster (Exact phone or last 7 digits)
    -- Using exact match for simplicity first, can expand fallback later
    SELECT id INTO v_cluster_id 
    FROM entity_clusters 
    WHERE entity_type = NEW.entity_type 
    AND (normalized_phone = v_normalized_phone OR right(normalized_phone, 7) = right(v_normalized_phone, 7))
    LIMIT 1;

    IF v_cluster_id IS NOT NULL THEN
        -- UPDATE existing cluster
        UPDATE entity_clusters SET
            report_count = report_count + 1,
            unique_reporters_count = (
                SELECT count(DISTINCT reported_by_user_id) 
                FROM entity_reports 
                WHERE normalized_phone = v_normalized_phone OR right(normalized_phone, 7) = right(v_normalized_phone, 7)
            ),
            categories = array_remove(array_append(categories, NEW.category), NULL),
            updated_at = NOW(),
            -- Status logic
            status = CASE 
                WHEN report_count + 1 >= 5 THEN 'high_risk'::cluster_status
                WHEN report_count + 1 >= 2 THEN 'repeat_offender'::cluster_status
                ELSE 'normal'::cluster_status
            END
        WHERE id = v_cluster_id;
    ELSE
        -- CREATE new cluster
        INSERT INTO entity_clusters (
            entity_type, 
            normalized_phone, 
            primary_name, 
            city, 
            state, 
            categories,
            status
        ) VALUES (
            NEW.entity_type,
            v_normalized_phone,
            NEW.name,
            NEW.city,
            NEW.state,
            ARRAY[NEW.category],
            'normal'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create Trigger
CREATE TRIGGER trg_process_entity_report
BEFORE INSERT ON entity_reports
FOR EACH ROW
EXECUTE FUNCTION process_entity_report();
