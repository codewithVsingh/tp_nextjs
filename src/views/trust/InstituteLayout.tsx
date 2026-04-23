"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, LayoutDashboard, Loader2, Activity, Globe, ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NavSection } from "@/components/system/TPSidebar";

// ─── Navigation structure for Institute ────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard",   href: "/trust/dashboard",   icon: LayoutDashboard },
      { label: "My Reports",  href: "/trust/reports",     icon: Activity        },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Global Feed",  href: "/trust/feed",        icon: Globe           },
      { label: "Verification", href: "/trust/verify",      icon: ShieldCheck     },
    ],
  },
];

interface InstituteLayoutProps {
  children: React.ReactNode;
}

const InstituteLayout = ({ children }: InstituteLayoutProps) => {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/institute-login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/institute-login");
      } else {
        setSession(session);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/institute-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Synchronizing Institute Feed...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <DashboardLayout 
      role="institute" 
      navSections={NAV_SECTIONS}
      userName={session?.user?.email?.split('@')[0] || "Agency"}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default InstituteLayout;
