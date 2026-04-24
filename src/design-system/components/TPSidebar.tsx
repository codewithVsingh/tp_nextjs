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
import { motion } from "framer-motion";

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
  className?: string;
}

const TPSidebar: React.FC<TPSidebarProps> = ({ role, items, sections, onLogout, className }) => {
  const pathname = usePathname();

  const roleStyles = {
    admin: {
      active: "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 scale-[1.02]",
      hover: "hover:bg-indigo-50 text-slate-600 hover:text-indigo-600",
      accent: "bg-indigo-600",
    },
    institute: {
      active: "bg-tp-institute text-white shadow-lg shadow-tp-institute/20 scale-[1.02]",
      hover: "hover:bg-tp-institute/5 text-slate-600 hover:text-tp-institute",
      accent: "bg-tp-institute",
    },
    tutor: {
      active: "bg-tp-tutor text-white shadow-lg shadow-tp-tutor/20 scale-[1.02]",
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
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group relative",
          isActive ? style.active : style.hover
        )}
      >
        <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", !isActive && "text-slate-400 group-hover:text-indigo-500")} />
        {item.label}
        {isActive && (
          <motion.div 
            layoutId="active-nav-indicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
          />
        )}
      </Link>
    );
  };
  return (
    <aside className={cn("w-64 h-full border-r border-slate-100 bg-white/50 backdrop-blur-xl flex flex-col z-40 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]", className)}>
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto scrollbar-hide">
        {sections ? (
          sections.map((section) => (
            <div key={section.label} className="space-y-3 pb-2">
              <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400/80">
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

