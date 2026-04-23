-- Follow-Up & Task Management Upgrade
-- Run this AFTER supabase-followup-init.sql has already been run

-- 1. New columns on leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS next_action      TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_status TEXT DEFAULT 'Pending';

-- 2. Upgrade follow_up_logs with activity type
ALTER TABLE follow_up_logs
  ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'Note Added';

-- 3. Auto-set follow-up 24h after creation for leads that have none
UPDATE leads
  SET next_follow_up     = created_at + INTERVAL '24 hours',
      follow_up_status   = 'Pending'
  WHERE next_follow_up IS NULL
    AND created_at IS NOT NULL;

-- 4. Mark overdue leads as Missed
-- (follow_up_status = Pending AND next_follow_up < now)
UPDATE leads
  SET follow_up_status = 'Missed'
  WHERE follow_up_status = 'Pending'
    AND next_follow_up IS NOT NULL
    AND next_follow_up < NOW();

-- 5. Index for fast widget queries
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_status ON leads (follow_up_status);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up   ON leads (next_follow_up);
CREATE INDEX IF NOT EXISTS idx_logs_activity_type     ON follow_up_logs (activity_type);
