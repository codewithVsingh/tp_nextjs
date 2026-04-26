import { supabase } from "@/integrations/supabase/client";

export const testimonialService = {
  fetchTestimonials: async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        if (error.message.includes("does not exist")) return [];
        throw error;
      }
      return data || [];
    } catch (e) {
      console.error("testimonialService.fetchTestimonials:", e);
      return [];
    }
  },

  updateTestimonial: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("testimonials")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  createTestimonial: async (testimonial: any) => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert([testimonial])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteTestimonial: async (id: string) => {
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  }
};
