-- Automation Rules System
-- Run in Supabase SQL Editor

-- 1. Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id              UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name       TEXT  NOT NULL,
  record_id       UUID  NOT NULL,
  table_name      TEXT  NOT NULL DEFAULT 'leads',
  message         TEXT,
  triggered_date  DATE  NOT NULL DEFAULT CURRENT_DATE,   -- explicit date column (IMMUTABLE-safe)
  triggered_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Dedup: same rule + same lead + same calendar day fires only once
--    Using a plain column (no function call) so the index is always valid
CREATE UNIQUE INDEX IF NOT EXISTS idx_automation_dedup
  ON automation_logs (rule_name, record_id, triggered_date);

-- 3. Fast lookups
CREATE INDEX IF NOT EXISTS idx_automation_triggered  ON automation_logs (triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_record     ON automation_logs (record_id);
CREATE INDEX IF NOT EXISTS idx_automation_rule       ON automation_logs (rule_name);

-- 4. New columns on leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS is_active_student    BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS automation_disabled  BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_activity_at     TIMESTAMP WITH TIME ZONE;

-- 5. Back-fill last_activity_at from last_contacted_at
UPDATE leads
  SET last_activity_at = last_contacted_at
  WHERE last_contacted_at IS NOT NULL AND last_activity_at IS NULL;

-- 6. RLS – allow authenticated admins full access
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to automation_logs" ON automation_logs;
CREATE POLICY "Admin full access to automation_logs"
  ON automation_logs FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
