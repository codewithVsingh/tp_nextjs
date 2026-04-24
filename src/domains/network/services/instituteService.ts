import { supabase } from "@/integrations/supabase/client";

/**
 * InstituteService: Domain Service for Institute Network management.
 * No direct Supabase calls allowed in UI.
 */
export const instituteService = {
  async register(data: { mobile: string; institute_name: string; owner_name: string; city: string }) {
    const { error } = await supabase
      .from("trust_users")
      .insert([data]);

    if (error) {
      if (error.code === "23505") {
        throw new Error("This mobile number is already registered. Please try logging in instead.");
      }
      if (error.message.includes("row-level security")) {
        throw new Error("Database permission error. Please contact administrator to enable public registration.");
      }
      throw error;
    }
  },

  async getByMobile(mobile: string) {
    const { data, error } = await supabase
      .from("trust_users")
      .select("*")
      .eq("mobile", mobile)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};
