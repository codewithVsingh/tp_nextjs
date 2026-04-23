-- Lead Scoring System Migration
-- Run this in your Supabase SQL Editor

-- Step 1: Add new columns to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS lead_score       integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_temperature text    DEFAULT 'Cold',
  ADD COLUMN IF NOT EXISTS budget           text,
  ADD COLUMN IF NOT EXISTS urgency          text,
  ADD COLUMN IF NOT EXISTS status           text    DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS is_new           boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS next_follow_up   text;

-- Step 2: Create indexes for fast hot-lead queries
CREATE INDEX IF NOT EXISTS idx_leads_lead_score       ON leads (lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_temperature ON leads (lead_temperature);
CREATE INDEX IF NOT EXISTS idx_leads_status           ON leads (status);

-- Step 3: Back-fill scores for existing rows
-- Only uses columns confirmed present in your DB (class_level + city).
-- budget / urgency / mode are new columns added above — they are NULL for
-- existing rows so scoring those would always return 0 anyway.
UPDATE leads SET
  lead_score = (
    CASE WHEN class_level ILIKE '%10%' OR class_level ILIKE '%12%' THEN 20 ELSE 0 END
    +
    CASE WHEN city IS NOT NULL AND city != '' THEN 10 ELSE 0 END
  ),
  lead_temperature = (
    CASE WHEN (
      CASE WHEN class_level ILIKE '%10%' OR class_level ILIKE '%12%' THEN 20 ELSE 0 END
      +
      CASE WHEN city IS NOT NULL AND city != '' THEN 10 ELSE 0 END
    ) >= 70 THEN 'Hot'
    WHEN (
      CASE WHEN class_level ILIKE '%10%' OR class_level ILIKE '%12%' THEN 20 ELSE 0 END
      +
      CASE WHEN city IS NOT NULL AND city != '' THEN 10 ELSE 0 END
    ) >= 40 THEN 'Warm'
    ELSE 'Cold' END
  );
