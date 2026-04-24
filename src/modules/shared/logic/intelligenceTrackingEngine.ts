import { supabase } from "@/integrations/supabase/client";

export type IntelligenceAction = 
  | 'login' 
  | 'report_submission' 
  | 'search' 
  | 'verification_action'
  | 'view_intelligence';

export const trackAgencyActivity = async (
  userId: string | undefined, 
  actionType: IntelligenceAction, 
  metadata: any = {}
) => {
  if (!userId) return;

  try {
    // Basic IP/Device info (simplified for Phase 1)
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side';
    
    await supabase.from("agency_activity_logs").insert([{
      user_id: userId,
      action_type: actionType,
      metadata: {
        ...metadata,
        userAgent,
        timestamp: new Date().toISOString()
      }
    }]);
  } catch (error) {
    console.error("Intelligence Tracking Error:", error);
  }
};

