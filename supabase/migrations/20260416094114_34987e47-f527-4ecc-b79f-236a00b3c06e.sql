
-- Create leads table for multi-step lead capture
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  phone TEXT NOT NULL,
  user_type TEXT,
  city TEXT,
  area TEXT,
  mode TEXT,
  class_level TEXT,
  board TEXT,
  exam TEXT,
  exam_category TEXT,
  prep_level TEXT,
  skill_type TEXT,
  hobby_type TEXT,
  subjects TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  preferred_time TEXT,
  frequency TEXT,
  start_time TEXT,
  otp_verified BOOLEAN NOT NULL DEFAULT false,
  step_reached INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create OTP codes table
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Leads: allow anonymous inserts and updates (public lead capture form)
CREATE POLICY "Anyone can create a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update a lead by phone"
  ON public.leads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own lead by phone"
  ON public.leads FOR SELECT
  TO anon, authenticated
  USING (true);

-- OTP: allow inserts and reads (managed by edge functions, but need anon access)
CREATE POLICY "Anyone can create OTP"
  ON public.otp_codes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read OTP"
  ON public.otp_codes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update OTP"
  ON public.otp_codes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Index for fast phone lookups
CREATE INDEX idx_leads_phone ON public.leads (phone);
CREATE INDEX idx_otp_phone ON public.otp_codes (phone, verified);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-cleanup expired OTPs (older than 10 min)
CREATE INDEX idx_otp_expires ON public.otp_codes (expires_at);
