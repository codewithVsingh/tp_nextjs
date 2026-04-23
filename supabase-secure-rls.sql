-- SUPERCHARGE YOUR SECURITY: Run this script in your Supabase SQL Editor
-- This locks down all SELECT (read) operations so only logged-in Admin accounts with valid JWTs can view your data.

-- 1. Drop existing permissive public read policies (if any)
DROP POLICY IF EXISTS "Public can view leads" ON leads;
DROP POLICY IF EXISTS "Public can view contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can view tutor_registrations" ON tutor_registrations;

-- 2. Create STRICT Authenticated-Only read policies
-- authenticated role signifies a user possessing a verified JWT token issued by Supabase Auth
CREATE POLICY "Only authenticated admins can view leads" 
ON leads FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated admins can view contact_messages" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated admins can view tutor_registrations" 
ON tutor_registrations FOR SELECT 
TO authenticated 
USING (true);

-- (Form Submissions) Ensure Public remains capable of INSERTING new leads and messages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert leads') THEN
        CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO public WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert contact_messages') THEN
        CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT TO public WITH CHECK (true);
    END IF;
END $$;
