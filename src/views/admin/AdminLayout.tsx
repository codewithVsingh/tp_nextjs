"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut, LayoutDashboard, Loader2, IndianRupee, Menu,
  ChevronLeft, ChevronRight, Users, CalendarClock, GraduationCap,
  Link2, TrendingUp, MapPin, Megaphone, Zap, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// ─── Navigation structure ───────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Primary",
    items: [
      { name: "Dashboard",   path: "/admin/dashboard",   icon: LayoutDashboard },
      { name: "Leads",       path: "/admin/leads",       icon: Users           },
      { name: "Follow-Ups",  path: "/admin/followups",   icon: CalendarClock   },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Tutors",      path: "/admin/tutors",      icon: GraduationCap   },
      { name: "Assignments", path: "/admin/assignments", icon: Link2           },
    ],
  },
  {
    label: "Business",
    items: [
      { name: "Revenue",     path: "/admin/revenue",     icon: IndianRupee     },
      { name: "Funnel",      path: "/admin/funnel",      icon: TrendingUp      },
      { name: "Marketing",   path: "/admin/marketing",   icon: Megaphone       },
      { name: "Cities",      path: "/admin/cities",      icon: MapPin          },
      { name: "SEO Control",  path: "/admin/seo",         icon: Globe           },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router   = useRouter();
  const pathname = usePathname();
  const [session, setSession]         = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/admin/login");
      else setSession(session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.push("/admin/login");
      else setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1117]">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
    </div>
  );
  if (!session) return null;

  const sidebarWidth = collapsed ? "w-[64px]" : "w-64";

  return (
    <div className="h-screen w-full bg-[#F4F6FA] flex flex-col overflow-hidden">
      {/* ── TOP HEADER ────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#0F1117] border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo row */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-[16px] tracking-tight leading-none hidden md:block">
              TP <span className="font-normal text-indigo-400">CRM</span>
            </span>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-gray-400 hover:text-white" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex h-8 w-[1px] bg-white/10 mx-2" />
          
          <span className="text-[13px] text-gray-400 font-medium hidden sm:block">
            {NAV_SECTIONS.flatMap(s => s.items).find(i => pathname.startsWith(i.path))?.name ?? "Admin"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-[12px] text-gray-400 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ────────────────────────────────────────────────── */}
      <aside className={cn(
        "fixed md:relative z-40 h-full flex flex-col bg-[#0F1117] border-r border-white/5 transition-all duration-300 ease-in-out shrink-0",
        sidebarWidth,
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto pt-6 pb-3 px-3 space-y-6 scrollbar-hide">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="space-y-2">
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600 px-3 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon     = item.icon;
                  const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center rounded-xl transition-all duration-200 group relative",
                        collapsed ? "h-11 w-11 justify-center mx-auto" : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-100",
                      )}
                    >
                      <Icon className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300",
                        collapsed && "mx-auto"
                      )} />
                      {!collapsed && (
                        <span className="truncate text-[14px] font-semibold tracking-tight">
                          {item.name}
                        </span>
                      )}
                      
                      {/* Active indicator dot for collapsed state */}
                      {collapsed && isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l-full mr-[-6px]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn("p-3 border-t border-white/5 space-y-2", collapsed && "hidden")}>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">Signed in as</p>
            <p className="text-[11px] text-gray-300 truncate mt-0.5">{session?.user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-[#0F1117] border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-all shadow-xl z-50 hover:scale-110 active:scale-95"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* ── MAIN AREA ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  </div>
  );
};

export default AdminLayout;
