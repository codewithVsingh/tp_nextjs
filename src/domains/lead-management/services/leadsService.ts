import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export interface FetchLeadsParams {
  page: number;
  pageSize: number;
  filterStatus: string;
  filterCity: string;
  dateRange?: DateRange;
  sortByScore?: boolean;
}

export const leadsService = {
  fetchLeads: async ({ 
    page, 
    pageSize, 
    filterStatus, 
    filterCity, 
    dateRange, 
    sortByScore 
  }: FetchLeadsParams) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let q = supabase.from("leads").select("id, name, phone, class_level, city, subjects, status, lead_temperature, lead_score, budget, created_at, source_page, source_cta, area", { count: "exact" });
    
    if (sortByScore) {
      q = q.order("lead_score", { ascending: false });
    } else {
      q = q.order("created_at", { ascending: false });
    }

    if (filterStatus !== "all") {
      q = q.eq("status", filterStatus);
    }

    if (filterCity.trim()) {
      q = q.ilike("city", `%${filterCity}%`);
    }

    if (dateRange?.from) {
      q = q.gte("created_at", startOfDay(dateRange.from).toISOString());
    }

    if (dateRange?.to) {
      q = q.lte("created_at", endOfDay(dateRange.to).toISOString());
    }

    const { data, count, error } = await q.range(start, end);
    
    if (error) throw error;
    return { data, count };
  },

  fetchDemoBookings: async (dateRange?: DateRange) => {
    let dq = supabase.from("demo_bookings").select("id, name, phone, class_level, city, subjects, status, created_at", { count: "exact" });
    
    if (dateRange?.from) {
      dq = dq.gte("created_at", startOfDay(dateRange.from).toISOString());
    }

    if (dateRange?.to) {
      dq = dq.lte("created_at", endOfDay(dateRange.to).toISOString());
    }

    const { data, count, error } = await dq.limit(50);
    
    if (error) throw error;
    return { data, count };
  },

  /**
   * Subscribe to live lead updates (INSERT/UPDATE/DELETE)
   * This allows the CRM to be "Live" without manual refreshes.
   */
  subscribeToLeads: (callback: (payload: any) => void) => {
    return supabase
      .channel("live-leads-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
};

