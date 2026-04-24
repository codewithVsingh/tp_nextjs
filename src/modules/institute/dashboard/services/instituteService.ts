import { supabase } from "@/integrations/supabase/client";

export const instituteService = {
  fetchStats: async (userId: string) => {
    const [signalRes, yourRes, alertRes] = await Promise.all([
      supabase.from("entity_reports").select("*", { count: "exact", head: true }),
      supabase.from("entity_reports").select("*", { count: "exact", head: true }).eq("reported_by_user_id", userId),
      supabase.from("intelligence_alerts").select("*", { count: "exact", head: true }).eq("is_resolved", false)
    ]);

    return {
      totalSignals: signalRes.count || 0,
      yourContribution: yourRes.count || 0,
      riskAlerts: alertRes.count || 0,
      networkIQ: 84 // Constant for now
    };
  },

  fetchClusters: async (entityType: string, searchQuery?: string) => {
    let query = supabase
      .from("entity_clusters")
      .select("*")
      .eq("entity_type", entityType)
      .order("report_count", { ascending: false });

    if (searchQuery) {
      query = query.or(`primary_name.ilike.%${searchQuery}%,normalized_phone.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query.limit(20);
    if (error) throw error;
    return data;
  },

  fetchReportHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from("entity_reports")
      .select("*")
      .eq("reported_by_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  }
};
