"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronRight,
  Settings,
  LogOut
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface TPSidebarProps {
  role: "admin" | "institute" | "tutor";
  items?: NavItem[];
  sections?: NavSection[];
  onLogout?: () => void;
}

const TPSidebar: React.FC<TPSidebarProps> = ({ role, items, sections, onLogout }) => {
  const pathname = usePathname();

  const roleStyles = {
    admin: {
      active: "bg-tp-admin text-white shadow-md shadow-tp-admin/20",
      hover: "hover:bg-tp-admin/5 text-slate-600 hover:text-tp-admin",
      accent: "bg-tp-admin",
    },
    institute: {
      active: "bg-tp-institute text-white shadow-md shadow-tp-institute/20",
      hover: "hover:bg-tp-institute/5 text-slate-600 hover:text-tp-institute",
      accent: "bg-tp-institute",
    },
    tutor: {
      active: "bg-tp-tutor text-white shadow-md shadow-tp-tutor/20",
      hover: "hover:bg-tp-tutor/5 text-slate-600 hover:text-tp-tutor",
      accent: "bg-tp-tutor",
    },
  };

  const style = roleStyles[role];

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative",
          isActive ? style.active : style.hover
        )}
      >
        <Icon className={cn("w-5 h-5", !isActive && "text-slate-400 group-hover:text-inherit")} />
        {item.label}
        {isActive && (
          <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-slate-100 bg-white hidden md:flex flex-col sticky top-16">
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto scrollbar-hide">
        {sections ? (
          sections.map((section) => (
            <div key={section.label} className="space-y-2">
              <h4 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {section.label}
              </h4>
              <div className="space-y-1">
                {section.items.map(renderItem)}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-1">
            {items?.map(renderItem)}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-50 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group">
          <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          Settings
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all group"
        >
          <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default TPSidebar;
