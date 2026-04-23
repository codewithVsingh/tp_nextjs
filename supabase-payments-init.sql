-- Revenue / Payments Module
-- Run in Supabase SQL Editor

-- 1. Payments table
CREATE TABLE IF NOT EXISTS payments (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id         UUID    REFERENCES leads(id) ON DELETE SET NULL,
  tutor_id        UUID    REFERENCES tutor_registrations(id) ON DELETE SET NULL,
  assignment_id   UUID    REFERENCES lead_tutor_assignments(id) ON DELETE SET NULL,
  lead_name       TEXT,
  tutor_name      TEXT,
  amount          NUMERIC(10,2) NOT NULL DEFAULT 0,
  month           TEXT    NOT NULL,  -- "April 2026", "May 2026" etc.
  payment_month   DATE,              -- first day of billing month for sorting
  status          TEXT    NOT NULL DEFAULT 'Pending',  -- Paid | Pending | Overdue
  payment_date    DATE,              -- actual date money was received
  due_date        DATE,              -- when this payment was due
  notes           TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_payments_lead_id       ON payments (lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_tutor_id      ON payments (tutor_id);
CREATE INDEX IF NOT EXISTS idx_payments_status        ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_month ON payments (payment_month DESC);

-- 3. Auto-updated timestamp trigger
CREATE OR REPLACE FUNCTION update_payments_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE PROCEDURE update_payments_timestamp();

-- 4. Auto mark overdue: payments where due_date < today and status = Pending
-- Run manually or schedule via pg_cron extension:
UPDATE payments
  SET status = 'Overdue'
  WHERE status = 'Pending'
    AND due_date IS NOT NULL
    AND due_date < CURRENT_DATE;

-- 5. RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
CREATE POLICY "Admin full access to payments"
  ON payments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 6. Useful summary view
CREATE OR REPLACE VIEW payments_monthly_summary AS
SELECT
  month,
  payment_month,
  SUM(amount) FILTER (WHERE status = 'Paid')    AS paid_amount,
  SUM(amount) FILTER (WHERE status = 'Pending') AS pending_amount,
  SUM(amount) FILTER (WHERE status = 'Overdue') AS overdue_amount,
  COUNT(*) FILTER (WHERE status = 'Paid')        AS paid_count,
  COUNT(*) FILTER (WHERE status = 'Pending')     AS pending_count,
  COUNT(*) FILTER (WHERE status = 'Overdue')     AS overdue_count
FROM payments
GROUP BY month, payment_month
ORDER BY payment_month DESC;
