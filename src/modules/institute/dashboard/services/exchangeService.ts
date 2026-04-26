import { supabase } from "@/integrations/supabase/client";

export const exchangeService = {
  /**
   * Post a new lead to the global exchange marketplace
   */
  postLead: async (agencyId: string, leadData: any) => {
    const normalized = leadData.parent_phone.replace(/\D/g, "");
    
    const { data, error } = await supabase
      .from("exchange_leads")
      .insert([{
        ...leadData,
        origin_agency_id: agencyId,
        normalized_phone: normalized,
        status: 'available'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Fetch the global marketplace feed with risk signals
   */
  fetchMarketplace: async () => {
    const { data, error } = await supabase
      .from("view_exchange_marketplace")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Express interest / Claim a lead from the exchange
   */
  claimLead: async (agencyId: string, leadId: string, notes: string = "") => {
    const { data, error } = await supabase
      .from("exchange_claims")
      .insert([{
        lead_id: leadId,
        claimer_agency_id: agencyId,
        claimer_notes: notes,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update the status of an exchange lead (Lifecycle Management)
   */
  updateExchangeStatus: async (leadId: string, status: string) => {
    const { data, error } = await supabase
      .from("exchange_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Fetch leads posted by the current agency
   */
  fetchMyPostings: async (agencyId: string) => {
    const { data, error } = await supabase
      .from("exchange_leads")
      .select("*, exchange_claims(*)")
      .eq("origin_agency_id", agencyId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
