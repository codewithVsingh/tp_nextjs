import { supabase } from "@/integrations/supabase/client";

export const crmService = {
  fetchLeads: async (agencyId: string) => {
    const { data, error } = await supabase
      .from("agency_leads")
      .select("*")
      .eq("agency_id", agencyId)
      .order("updated_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  createLead: async (agencyId: string, leadData: any) => {
    // 1. Create the lead
    const { data, error } = await supabase
      .from("agency_leads")
      .insert([{ ...leadData, agency_id: agencyId }])
      .select()
      .single();
    
    if (error) throw error;

    // 2. Log initial interaction
    await supabase.from("lead_interactions").insert([{
      lead_id: data.id,
      agent_id: agencyId,
      interaction_type: 'note',
      content: 'Lead created in CRM'
    }]);

    return data;
  },

  updateLeadStatus: async (leadId: string, status: string, agencyId: string) => {
    const { data, error } = await supabase
      .from("agency_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  assignTutor: async (leadId: string, tutorData: any) => {
    const { data, error } = await supabase
      .from("lead_assignments")
      .insert([{ ...tutorData, lead_id: leadId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  fetchTimeline: async (leadId: string) => {
    const { data, error } = await supabase
      .from("lead_interactions")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
