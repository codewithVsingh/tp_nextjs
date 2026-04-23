-- Incrementally add new fields for Lead & Tutor management
-- NO deletions, NO breaking changes

-- 1. Update tutor_registrations
ALTER TABLE IF EXISTS public.tutor_registrations 
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS communication_level TEXT;

-- 2. Update leads
ALTER TABLE IF EXISTS public.leads
ADD COLUMN IF NOT EXISTS preferred_tutor_gender TEXT,
ADD COLUMN IF NOT EXISTS source_page TEXT,
ADD COLUMN IF NOT EXISTS source_cta TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.tutor_registrations.gender IS 'Male, Female, Other, Prefer not to say';
COMMENT ON COLUMN public.tutor_registrations.communication_level IS 'Competent, Proficient, Expert, Master';
COMMENT ON COLUMN public.leads.preferred_tutor_gender IS 'Preference for tutor gender (Male, Female, Any)';
COMMENT ON COLUMN public.leads.source_page IS 'The specific page where the lead was captured';
COMMENT ON COLUMN public.leads.source_cta IS 'The specific CTA button that triggered the capture';
