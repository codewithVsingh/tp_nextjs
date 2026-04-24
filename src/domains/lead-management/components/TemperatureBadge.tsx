import { cn } from "@/lib/utils";
import { LeadIntelligence } from "@/domains/lead-management/domain/leadIntelligence";

export const TemperatureBadge = ({ lead }: { lead: any }) => {
  const temp = LeadIntelligence.resolveTemperature(lead);
  const score = LeadIntelligence.resolveScore(lead);
  const visuals = LeadIntelligence.getVisuals(temp);
  
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border", visuals.bg, visuals.text, visuals.border)}>
        {visuals.emoji} {temp}
      </span>
      <div className="flex items-center gap-1">
        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", score >= 70 ? "bg-red-500" : score >= 40 ? "bg-amber-500" : "bg-slate-300")} style={{ width: `${score}%` }} />
        </div>
        <span className={cn("text-[10px] font-black", score >= 70 ? "text-red-600" : score >= 40 ? "text-amber-600" : "text-slate-400")}>{score}</span>
      </div>
    </div>
  );
};


