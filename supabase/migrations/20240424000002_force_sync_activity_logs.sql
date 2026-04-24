-- Force sync for agency_activity_logs to resolve PGRST204 and column name conflicts
-- This handles cases where 'action' exists instead of 'action_type'

DO $$ 
BEGIN 
    -- 1. Ensure the table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agency_activity_logs') THEN
        CREATE TABLE public.agency_activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            action_type TEXT NOT NULL,
            ip_address TEXT,
            device_fingerprint TEXT,
            location_approx TEXT,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- 2. Handle 'action' column if it exists (renaming it to action_type)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agency_activity_logs' AND column_name='action') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agency_activity_logs' AND column_name='action_type') THEN
                ALTER TABLE public.agency_activity_logs RENAME COLUMN "action" TO action_type;
            ELSE
                -- Both exist? Drop 'action' to avoid conflicts if 'action_type' is already there
                ALTER TABLE public.agency_activity_logs DROP COLUMN "action";
            END IF;
        END IF;

        -- 3. Ensure action_type column exists and is NOT NULL
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agency_activity_logs' AND column_name='action_type') THEN
            ALTER TABLE public.agency_activity_logs ADD COLUMN action_type TEXT NOT NULL DEFAULT 'unknown';
            ALTER TABLE public.agency_activity_logs ALTER COLUMN action_type DROP DEFAULT;
        END IF;

        -- 4. Ensure metadata column exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agency_activity_logs' AND column_name='metadata') THEN
            ALTER TABLE public.agency_activity_logs ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        END IF;
        
        -- 5. Relax user_id FK if needed (for initial anonymous tracking)
        -- Just ensure it exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agency_activity_logs' AND column_name='user_id') THEN
            ALTER TABLE public.agency_activity_logs ADD COLUMN user_id UUID;
        END IF;
    END IF;
END $$;

-- Re-enable RLS and wide open INSERT policy for activity tracking
ALTER TABLE public.agency_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public logging" ON public.agency_activity_logs;
DROP POLICY IF EXISTS "Admin full access" ON public.agency_activity_logs;
CREATE POLICY "Allow public logging" ON public.agency_activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.agency_activity_logs FOR SELECT USING (true);

