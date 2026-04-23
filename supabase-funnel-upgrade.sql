-- Advanced Funnel Analytics Upgrade
-- Run this in Supabase SQL Editor

-- 1. Add analytics fields to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS counsellor_name TEXT, -- The admin/user handling the lead
  ADD COLUMN IF NOT EXISTS converted_at     TIMESTAMPTZ, -- Exact time of conversion
  ADD COLUMN IF NOT EXISTS dropped_at       TIMESTAMPTZ, -- Exact time of drop
  ADD COLUMN IF NOT EXISTS drop_reason      TEXT;        -- "Budget", "Distance", "No response", etc.

-- 2. Update existing converted leads to have converted_at (best guess)
UPDATE leads 
SET converted_at = created_at + interval '2 days' 
WHERE status = 'Converted' AND converted_at IS NULL;

-- 3. Add drop-out stage categories (Optional: we can use text field)
-- Indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_leads_counsellor ON leads (counsellor_name);
CREATE INDEX IF NOT EXISTS idx_leads_drop_reason ON leads (drop_reason);
CREATE INDEX IF NOT EXISTS idx_leads_converted_at ON leads (converted_at DESC);
