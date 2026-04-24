import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek } from "date-fns";

export const dashboardService = {
  fetchDashboardMetrics: async () => {
    const weekStart = startOfWeek(new Date()).toISOString();
    const weekEnd   = endOfWeek(new Date()).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    const [
      leadsRes, hotRes, trialsRes, convRes, revenueRes, funnelRes, topRes, followRes,
      rawLeadsRes, rawTutorsRes, rawPaymentsRes, demoRes
    ] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("lead_temperature", "Hot"),
      supabase.from("leads").select("id", { count: "exact", head: true }).in("status", ["Trial Booked", "Trial Done"]).gte("created_at", weekStart).lte("created_at", weekEnd),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "Converted"),
      supabase.from("lead_tutor_assignments").select("fee").eq("status", "Active"),
      supabase.from("leads").select("status"),
      supabase.from("leads").select("id, name, phone, class_level, city, subjects, status, lead_temperature, lead_score, budget").order("lead_score", { ascending: false }).limit(5),
      supabase.from("leads").select("id, name, phone, class_level, city, next_follow_up, next_action").not("next_follow_up", "is", null).lte("next_follow_up", today).limit(8),
      supabase.from("leads").select("id, status, city, area, lead_temperature, last_contacted_at, created_at, source_page, source_cta").limit(200),
      supabase.from("tutor_registrations").select("*"),
      supabase.from("payments").select("*").eq("status", "Pending").limit(50),
      supabase.from("demo_bookings").select("id", { count: "exact", head: true })
    ]);

    return {
      leadsRes, hotRes, trialsRes, convRes, revenueRes, funnelRes, topRes, followRes,
      rawLeadsRes, rawTutorsRes, rawPaymentsRes, demoRes
    };
  }
};

