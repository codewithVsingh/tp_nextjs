-- Revenue Intelligence Schema Upgrade
-- Run this in Supabase SQL Editor to add subscription tracking fields
-- SAFE: only adds new columns if they don't exist yet

-- 1. Add new fields to payments table
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS subscription_type  TEXT DEFAULT 'Monthly',   -- 'Monthly' | 'One-time'
  ADD COLUMN IF NOT EXISTS monthly_fee        NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS start_date         DATE,
  ADD COLUMN IF NOT EXISTS expected_end_date  DATE,
  ADD COLUMN IF NOT EXISTS city               TEXT;

-- 2. Add city denormalisation to lead_tutor_assignments for analytics
ALTER TABLE lead_tutor_assignments
  ADD COLUMN IF NOT EXISTS city TEXT;

-- 3. Index new columns
CREATE INDEX IF NOT EXISTS idx_payments_subscription_type ON payments (subscription_type);
CREATE INDEX IF NOT EXISTS idx_payments_city              ON payments (city);
CREATE INDEX IF NOT EXISTS idx_payments_start_date        ON payments (start_date DESC);

-- 4. MRR view — active Monthly subscriptions revenue sum
CREATE OR REPLACE VIEW revenue_mrr AS
SELECT
  COUNT(*) AS active_subscriptions,
  COALESCE(SUM(monthly_fee), 0) AS mrr,
  COALESCE(SUM(monthly_fee) * 0.5, 0) AS agency_mrr
FROM payments
WHERE subscription_type = 'Monthly'
  AND status = 'Paid'
  AND (expected_end_date IS NULL OR expected_end_date >= CURRENT_DATE);

-- 5. Expected revenue next 30 days view
CREATE OR REPLACE VIEW revenue_expected_30d AS
SELECT
  COALESCE(SUM(monthly_fee), 0) AS expected_revenue,
  COUNT(*) AS active_subscriptions
FROM payments
WHERE subscription_type = 'Monthly'
  AND status IN ('Paid', 'Pending')
  AND (expected_end_date IS NULL OR expected_end_date >= CURRENT_DATE);

-- 6. Per-tutor revenue summary view
CREATE OR REPLACE VIEW revenue_per_tutor AS
SELECT
  tutor_id,
  tutor_name,
  COUNT(*) FILTER (WHERE status = 'Paid')    AS paid_count,
  COUNT(*) FILTER (WHERE status = 'Pending') AS pending_count,
  SUM(amount) FILTER (WHERE status = 'Paid')    AS total_collected,
  SUM(amount) FILTER (WHERE status = 'Pending') AS total_pending,
  SUM(amount) FILTER (WHERE status = 'Paid') * 0.5 AS agency_revenue
FROM payments
WHERE tutor_id IS NOT NULL
GROUP BY tutor_id, tutor_name
ORDER BY total_collected DESC NULLS LAST;

-- 7. Monthly trend view (all months with paid/pending/overdue split)
CREATE OR REPLACE VIEW revenue_monthly_trend AS
SELECT
  month,
  payment_month,
  COALESCE(SUM(amount) FILTER (WHERE status = 'Paid'),    0) AS paid,
  COALESCE(SUM(amount) FILTER (WHERE status = 'Pending'), 0) AS pending,
  COALESCE(SUM(amount) FILTER (WHERE status = 'Overdue'), 0) AS overdue,
  COALESCE(SUM(amount), 0) AS total
FROM payments
GROUP BY month, payment_month
ORDER BY payment_month ASC;
