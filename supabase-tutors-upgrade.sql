-- Enhance the tutor_registrations schema with specific new profile properties requested
ALTER TABLE tutor_registrations
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS dob TEXT,
  ADD COLUMN IF NOT EXISTS communication_skills TEXT,
  ADD COLUMN IF NOT EXISTS demo_availability TEXT;
