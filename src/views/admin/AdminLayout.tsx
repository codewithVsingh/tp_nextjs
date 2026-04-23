"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, LayoutDashboard, Loader2, IndianRupee, Users, 
  CalendarClock, GraduationCap, Link2, TrendingUp, MapPin, 
  Megaphone, Globe, ShieldCheck, Network, ListChecks
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NavSection } from "@/components/system/TPSidebar";

// ─── Navigation structure mapped to standardized format ────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    label: "Primary",
    items: [
      { label: "Dashboard",   href: "/admin/dashboard",   icon: LayoutDashboard },
      { label: "Leads",       href: "/admin/leads",       icon: Users           },
      { label: "Follow-Ups",  href: "/admin/followups",   icon: CalendarClock   },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Tutors",      href: "/admin/tutors",      icon: GraduationCap   },
      { label: "Assignments", href: "/admin/assignments", icon: Link2           },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Revenue",     href: "/admin/revenue",     icon: IndianRupee     },
      { label: "Funnel",      href: "/admin/funnel",      icon: TrendingUp      },
      { label: "Marketing",   href: "/admin/marketing",   icon: Megaphone       },
      { label: "Cities",      href: "/admin/cities",      icon: MapPin          },
      { label: "SEO Control", href: "/admin/seo",         icon: Globe           },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Control Tower",   href: "/admin/trust",       icon: ShieldCheck      },
      { label: "Verification",    href: "/admin/trust/queue", icon: ListChecks       },
      { label: "Agency Network",  href: "/admin/trust/network", icon: Network          },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Initializing OS...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <DashboardLayout 
      role="admin" 
      navSections={NAV_SECTIONS}
      userName={session?.user?.email?.split('@')[0] || "Admin"}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
