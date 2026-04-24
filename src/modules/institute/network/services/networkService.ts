import { supabase as supabaseClient } from "@/integrations/supabase/client";
const supabase = supabaseClient as any;


/**
 * NetworkService: Centralizes all Institute Network data I/O.
 * No direct Supabase calls allowed in UI.
 */
export const networkService = {
  async getNodes() {
    const { data, error } = await supabase
      .from("institute_nodes")
      .select("*");
    
    if (error) throw error;
    return data;
  },

  async getConnections() {
    const { data, error } = await supabase
      .from("institute_connections")
      .select("*");
    
    if (error) throw error;
    return data;
  },

  async getClusters() {
    const { data, error } = await supabase
      .from("entity_clusters")
      .select("*")
      .order("risk_score", { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  async getTrustUsers() {
    const { data, error } = await supabase
      .from("trust_users")
      .select("*")
      .order("trust_score", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateNodePosition(nodeId: string, x: number, y: number) {
    const { error } = await supabase
      .from("institute_nodes")
      .update({ x, y })
      .eq("id", nodeId);
    
    if (error) throw error;
  }
};
