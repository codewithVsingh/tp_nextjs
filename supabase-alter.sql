-- Run this snippet in your Supabase SQL Editor to add the status column required for the new CRM functionality
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='status') THEN
        ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'Pending';
    END IF;
END $$;
