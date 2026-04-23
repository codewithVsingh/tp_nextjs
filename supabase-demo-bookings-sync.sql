-- Sync demo_bookings table with investigative fields
ALTER TABLE demo_bookings ADD COLUMN IF NOT EXISTS step_reached INT DEFAULT 1;
ALTER TABLE demo_bookings ADD COLUMN IF NOT EXISTS preferred_tutor_gender TEXT;
ALTER TABLE demo_bookings ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE demo_bookings ADD COLUMN IF NOT EXISTS source_cta TEXT;

-- Also ensure leads has all fields if missed
ALTER TABLE leads ADD COLUMN IF NOT EXISTS step_reached INT DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_cta TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_tutor_gender TEXT;
