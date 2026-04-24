-- Create a summary view for agency activity
CREATE OR REPLACE VIEW public.agency_activity_summary AS
SELECT 
    u.id as user_id,
    u.institute_name,
    u.city,
    COUNT(l.id) FILTER (WHERE l.action_type = 'login') as login_count,
    MAX(l.created_at) as last_active,
    ARRAY_AGG(DISTINCT l.action_type) as action_types
FROM public.trust_users u
JOIN public.agency_activity_logs l ON u.id = l.user_id
GROUP BY u.id, u.institute_name, u.city;

-- Enable RLS (Views inherit RLS from tables, but we can be explicit)
ALTER VIEW public.agency_activity_summary SET (security_invoker = on);
