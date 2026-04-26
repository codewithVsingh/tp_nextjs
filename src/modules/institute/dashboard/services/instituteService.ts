import { supabase } from "@/integrations/supabase/client";

export const instituteService = {
  fetchStats: async (userId: string) => {
    // 1. Fetch global, verified and user specific report counts + Trust Score
    const [signalRes, verifiedRes, yourRes, trustRes] = await Promise.all([
      supabase.from("entity_reports").select("*", { count: "exact", head: true }),
      supabase.from("entity_reports").select("*", { count: "exact", head: true }).eq("status", "verified"),
      supabase.from("entity_reports").select("*", { count: "exact", head: true }).eq("reported_by_user_id", userId),
      supabase.from("reporter_trust_metrics").select("trust_score, contribution_score, access_level").eq("user_id", userId).maybeSingle()
    ]);

    // 2. Fetch critical alerts (Risky/Blacklisted entities)
    const { count: alertCount } = await supabase
      .from("entity_intelligence_matrix")
      .select("*", { count: "exact", head: true })
      .in("risk_level", ["RISKY", "BLACKLISTED"]);

    // 3. Calculate Network IQ (Average score of all reports)
    const { data: matrixData } = await supabase
      .from("entity_intelligence_matrix")
      .select("risk_score");
    
    const avgRisk = matrixData && matrixData.length > 0 
      ? matrixData.reduce((acc, curr) => acc + curr.risk_score, 0) / matrixData.length 
      : 0;

    return {
      totalSignals: signalRes.count || 0,
      verifiedSignals: verifiedRes.count || 0,
      yourContribution: yourRes.count || 0,
      riskAlerts: alertCount || 0,
      agencyTrust: trustRes?.data?.trust_score ?? 0.5,
      contributionScore: trustRes?.data?.contribution_score ?? 0,
      accessLevel: trustRes?.data?.access_level ?? 0,
      networkIQ: Math.round(80 + (avgRisk / 5)) 
    };
  },

  fetchClusters: async (entityType: string, searchQuery?: string) => {
    // Join entity_intelligence_matrix with name data from reports
    // Note: Since matrix is phone-based, we get the latest name from reports
    let query = supabase
      .from("entity_intelligence_matrix")
      .select(`
        normalized_phone,
        risk_score,
        risk_level,
        total_signals,
        last_seen
      `)
      .order("risk_score", { ascending: false });

    if (searchQuery) {
      query = query.ilike("normalized_phone", `%${searchQuery}%`);
    }

    const { data: matrixData, error: matrixError } = await query.limit(20);
    if (matrixError) throw matrixError;

    // Fetch names and details from reports for these phones
    const phones = matrixData.map(m => m.normalized_phone);
    const { data: reportData } = await supabase
      .from("entity_reports")
      .select("normalized_phone, name, city, entity_type, status")
      .in("normalized_phone", phones)
      .eq("entity_type", entityType);

    // Merge data (Identity + Intelligence)
    const clusters = matrixData.map(m => {
      const entityReports = reportData?.filter(r => r.normalized_phone === m.normalized_phone) || [];
      if (entityReports.length === 0) return null;

      const hasVerified = entityReports.some(r => r.status === 'verified');
      const hasDisputed = entityReports.some(r => r.status === 'disputed');
      
      return {
        ...m,
        primary_name: entityReports[0].name,
        city: entityReports[0].city,
        entity_type: entityReports[0].entity_type,
        fidelity_status: hasVerified ? 'verified' : (hasDisputed ? 'disputed' : 'provisional')
      };
    }).filter(Boolean);

    return clusters;
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
  },

  quickLookup: async (phone: string) => {
    const normalized = phone.replace(/\D/g, "");
    if (normalized.length < 10) return null;

    const [matrixRes, reportsRes] = await Promise.all([
      supabase.from("entity_intelligence_matrix").select("*").eq("normalized_phone", normalized).maybeSingle(),
      supabase.from("entity_reports").select("fraud_type, issue_type, status").eq("normalized_phone", normalized)
    ]);

    const verifiedCount = reportsRes.data?.filter(r => r.status === 'verified').length || 0;
    const tags = Array.from(new Set(
      reportsRes.data?.map(r => r.fraud_type || r.issue_type).filter(Boolean)
    )).slice(0, 3);

    return {
      phone: normalized,
      risk: matrixRes.data || { risk_score: 0, risk_level: 'SAFE', total_signals: 0 },
      verifiedCount,
      tags
    };
  }
};
