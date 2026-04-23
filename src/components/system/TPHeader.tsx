import React from "react";
import Link from "next/link";
import { Bell, User, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TPHeaderProps {
  role?: "admin" | "institute" | "tutor" | "global";
  userName?: string;
  onMenuClick?: () => void;
}

const TPHeader: React.FC<TPHeaderProps> = ({ role = "global", userName, onMenuClick }) => {
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

  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-50 rounded-lg">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        )}
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-all group-hover:scale-105",
            role === "admin" ? "bg-tp-admin" : 
            role === "institute" ? "bg-tp-institute" : 
            role === "tutor" ? "bg-tp-tutor" : "bg-primary"
          )}>
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-heading font-bold text-lg text-slate-900 leading-tight block">
              Tutors Parliament
            </span>
            {role !== "global" && (
              <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] block", roleColors[role])}>
                {roleLabels[role]}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="h-10 w-64 pl-10 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl text-sm transition-all outline-none"
          />
        </div>

        <button className="p-2.5 hover:bg-slate-50 rounded-xl relative transition-colors group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

        <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all group">
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
      </div>
    </header>
  );
};

export default TPHeader;
