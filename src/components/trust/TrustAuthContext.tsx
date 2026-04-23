"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

interface TrustUser {
  id: string;
  mobile: string;
  institute_name: string;
  owner_name: string;
  city: string;
  trust_score: number;
}

interface TrustAuthContextType {
  user: TrustUser | null;
  loading: boolean;
  login: (mobile: string) => Promise<boolean>;
  logout: () => void;
}

const TrustAuthContext = createContext<TrustAuthContextType | undefined>(undefined);

export const TrustAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TrustUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("trust_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (mobile: string): Promise<boolean> => {
    setLoading(true);
    try {
      // 1. Check if user exists
      let { data, error } = await supabase
        .from("trust_users")
        .select("*")
        .eq("mobile", mobile)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (!data) {
        // User doesn't exist, we will redirect to onboarding or handle it
        // For simplicity in Phase 1, we return false to trigger onboarding in UI
        return false;
      }

      // 2. Set session
      setUser(data as TrustUser);
      localStorage.setItem("trust_user", JSON.stringify(data));
      return true;
    } catch (err) {
      console.error("Trust Login Error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trust_user");
    router.push("/trust/login");
  };

  return (
    <TrustAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </TrustAuthContext.Provider>
  );
};

export const useTrustAuth = () => {
  const context = useContext(TrustAuthContext);
  if (context === undefined) {
    throw new Error("useTrustAuth must be used within a TrustAuthProvider");
  }
  return context;
};
