-- Tutor Matching System Upgrade
-- Run in Supabase SQL Editor

-- 1. Add rating + budget range to tutor_registrations
ALTER TABLE tutor_registrations
  ADD COLUMN IF NOT EXISTS rating          NUMERIC(2,1) DEFAULT 0.0,   -- 0.0 – 5.0
  ADD COLUMN IF NOT EXISTS rating_count    INTEGER      DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_budget      INTEGER      DEFAULT 0,      -- ₹/month
  ADD COLUMN IF NOT EXISTS max_budget      INTEGER      DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gender          TEXT;

-- 2. Back-fill min/max budget from existing expected_fees text
--    e.g. "2000", "1500-3000", "3000+" → parse minimally
UPDATE tutor_registrations
SET
  min_budget = CASE
    WHEN expected_fees ~ '^\d+$'           THEN expected_fees::INTEGER
    WHEN expected_fees ~ '^\d+-\d+$'       THEN split_part(expected_fees, '-', 1)::INTEGER
    WHEN expected_fees ~ '^\d+\+$'         THEN replace(expected_fees, '+', '')::INTEGER
    ELSE 0
  END,
  max_budget = CASE
    WHEN expected_fees ~ '^\d+$'           THEN expected_fees::INTEGER
    WHEN expected_fees ~ '^\d+-\d+$'       THEN split_part(expected_fees, '-', 2)::INTEGER
    WHEN expected_fees ~ '^\d+\+$'         THEN replace(expected_fees, '+', '')::INTEGER * 2
    ELSE 0
  END
WHERE expected_fees IS NOT NULL AND expected_fees != '';

-- 3. Indexes for fast matching queries
CREATE INDEX IF NOT EXISTS idx_tutor_city     ON tutor_registrations (city);
CREATE INDEX IF NOT EXISTS idx_tutor_rating   ON tutor_registrations (rating DESC);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects ON tutor_registrations USING GIN (subjects);
CREATE INDEX IF NOT EXISTS idx_tutor_classes  ON tutor_registrations USING GIN (classes);

-- 4. Add lead_budget_num to leads for numeric budget matching
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS budget_amount INTEGER DEFAULT 0;
