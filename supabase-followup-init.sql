-- Run this in your Supabase SQL Editor to enforce Follow-Up CRM infrastructure

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE demo_bookings 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE counselling_requests 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE tutor_registrations 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE contact_messages 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

ALTER TABLE reported_tutors 
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
  ADD COLUMN IF NOT EXISTS follow_up_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Polymorphic follow_up_logs mapping natively to active_tab strings
CREATE TABLE IF NOT EXISTS follow_up_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  note TEXT,
  status TEXT,
  next_follow_up TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS to secure the table
ALTER TABLE follow_up_logs ENABLE ROW LEVEL SECURITY;

-- Allow Authenticated Admins to Read/Write follow ups securely
DROP POLICY IF EXISTS "Enable full access for authenticated admins" ON follow_up_logs;
CREATE POLICY "Enable full access for authenticated admins" 
ON follow_up_logs 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
