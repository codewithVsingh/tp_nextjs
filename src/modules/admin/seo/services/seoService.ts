import { supabase } from "@/integrations/supabase/client";

export const seoService = {
  fetchConfigs: async () => {
    try {
      const { data, error } = await supabase
        .from("seo_configurations")
        .select("*")
        .order("path", { ascending: true });
      
      if (error) {
        if (error.message.includes("does not exist")) return [];
        throw error;
      }
      return data || [];
    } catch (e) {
      console.error("seoService.fetchConfigs:", e);
      return [];
    }
  },

  updateConfig: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("seo_configurations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  createConfig: async (config: any) => {
    const { data, error } = await supabase
      .from("seo_configurations")
      .insert([config])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
