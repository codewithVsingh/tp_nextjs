-- Fix RLS for trust_users to allow public registration and mobile lookups
-- Since Phase 1 uses local session management, we allow anonymous access for these specific actions.

-- 1. Trust Users: Allow anyone to register (INSERT) and lookup by mobile (SELECT)
DROP POLICY IF EXISTS "Allow public registration" ON public.trust_users;
CREATE POLICY "Allow public registration" ON public.trust_users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow mobile lookup" ON public.trust_users;
CREATE POLICY "Allow mobile lookup" ON public.trust_users FOR SELECT USING (true);

-- 2. Entity Reports: Allow public submission and viewing for Phase 1
ALTER TABLE public.entity_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public submission" ON public.entity_reports;
CREATE POLICY "Allow public submission" ON public.entity_reports FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public view" ON public.entity_reports;
CREATE POLICY "Allow public view" ON public.entity_reports FOR SELECT USING (true);

-- 3. Entity Clusters: Allow public viewing of intelligence
ALTER TABLE public.entity_clusters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public intelligence view" ON public.entity_clusters;
CREATE POLICY "Allow public intelligence view" ON public.entity_clusters FOR SELECT USING (true);

-- 4. Activity Logs: Allow public logging
ALTER TABLE public.agency_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public logging" ON public.agency_activity_logs;
CREATE POLICY "Allow public logging" ON public.agency_activity_logs FOR INSERT WITH CHECK (true);

-- 5. Intelligence Alerts: Allow public viewing for Phase 1
ALTER TABLE public.intelligence_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public alerts view" ON public.intelligence_alerts;
CREATE POLICY "Allow public alerts view" ON public.intelligence_alerts FOR SELECT USING (true);


