-- 1. Ultimate Schema Synchronization (Bypassing ENUM restrictions)
DO $$ 
BEGIN 
    -- Ensure table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'intelligence_alerts') THEN
        CREATE TABLE public.intelligence_alerts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cluster_id UUID REFERENCES public.entity_clusters(id),
            alert_type TEXT NOT NULL,
            severity TEXT DEFAULT 'medium',
            description TEXT,
            is_resolved BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- A. Handle "type" -> "alert_type" rename
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='type') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='alert_type') THEN
                ALTER TABLE public.intelligence_alerts RENAME COLUMN "type" TO alert_type;
            ELSE
                UPDATE public.intelligence_alerts SET alert_type = type::text WHERE alert_type IS NULL;
                ALTER TABLE public.intelligence_alerts DROP COLUMN "type";
            END IF;
        END IF;

        -- B. FORCE columns to TEXT (to avoid ENUM errors)
        -- We do this for alert_type and severity
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='alert_type') THEN
            ALTER TABLE public.intelligence_alerts ALTER COLUMN alert_type TYPE TEXT USING alert_type::text;
        ELSE
            ALTER TABLE public.intelligence_alerts ADD COLUMN alert_type TEXT;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='severity') THEN
            ALTER TABLE public.intelligence_alerts ALTER COLUMN severity TYPE TEXT USING severity::text;
        ELSE
            ALTER TABLE public.intelligence_alerts ADD COLUMN severity TEXT DEFAULT 'medium';
        END IF;

        -- C. Handle "message" -> "description" rename
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='message') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='description') THEN
                ALTER TABLE public.intelligence_alerts RENAME COLUMN "message" TO description;
            END IF;
        END IF;

        -- D. Ensure other columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='description') THEN
            ALTER TABLE public.intelligence_alerts ADD COLUMN description TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='is_resolved') THEN
            ALTER TABLE public.intelligence_alerts ADD COLUMN is_resolved BOOLEAN DEFAULT false;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='cluster_id') THEN
            ALTER TABLE public.intelligence_alerts ADD COLUMN cluster_id UUID REFERENCES public.entity_clusters(id);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intelligence_alerts' AND column_name='created_at') THEN
            ALTER TABLE public.intelligence_alerts ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- 2. Relax RLS
ALTER TABLE public.intelligence_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin view alerts" ON public.intelligence_alerts;
DROP POLICY IF EXISTS "Allow authenticated view alerts" ON public.intelligence_alerts;
CREATE POLICY "Allow authenticated view alerts" ON public.intelligence_alerts FOR SELECT USING (true);

-- 3. Seed Sample Alerts
INSERT INTO public.intelligence_alerts (cluster_id, alert_type, severity, description)
SELECT 
    id, 
    'identity_conflict', 
    'high', 
    'Multiple aliases detected for this phone number. High probability of spoofing.'
FROM public.entity_clusters
WHERE id NOT IN (SELECT cluster_id FROM public.intelligence_alerts WHERE cluster_id IS NOT NULL)
LIMIT 2;

INSERT INTO public.intelligence_alerts (alert_type, severity, description)
SELECT 'network_anomaly', 'medium', 'Unusual search patterns detected from decentralized nodes in Delhi region.'
WHERE NOT EXISTS (SELECT 1 FROM public.intelligence_alerts);
