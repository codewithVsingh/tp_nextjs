import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const roleStyles = {
    admin: {
      active: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20",
      hover: "hover:bg-white/5 text-slate-400 hover:text-white",
      accent: "bg-indigo-600",
    },
    institute: {
      active: "bg-tp-institute text-white shadow-lg shadow-tp-institute/20",
      hover: "hover:bg-white/5 text-slate-400 hover:text-white",
      accent: "bg-tp-institute",
    },
    tutor: {
      active: "bg-tp-tutor text-white shadow-lg shadow-tp-tutor/20",
      hover: "hover:bg-white/5 text-slate-400 hover:text-white",
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
        title={isCollapsed ? item.label : ""}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 group relative",
          isActive ? style.active : style.hover,
          isCollapsed && "justify-center px-1.5"
        )}
      >
        <Icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110", !isActive && "text-slate-500 group-hover:text-indigo-400")} />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="truncate whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {!isCollapsed && isActive && (
          <motion.div 
            layoutId="active-nav-indicator"
            className="ml-auto w-1 h-1 rounded-full bg-white/80"
          />
        )}
      </Link>
    );
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      className={cn(
        "h-full bg-slate-900 flex flex-col z-40 relative border-r border-white/5 transition-colors duration-300", 
        className
      )}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-indigo-400 z-50 transition-all hover:scale-110"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand area if needed, but keeping it dense */}
      <div className="flex-1 py-4 px-2.5 space-y-4 overflow-y-auto scrollbar-hide">
        {sections ? (
          sections.map((section) => (
            <div key={section.label} className="space-y-1">
              <div className="h-4 flex items-center px-3">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.h4 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500/60 whitespace-nowrap"
                    >
                      {section.label}
                    </motion.h4>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-px">
                {section.items.map(renderItem)}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-px">
            {items?.map(renderItem)}
          </div>
        )}
      </div>

      <div className="p-2.5 border-t border-white/5 space-y-px">
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all group",
          isCollapsed && "justify-center px-2"
        )}>
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
          {!isCollapsed && "Settings"}
        </button>
        <button 
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-all group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </motion.aside>
  );
};

export default TPSidebar;

