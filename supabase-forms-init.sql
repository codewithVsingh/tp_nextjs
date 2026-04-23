-- Run this in your Supabase SQL Editor to enforce the new Multi-Form DB Architecture!

CREATE TABLE IF NOT EXISTS demo_bookings (LIKE leads INCLUDING ALL);

CREATE TABLE IF NOT EXISTS counselling_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  phone TEXT,
  type TEXT,
  class_age TEXT,
  concern TEXT,
  status TEXT DEFAULT 'Pending'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS reported_tutors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_name TEXT,
  mobile TEXT,
  whatsapp TEXT,
  state TEXT,
  city TEXT,
  area TEXT,
  fraud_type TEXT,
  description TEXT,
  incident_date TEXT,
  agency_name TEXT,
  contact_person TEXT,
  agency_phone TEXT,
  agency_email TEXT,
  status TEXT DEFAULT 'Pending'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS & Policies
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert demo_bookings" ON demo_bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert counselling_requests" ON counselling_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert reported_tutors" ON reported_tutors FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Only authenticated admins can view demo_bookings" ON demo_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can update demo_bookings" ON demo_bookings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Only authenticated admins can view counselling_requests" ON counselling_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can update counselling_requests" ON counselling_requests FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Only authenticated admins can view reported_tutors" ON reported_tutors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can update reported_tutors" ON reported_tutors FOR UPDATE TO authenticated USING (true);
