"use client";

import { useState, useEffect } from "react";
import { instituteService } from "../services/instituteService";
import { trackAgencyActivity } from "@/modules/shared/logic/intelligenceTrackingEngine";
import { toast } from "sonner";

export const useInstitute = (user: any) => {
  const [stats, setStats] = useState({
    totalSignals: 0,
    networkIQ: 0,
    yourContribution: 0,
    riskAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const data = await instituteService.fetchStats(user.id);
      setStats(data);
    } catch (e: any) {
      toast.error("Failed to fetch intelligence stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (user) {
      trackAgencyActivity(user.id, 'view_intelligence');
    }
  }, [user, refreshKey]);

  const refresh = () => setRefreshKey(prev => prev + 1);

  return {
    stats,
    loading,
    refresh,
    refreshKey
  };
};
