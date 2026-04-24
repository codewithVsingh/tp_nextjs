import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TPKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: { dir: "up" | "down" | "flat"; pct: number };
}

export const TPKPICard = ({
  icon: Icon,
  label,
  value,
  sub,
  color,
  trend,
}: TPKPICardProps) => (
  <div className={cn("rounded-xl border p-4 flex flex-col gap-2 transition-all hover:shadow-sm", color)}>
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
          trend.dir === "up" ? "bg-emerald-100 text-emerald-700" :
          trend.dir === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
        )}>
          {trend.dir === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : null}
          {trend.pct}%
        </span>
      )}
    </div>
    <div>
      <p className="text-[26px] font-black leading-none">{value}</p>
      <p className="text-[11px] font-bold opacity-70 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] opacity-50 mt-0.5">{sub}</p>}
    </div>
  </div>
);
