import { supabase } from "@/integrations/supabase/client";

export const tutorService = {
  registerTutor: async (tutorData: any, subjects: string[], locations: string[]) => {
    // 1. Create Profile
    const { data: profile, error: pError } = await supabase
      .from("tutor_profiles")
      .insert([tutorData])
      .select()
      .single();
    
    if (pError) throw pError;

    // 2. Add Subjects
    const subjectInserts = subjects.map(s => ({ tutor_id: profile.id, subject_name: s }));
    await supabase.from("tutor_subjects").insert(subjectInserts);

    // 3. Add Locations
    const locationInserts = locations.map(l => ({ tutor_id: profile.id, location_slug: l }));
    await supabase.from("tutor_locations").insert(locationInserts);

    // 4. Initialize Reputation
    await supabase.from("tutor_reputation_metrics").insert([{ tutor_id: profile.id }]);

    return profile;
  },

  fetchProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("tutor_profiles")
      .select(`
        *,
        tutor_subjects(*),
        tutor_locations(*),
        tutor_reputation_metrics(*)
      `)
      .eq("user_id", userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  findMatchesForLead: async (leadId: string) => {
    const { data, error } = await supabase
      .rpc('match_tutors_for_lead', { p_lead_id: leadId });
    
    if (error) throw error;
    return data;
  }
};
