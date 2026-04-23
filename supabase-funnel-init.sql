-- Funnel Tracking System Migration
-- Run in Supabase SQL Editor

-- 1. Make sure the status column exists (already added by lead-scoring migration)
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'New Lead';

-- 2. Migrate legacy values to funnel stages
UPDATE leads SET status = 'New Lead'      WHERE status IS NULL OR status = 'Pending';
UPDATE leads SET status = 'Converted'     WHERE status = 'Converted';  -- keep as-is
UPDATE leads SET status = 'Dropped'       WHERE status = 'Dropped';    -- keep as-is
-- "Contacted" and "Verified" map to "Contacted" in the funnel
UPDATE leads SET status = 'Contacted'     WHERE status = 'Verified';

-- 3. Add a stage_history JSONB column to track when each stage was entered
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS stage_history JSONB DEFAULT '[]'::jsonb;

-- 4. Index for fast funnel queries
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads (status, created_at DESC);

-- 5. Quick summary view (optional convenience)
CREATE OR REPLACE VIEW leads_funnel_summary AS
SELECT
  status,
  COUNT(*) AS count,
  MIN(created_at) AS earliest,
  MAX(created_at) AS latest
FROM leads
GROUP BY status;
