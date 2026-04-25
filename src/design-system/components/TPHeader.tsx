import React from "react";
import Link from "next/link";
import { Bell, User, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TPHeaderProps {
  role?: "admin" | "institute" | "tutor" | "global";
  userName?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
  hideActions?: boolean;
}

const TPHeader: React.FC<TPHeaderProps> = ({ 
  role = "global", 
  userName, 
  onMenuClick, 
  onLogout,
  hideActions = false 
}) => {
  const roleLabels = {
    admin: "Control Tower",
    institute: "Operations",
    tutor: "Execution",
    global: "",
  };

  const roleColors = {
    admin: "text-tp-admin",
    institute: "text-tp-institute",
    tutor: "text-tp-tutor",
    global: "text-primary",
  };

  const handlePlaceholderAction = (action: string) => {
    toast.info(`${action} feature coming soon to the Intelligence Suite`, {
      description: "We're currently indexing the global network data.",
    });
  };

  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 hover:bg-slate-50 rounded-lg"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-[28px] md:h-[36px] transition-all group-hover:scale-105">
            <img 
              src="/brand/logo/main-logo.svg" 
              alt="Tutors Parliament" 
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-heading font-bold text-lg text-slate-900 leading-tight block">
              Tutors&nbsp;Parliament
            </span>
            {role !== "global" && (
              <span className={cn("text-[9px] font-black uppercase tracking-[0.25em] block mt-0.5", roleColors[role])}>
                {roleLabels[role]}
              </span>
            )}
          </div>
        </Link>
      </div>

      {!hideActions && (
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              className="h-10 w-64 pl-10 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl text-sm transition-all outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handlePlaceholderAction('Global Search')}
            />
          </div>

          <button 
            onClick={() => handlePlaceholderAction('Notifications')}
            className="p-2.5 hover:bg-slate-50 rounded-xl relative transition-colors group"
          >
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all group outline-none">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {userName || "TP User"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 capitalize">
                    {role} Account
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 border-slate-100 shadow-xl shadow-slate-200/50">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
                Account Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem onClick={() => handlePlaceholderAction('Profile')} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:bg-slate-50 cursor-pointer">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePlaceholderAction('Preferences')} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:bg-slate-50 cursor-pointer">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem 
                onClick={onLogout}
                className="rounded-xl px-3 py-2 text-sm font-bold text-destructive focus:bg-destructive/5 cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default TPHeader;

