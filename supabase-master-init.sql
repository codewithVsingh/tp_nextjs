-- =========================================================
-- 🔥 TUTORS PARLIAMENT MASTER INIT SCRIPT 🔥
-- Execute this entirely inside your NEW Supabase SQL Editor
-- =========================================================

-- 1. BUILD THE MISSING TABLES (Leads, Messages, Tutors)
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT,
    phone TEXT,
    email TEXT,
    class_level TEXT,
    exam TEXT,
    subjects TEXT[],
    city TEXT,
    area TEXT,
    status TEXT DEFAULT 'Pending'::text,
    otp_verified BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT
);

CREATE TABLE IF NOT EXISTS tutor_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    subjects TEXT[] NOT NULL,
    classes TEXT[] NOT NULL,
    boards TEXT[] NOT NULL,
    teaching_mode TEXT NOT NULL,
    preferred_locations TEXT,
    languages TEXT[] NOT NULL,
    qualification TEXT NOT NULL,
    specialization TEXT,
    experience TEXT NOT NULL,
    current_status TEXT NOT NULL,
    available_days TEXT[] NOT NULL,
    time_slots TEXT[] NOT NULL,
    expected_fees TEXT NOT NULL,
    travel_willing TEXT NOT NULL,
    travel_radius TEXT,
    bio TEXT,
    video_link TEXT,
    photo_name TEXT,
    id_proof_name TEXT,
    resume_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);


-- 2. ENFORCE FIREWALL SECURITY (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to submit their forms natively over API
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert tutor_registrations" ON tutor_registrations FOR INSERT TO public WITH CHECK (true);

-- Protect reading so ONLY your JWT Admin Session can view dashboard data
CREATE POLICY "Only authenticated admins can view leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can update leads" ON leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can view contact_messages" ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can view tutor_registrations" ON tutor_registrations FOR SELECT TO authenticated USING (true);


-- 3. INJECT THE ADMIN JWT ACCOUNT
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tp@tutorsparliament.com') THEN
        
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
            'tp@tutorsparliament.com', crypt('Vikas@1947', gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', '{}', now(), now()
        );

        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, created_at, updated_at
        ) VALUES (
            new_user_id, new_user_id,
            format('{"sub":"%s","email":"%s"}', new_user_id::text, 'tp@tutorsparliament.com')::jsonb,
            'email', now(), now()
        );

    ELSE
        UPDATE auth.users 
        SET encrypted_password = crypt('Vikas@1947', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE email = 'tp@tutorsparliament.com';
    END IF;
END $$;
