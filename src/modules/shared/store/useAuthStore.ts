import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  email?: string;
  role: "admin" | "institute" | "tutor" | null;
  name?: string;
}

interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  setSession: (session: any) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({ session });
      // Determine role from email or metadata (simplified for now)
      const email = session.user.email || "";
      let role: AuthState["user"]["role"] = null;
      
      // Robust Role Detection
      if (email.includes("admin") || email === "tp@tutorsparliament.com") {
        role = "admin";
      } else if (email.includes("trust") || email.includes("institute")) {
        role = "institute";
      } else if (email.includes("tutor")) {
        role = "tutor";
      }

      set({ 
        user: { 
          id: session.user.id, 
          email: session.user.email, 
          role,
          name: session.user.user_metadata?.name || email.split('@')[0]
        } 
      });
    }
    
    set({ isLoading: false });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ session });
        const email = session.user.email || "";
        let role: AuthState["user"]["role"] = null;
        
        // Robust Role Detection
        if (email.includes("admin") || email === "tp@tutorsparliament.com") {
          role = "admin";
        } else if (email.includes("trust") || email.includes("institute")) {
          role = "institute";
        } else if (email.includes("tutor")) {
          role = "tutor";
        }

        set({ 
          user: { 
            id: session.user.id, 
            email, 
            role,
            name: session.user.user_metadata?.name || email.split('@')[0]
          } 
        });
      } else {
        set({ user: null, session: null });
      }
    });
  },
}));
