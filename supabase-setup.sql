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

-- Enable RLS
ALTER TABLE tutor_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies so the website can read from / write to these tables
CREATE POLICY "Public can insert tutor registrations" 
ON tutor_registrations FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Public can view tutor registrations" 
ON tutor_registrations FOR SELECT 
TO public 
USING (true);

-- Ensure policies exist for other tables if you want to see them in Admin Dashboard
do $$ 
begin 
    if not exists (select 1 from pg_policies where policyname = 'Public can view leads') then
        CREATE POLICY "Public can view leads" ON leads FOR SELECT TO public USING (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Public can view contact_messages') then
        CREATE POLICY "Public can view contact_messages" ON contact_messages FOR SELECT TO public USING (true);
    end if;
end $$;
