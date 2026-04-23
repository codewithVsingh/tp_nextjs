import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveScore, resolveTemperature, getTemperatureColor, getTemperatureEmoji, LeadTemperature } from "@/lib/leadScoring";
import { Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";

interface HotLead {
  id: string;
  name: string | null;
  phone: string;
  city: string | null;
  class_level: string | null;
  score: number;
  temperature: LeadTemperature;
  created_at: string;
  status: string | null;
}

interface Props {
  onSelectLead?: (lead: any) => void;
}

export const HotLeadsPanel = ({ onSelectLead }: Props) => {
  const [hotLeads, setHotLeads] = useState<HotLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotLeads();
  }, []);

  const fetchHotLeads = async () => {
    setLoading(true);
    try {
      // Try DB score first; fall back to computing client-side
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, phone, city, class_level, lead_score, lead_temperature, created_at, status, mode, urgency, start_time, budget")
        .order("lead_score", { ascending: false })
        .limit(20); // Fetch 20 so we can sort client-side if DB scores = 0

      if (error) throw error;

      const scored = (data || [])
        .map(lead => ({
          ...lead,
          score: resolveScore(lead),
          temperature: resolveTemperature(lead),
        }))
        .sort((a, b) => b.score - a.score)
        .filter(l => l.temperature === "Hot")
        .slice(0, 5);

      // If no hot leads found, show top 5 by score regardless of temp
      if (scored.length === 0) {
        const top5 = (data || [])
          .map(lead => ({
            ...lead,
            score: resolveScore(lead),
            temperature: resolveTemperature(lead),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        setHotLeads(top5);
      } else {
        setHotLeads(scored);
      }
    } catch (e) {
      console.error("HotLeadsPanel:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500" />
          <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">Hot Leads</span>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (hotLeads.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-sm text-gray-900 leading-none">Hot Leads</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Top priority — act now</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-red-100 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-200">
          <TrendingUp className="w-3 h-3" />
          {hotLeads.length} Active
        </div>
      </div>

      <div className="space-y-2">
        {hotLeads.map((lead, idx) => {
          const colors = getTemperatureColor(lead.temperature);
          const emoji = getTemperatureEmoji(lead.temperature);
          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead?.(lead)}
              className={cn(
                "relative flex items-center gap-3 bg-white rounded-lg p-3 border cursor-pointer",
                "hover:border-red-300 hover:shadow-md transition-all duration-150",
                lead.temperature === 'Hot' ? "border-red-100 shadow-sm" : "border-gray-100"
              )}
            >
              {/* Rank badge */}
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0",
                idx === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow" :
                idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
                idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                "bg-gray-100 text-gray-500"
              )}>
                #{idx + 1}
              </div>

              {/* Lead info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[13px] text-gray-900 truncate leading-none">
                    {lead.name || "Anonymous"}
                  </p>
                  <span className={cn(
                    "text-[9px] font-black px-1.5 py-0.5 rounded-full border",
                    colors.bg, colors.text, colors.border
                  )}>
                    {emoji} {lead.temperature.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
                  {lead.city || "—"} · {lead.class_level || "—"} ·{" "}
                  {lead.created_at
                    ? formatDistanceToNow(parseISO(lead.created_at), { addSuffix: true })
                    : "—"}
                </p>
              </div>

              {/* Score gauge */}
              <div className="shrink-0 text-right">
                <div className={cn(
                  "text-[15px] font-black leading-none",
                  lead.score >= 70 ? "text-red-600" :
                  lead.score >= 40 ? "text-amber-600" : "text-slate-500"
                )}>
                  {lead.score}
                </div>
                <div className="text-[9px] text-gray-400 font-bold tracking-wide">SCORE</div>
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      lead.score >= 70 ? "bg-gradient-to-r from-red-400 to-red-600" :
                      lead.score >= 40 ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                      "bg-gradient-to-r from-slate-300 to-slate-400"
                    )}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
