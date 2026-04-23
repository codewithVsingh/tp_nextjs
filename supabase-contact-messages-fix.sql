-- Fix: Add missing inquiry_type column to contact_messages table
-- Run this in the Supabase SQL Editor

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS inquiry_type TEXT;

-- Optional: Add a check constraint for allowed values
ALTER TABLE contact_messages
  ADD CONSTRAINT contact_messages_inquiry_type_check
  CHECK (inquiry_type IN ('general', 'partnership', 'tutor', 'feedback', 'support') OR inquiry_type IS NULL);
