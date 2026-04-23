-- =========================================================
-- 🔥 PAYMENT LOGS INIT 🔥
-- Execute this entirely inside your Supabase SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    assignment_id UUID REFERENCES lead_tutor_assignments(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    month TEXT NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'Paid'::text
);

-- Enable RLS
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated Admins full pipeline access
CREATE POLICY "Admins have full access to payments" 
ON payment_logs 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
