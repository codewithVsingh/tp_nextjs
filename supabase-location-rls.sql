-- Run this in your Supabase SQL Editor to allow the Search Bar to read the data

-- Enable RLS just to be safe (if not already enabled)
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_aliases ENABLE ROW LEVEL SECURITY;

-- Drop existing public read policies if they exist to avoid duplicates
DROP POLICY IF EXISTS "Public can view states" ON states;
DROP POLICY IF EXISTS "Public can view cities" ON cities;
DROP POLICY IF EXISTS "Public can view areas" ON areas;
DROP POLICY IF EXISTS "Public can view location_aliases" ON location_aliases;

-- Create policies that allow ANYONE (the frontend search bar) to SELECT (read) the data
CREATE POLICY "Public can view states" ON states FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public can view areas" ON areas FOR SELECT USING (true);
CREATE POLICY "Public can view location_aliases" ON location_aliases FOR SELECT USING (true);

-- Note: We do NOT allow public INSERT, UPDATE, or DELETE. Only read.
