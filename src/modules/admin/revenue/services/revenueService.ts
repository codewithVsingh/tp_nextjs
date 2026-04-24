import { supabase } from "@/integrations/supabase/client";

export const revenueService = {
  fetchPayments: async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("payment_month", { ascending: false })
      .limit(500);
    
    if (error) throw error;
    return data;
  },

  fetchActiveAssignments: async () => {
    const { data, error } = await supabase
      .from("lead_tutor_assignments")
      .select("tutor_id, tutor_name, fee, status, start_date, class_level")
      .eq("status", "Active");
    
    if (error) throw error;
    return data;
  }
};

