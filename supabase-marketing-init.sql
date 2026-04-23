-- Marketing Attribution System
-- Run this in Supabase SQL Editor

-- 1. Add marketing fields to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source          TEXT DEFAULT 'Organic', -- Google Ads, Facebook, Organic, Referral, etc.
  ADD COLUMN IF NOT EXISTS campaign_name   TEXT,                   -- "Search_Math_Tutor_Delhi"
  ADD COLUMN IF NOT EXISTS campaign_cost   NUMERIC(10,2) DEFAULT 0;-- Ad spend for this specific lead

-- 2. Add indexes for attribution tracking
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_name ON leads (campaign_name);

-- 3. Marketing Attribution View
CREATE OR REPLACE VIEW marketing_attribution_summary AS
SELECT
  l.source,
  l.campaign_name,
  COUNT(l.id) AS total_leads,
  COUNT(l.id) FILTER (WHERE l.status = 'Converted' OR EXISTS (SELECT 1 FROM lead_tutor_assignments a WHERE a.lead_id = l.id AND a.status = 'Active')) AS total_conversions,
  COALESCE(SUM(l.campaign_cost), 0) AS total_spend,
  COALESCE((
    SELECT SUM(p.amount) 
    FROM payments p 
    WHERE p.lead_id IN (SELECT id FROM leads WHERE source = l.source AND (campaign_name = l.campaign_name OR (campaign_name IS NULL AND l.campaign_name IS NULL)))
      AND p.status = 'Paid'
  ), 0) AS total_revenue
FROM leads l
GROUP BY l.source, l.campaign_name;
