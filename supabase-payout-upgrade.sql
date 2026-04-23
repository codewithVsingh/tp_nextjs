-- Tutor Payout System Upgrade
-- Run this in Supabase SQL Editor

-- 1. Add payout and commission fields to payments table
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS commission_pct       NUMERIC(5,2) DEFAULT 50.00,
  ADD COLUMN IF NOT EXISTS commission_amount    NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tutor_payout_amount  NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_status        TEXT DEFAULT 'Pending', -- 'Pending' | 'Paid'
  ADD COLUMN IF NOT EXISTS payout_date          DATE;

-- 2. Update existing records to calculate defaults if missing
UPDATE payments 
SET 
  commission_amount = amount * (commission_pct / 100),
  tutor_payout_amount = amount - (amount * (commission_pct / 100))
WHERE commission_amount = 0 AND amount > 0;

-- 3. Indexes for payout tracking
CREATE INDEX IF NOT EXISTS idx_payments_payout_status ON payments (payout_status);
CREATE INDEX IF NOT EXISTS idx_payments_payout_date ON payments (payout_date DESC);

-- 4. Payout Summary View
CREATE OR REPLACE VIEW tutor_payout_summary AS
SELECT
  tutor_id,
  tutor_name,
  SUM(tutor_payout_amount) FILTER (WHERE payout_status = 'Pending') AS total_payout_due,
  SUM(tutor_payout_amount) FILTER (WHERE payout_status = 'Paid')    AS total_payout_completed,
  COUNT(*) FILTER (WHERE payout_status = 'Pending') AS pending_payout_count
FROM payments
WHERE tutor_id IS NOT NULL
GROUP BY tutor_id, tutor_name;
