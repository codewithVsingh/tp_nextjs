import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  count: number | string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  icon?: LucideIcon;
}

export const DashboardCard = ({ title, count, isActive, onClick, color = "text-indigo-600" }: DashboardCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex-1 min-w-[120px] px-4 py-3 cursor-pointer transition-all duration-200 border-r last:border-r-0 border-gray-100 hover:bg-gray-50 flex flex-col justify-center",
        isActive ? "bg-indigo-50/50" : "bg-transparent"
      )}
    >
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
      <div className="flex items-center gap-2">
        <span className={cn("text-xl font-black tracking-tight", isActive ? "text-indigo-600" : "text-gray-900")}>
          {count}
        </span>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>}
      </div>
    </div>
  );
};

