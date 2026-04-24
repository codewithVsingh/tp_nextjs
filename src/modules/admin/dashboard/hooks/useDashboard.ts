"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { runAllAutomations } from "@/modules/shared/logic/automationEngine";
import { computeTutorMetrics } from "@/modules/shared/logic/tutorScore";
import { toast } from "sonner";

export const useDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalLeads: 0, hotLeads: 0, trialsThisWeek: 0, conversions: 0, monthlyRevenue: 0,
  });
  const [funnelData, setFunnelData] = useState<Record<string, number>>({});
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [autoPending, setAutoPending] = useState(0);
  const [loading, setLoading] = useState(true);

  // Raw data for insights
  const [rawLeads, setRawLeads] = useState<any[]>([]);
  const [rawTutors, setRawTutors] = useState<any[]>([]);
  const [rawPayments, setRawPayments] = useState<any[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await dashboardService.fetchDashboardMetrics();

      const leadsForAI = (results.rawLeadsRes.data || []);
      const tutorsForAI = (results.rawTutorsRes.data || []).map(t => ({ 
        ...t, 
        score: computeTutorMetrics([], parseFloat(t.rating) || 0).tutorScore 
      }));
      const paymentsForAI = (results.rawPaymentsRes.data || []);

      setRawLeads(leadsForAI);
      setRawTutors(tutorsForAI);
      setRawPayments(paymentsForAI);

      const rev = (results.revenueRes.data || []).reduce((a: number, r: any) => a + (r.fee || 0) * 0.5, 0);
      const funnel: Record<string, number> = {};
      (results.funnelRes.data || []).forEach((r: any) => {
        const s = r.status || "New Lead";
        funnel[s] = (funnel[s] || 0) + 1;
      });

      const totalLeadsCount = (results.leadsRes.count || 0) + (results.demoRes.count || 0);

      setMetrics({
        totalLeads: totalLeadsCount,
        hotLeads: results.hotRes.count || 0,
        trialsThisWeek: results.trialsRes.count || 0,
        conversions: results.convRes.count || 0,
        monthlyRevenue: rev,
      });
      setFunnelData(funnel);
      setTopLeads(results.topRes.data || []);
      setFollowUps(results.followRes.data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    runAllAutomations().then(({ noResponse }) => {
      if (noResponse > 0) setAutoPending(noResponse);
    }).catch(console.error);
  }, []);

  return {
    metrics,
    funnelData,
    topLeads,
    followUps,
    autoPending,
    loading,
    rawLeads,
    rawTutors,
    rawPayments,
    fetchAll
  };
};

