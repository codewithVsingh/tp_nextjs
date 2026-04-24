"use client";

import { useState, useEffect } from "react";
import { leadsService } from "../services/leadsService";
import { fetchAndEnrichLeads } from "../use-cases/fetchAndEnrichLeads";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

export const useLeads = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filteredCount, setCount] = useState(0);
  const pageSize = 10;

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("");
  const [filterTemperature, setFilterTemperature] = useState("all");
  const [sortByScore, setSortByScore] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: subDays(new Date(), 30), 
    to: new Date() 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchAndEnrichLeads({
        page,
        pageSize,
        filterStatus,
        filterCity,
        dateRange,
        sortByScore,
        filterTemperature
      });

      setData(result.data);
      setCount(result.total);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // PHASE 11: Real-time Sync
    let refreshTimer: NodeJS.Timeout;
    
    const subscription = leadsService.subscribeToLeads((payload) => {
      // Throttle refreshes to once every 2 seconds to handle bulk updates
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        console.log("[useLeads] Real-time sync triggered by:", payload.eventType);
        fetchData();
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(refreshTimer);
    };
  }, [page, filterStatus, filterCity, filterTemperature, sortByScore, dateRange]);

  const reset = () => {
    setFilterStatus("all");
    setFilterCity("");
    setFilterTemperature("all");
    setSortByScore(false);
    setDateRange({ from: subDays(new Date(), 30), to: new Date() });
    setPage(1);
  };

  return {
    data,
    loading,
    page,
    setPage,
    filteredCount,
    pageSize,
    filterStatus,
    setFilterStatus,
    filterCity,
    setFilterCity,
    filterTemperature,
    setFilterTemperature,
    sortByScore,
    setSortByScore,
    dateRange,
    setDateRange,
    fetchData,
    reset
  };
};

