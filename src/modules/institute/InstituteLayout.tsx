"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, LayoutDashboard, Loader2, Activity, Globe, ShieldCheck, Zap, Users
} from "lucide-react";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NavSection } from "@/design-system/components/TPSidebar";

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
    label: "Operations",
    items: [
      { label: "Agency CRM",   href: "/trust/crm",         icon: Zap             },
      { label: "Tutor Supply", href: "/trust/supply",      icon: Users           },
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
  const { user, loading, logout } = useTrustAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/institute-login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
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

  if (!user) return null;

  return (
    <DashboardLayout 
      role="institute" 
      navSections={NAV_SECTIONS}
      userName={user?.institute_name || "Agency"}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default InstituteLayout;

