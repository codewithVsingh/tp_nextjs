-- =========================================================
-- 🔥 TUTORS PARLIAMENT DISTRIBUTION ENGINE 🔥
-- Execute this entirely inside your Supabase SQL Editor
-- =========================================================

-- 1. TUTOR LOCATIONS (Mapping tutors to areas)
CREATE TABLE IF NOT EXISTS tutor_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
  area_id BIGINT REFERENCES areas(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('online', 'offline', 'both')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TUTOR VISIBILITY (Admin Control Layer)
CREATE TABLE IF NOT EXISTS tutor_visibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE UNIQUE,
  is_featured BOOLEAN DEFAULT false,
  priority_score INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  visibility_status TEXT DEFAULT 'pending' CHECK (visibility_status IN ('pending', 'active', 'hidden', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAGE OVERRIDES (Pin System / Superpower)
CREATE TABLE IF NOT EXISTS page_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL, -- e.g. /tutors/mg-road-bengaluru
  entity_type TEXT CHECK (entity_type IN ('tutor', 'testimonial')),
  entity_id UUID NOT NULL, -- references either tutor or testimonial
  position INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, position) -- Only one entity per position per page
);

-- 4. TESTIMONIAL LOCATIONS (Mapping testimonials to geography)
-- (Assuming a testimonials table will be created, using UUID for now)
CREATE TABLE IF NOT EXISTS testimonial_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  testimonial_id UUID NOT NULL,
  area_id BIGINT REFERENCES areas(id) ON DELETE CASCADE NULL,
  city_id BIGINT REFERENCES cities(id) ON DELETE CASCADE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TUTOR MEDIA (Moderation Layer)
CREATE TABLE IF NOT EXISTS tutor_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES tutor_registrations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('profile', 'demo', 'certificate', 'id_proof')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tutor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_media ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view active tutor_locations" ON tutor_locations FOR SELECT USING (true);
CREATE POLICY "Public can view approved tutor_visibility" ON tutor_visibility FOR SELECT USING (visibility_status = 'active');
CREATE POLICY "Public can view page_overrides" ON page_overrides FOR SELECT USING (true);
CREATE POLICY "Public can view testimonial_locations" ON testimonial_locations FOR SELECT USING (true);
CREATE POLICY "Public can view approved media" ON tutor_media FOR SELECT USING (status = 'approved');

-- Admin Manage Policies
CREATE POLICY "Admins can manage tutor_locations" ON tutor_locations TO authenticated USING (true);
CREATE POLICY "Admins can manage tutor_visibility" ON tutor_visibility TO authenticated USING (true);
CREATE POLICY "Admins can manage page_overrides" ON page_overrides TO authenticated USING (true);
CREATE POLICY "Admins can manage testimonial_locations" ON testimonial_locations TO authenticated USING (true);
CREATE POLICY "Admins can manage tutor_media" ON tutor_media TO authenticated USING (true);
