import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, Users, BarChart3, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FUNNEL_STAGES, MAIN_FUNNEL, FunnelStage, FunnelStageConfig
} from "@/lib/funnelStages";

interface Props {
  onStageClick: (stage: FunnelStage) => void;
}

interface StageStat {
  stage: FunnelStageConfig;
  count: number;
  pct: number;          // % of total leads
  convFromPrev: number; // % converted from previous stage
  dropOff: number;      // absolute drop from previous
}

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

export const FunnelTracker = ({ onStageClick }: Props) => {
  const [stats, setStats] = useState<StageStat[]>([]);
  const [droppedCount, setDroppedCount] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [cityFilter, setCityFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("leads")
        .select("id, status, city, subjects, created_at");

      if (dateRange?.from) query = query.gte("created_at", startOfDay(dateRange.from).toISOString());
      if (dateRange?.to)   query = query.lte("created_at", endOfDay(dateRange.to).toISOString());
      if (cityFilter.trim())    query = query.ilike("city", `%${cityFilter}%`);

      const { data, error } = await query;
      if (error) throw error;

      let rows = (data || []);

      // Client-side subject filter (array column)
      if (subjectFilter.trim()) {
        const sub = subjectFilter.trim().toLowerCase();
        rows = rows.filter(r =>
          Array.isArray(r.subjects)
            ? r.subjects.some((s: string) => s.toLowerCase().includes(sub))
            : false
        );
      }

      const total = rows.length;
      setTotalLeads(total);

      // Count per stage
      const stageMap: Record<string, number> = {};
      for (const s of FUNNEL_STAGES) stageMap[s.id] = 0;
      rows.forEach(r => {
        const s = r.status || "New Lead";
        if (stageMap[s] !== undefined) stageMap[s]++;
        else stageMap["New Lead"]++;
      });

      setDroppedCount(stageMap["Dropped"] ?? 0);

      // Build ordered stats for main funnel (no Dropped here)
      const ordered: StageStat[] = MAIN_FUNNEL.map((stage, idx) => {
        const count = stageMap[stage.id] ?? 0;
        const prevCount = idx === 0 ? total : (stageMap[MAIN_FUNNEL[idx - 1].id] ?? 0);
        return {
          stage,
          count,
          pct: pct(count, total),
          convFromPrev: idx === 0 ? 100 : pct(count, prevCount),
          dropOff: idx === 0 ? 0 : Math.max(0, prevCount - count),
        };
      });

      setStats(ordered);
    } catch (e) {
      console.error("FunnelTracker:", e);
    } finally {
      setLoading(false);
    }
  }, [dateRange, cityFilter, subjectFilter]);

  useEffect(() => { fetchFunnel(); }, [fetchFunnel]);

  // Key metrics
  const newLeadCount    = stats.find(s => s.stage.id === "New Lead")?.count ?? 0;
  const trialBookedCount= stats.find(s => s.stage.id === "Trial Booked")?.count ?? 0;
  const trialDoneCount  = stats.find(s => s.stage.id === "Trial Done")?.count ?? 0;
  const convertedCount  = stats.find(s => s.stage.id === "Converted")?.count ?? 0;

  const leadToTrial   = pct(trialBookedCount, totalLeads);
  const trialToConv   = pct(convertedCount, trialDoneCount);
  const overallConv   = pct(convertedCount, totalLeads);

  // Drop-off insights — find worst stage
  const worstDropIndex = stats.reduce((worst, s, i) => {
    if (i === 0) return worst;
    return s.dropOff > (stats[worst]?.dropOff ?? 0) ? i : worst;
  }, 1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-indigo-50/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm leading-none">Lead Funnel</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {totalLeads.toLocaleString()} total · last 30 days
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="City..."
            value={cityFilter}
            onChange={e => { setCityFilter(e.target.value); }}
            className="h-8 w-[100px] text-[11px] border-gray-200"
          />
          <Input
            placeholder="Subject..."
            value={subjectFilter}
            onChange={e => { setSubjectFilter(e.target.value); }}
            className="h-8 w-[100px] text-[11px] border-gray-200"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[11px] border-gray-200 bg-white gap-1.5">
                <CalendarIcon className="w-3 h-3" />
                {dateRange?.from
                  ? `${format(dateRange.from, "dd MMM")} – ${dateRange.to ? format(dateRange.to, "dd MMM") : "?"}`
                  : "Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="p-5 space-y-6">

          {/* ── FUNNEL STEP BAR ─────────────────────────────── */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-200 to-emerald-200 z-0" />

            <div className="relative z-10 flex items-start justify-between gap-1">
              {stats.map((s, idx) => {
                const maxCount = stats[0]?.count || 1;
                const barH = Math.max(8, Math.round((s.count / maxCount) * 56));
                const isWorstDrop = idx > 0 && idx === worstDropIndex;

                return (
                  <button
                    key={s.stage.id}
                    onClick={() => onStageClick(s.stage.id)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1.5 group cursor-pointer",
                      "transition-all duration-150"
                    )}
                  >
                    {/* Stage node */}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm transition-all",
                      "group-hover:scale-110 group-hover:shadow-md",
                      s.count > 0
                        ? `${s.stage.lightBg} ${s.stage.borderColor}`
                        : "bg-gray-50 border-gray-200"
                    )}>
                      <span className="text-xl leading-none">{s.stage.emoji}</span>
                      <span className={cn(
                        "text-[13px] font-black leading-none mt-0.5",
                        s.count > 0 ? s.stage.textColor : "text-gray-400"
                      )}>
                        {s.count}
                      </span>
                    </div>

                    {/* Arrow connector */}
                    {idx < stats.length - 1 && (
                      <ChevronRight className="absolute hidden" />
                    )}

                    {/* Stage label */}
                    <p className={cn(
                      "text-[10px] font-bold text-center leading-tight",
                      s.count > 0 ? "text-gray-700" : "text-gray-400"
                    )}>
                      {s.stage.label}
                    </p>

                    {/* % from total */}
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded-full",
                      s.stage.lightBg, s.stage.textColor
                    )}>
                      {s.pct}%
                    </span>

                    {/* Drop-off callout */}
                    {idx > 0 && s.dropOff > 0 && (
                      <div className={cn(
                        "flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded",
                        isWorstDrop
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-50 text-orange-500"
                      )}>
                        {isWorstDrop && <AlertTriangle className="w-2.5 h-2.5" />}
                        -{s.dropOff}
                      </div>
                    )}

                    {/* Conv rate from prev */}
                    {idx > 0 && (
                      <span className="text-[9px] text-gray-400 font-medium">
                        ↑{s.convFromPrev}%
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Dropped bubble — separate from main funnel */}
              <button
                onClick={() => onStageClick("Dropped")}
                className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer transition-all"
              >
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 border-red-200 bg-red-50 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                  <span className="text-xl leading-none">❌</span>
                  <span className="text-[13px] font-black leading-none mt-0.5 text-red-600">
                    {droppedCount}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-700">Dropped</p>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  {pct(droppedCount, totalLeads)}%
                </span>
              </button>
            </div>

            {/* Progress bar underneath */}
            <div className="mt-5 flex gap-0.5 h-2 rounded-full overflow-hidden">
              {stats.map(s => (
                <div
                  key={s.stage.id}
                  className={cn("transition-all duration-500", s.stage.color)}
                  style={{ flex: Math.max(s.count, 0.5) }}
                  title={`${s.stage.label}: ${s.count}`}
                />
              ))}
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ flex: Math.max(droppedCount, 0.5) }}
                title={`Dropped: ${droppedCount}`}
              />
            </div>
          </div>

          {/* ── KEY METRICS STRIP ────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Lead → Trial",
                value: leadToTrial,
                sub: `${trialBookedCount} / ${totalLeads} leads booked`,
                icon: <TrendingUp className="w-4 h-4" />,
                good: leadToTrial >= 30,
                color: leadToTrial >= 30 ? "text-emerald-600" : leadToTrial >= 15 ? "text-amber-600" : "text-red-600",
                bg: leadToTrial >= 30 ? "bg-emerald-50 border-emerald-200" : leadToTrial >= 15 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200",
              },
              {
                label: "Trial → Conversion",
                value: trialToConv,
                sub: `${convertedCount} / ${trialDoneCount} trials won`,
                icon: <TrendingUp className="w-4 h-4" />,
                good: trialToConv >= 50,
                color: trialToConv >= 50 ? "text-emerald-600" : trialToConv >= 25 ? "text-amber-600" : "text-red-600",
                bg: trialToConv >= 50 ? "bg-emerald-50 border-emerald-200" : trialToConv >= 25 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200",
              },
              {
                label: "Overall Conversion",
                value: overallConv,
                sub: `${convertedCount} / ${totalLeads} total leads`,
                icon: <Users className="w-4 h-4" />,
                good: overallConv >= 10,
                color: overallConv >= 10 ? "text-emerald-600" : overallConv >= 5 ? "text-amber-600" : "text-red-600",
                bg: overallConv >= 10 ? "bg-emerald-50 border-emerald-200" : overallConv >= 5 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200",
              },
            ].map(m => (
              <div key={m.label} className={cn("rounded-xl border p-4 space-y-1.5", m.bg)}>
                <div className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider", m.color)}>
                  {m.icon} {m.label}
                </div>
                <div className={cn("text-3xl font-black leading-none", m.color)}>
                  {m.value}%
                </div>
                <div className="text-[10px] text-gray-500 font-medium">{m.sub}</div>
                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700",
                      m.good ? "bg-emerald-500" : m.value >= (m.label.includes("Overall") ? 5 : m.label.includes("Trial") ? 25 : 15) ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(m.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── DROP-OFF INSIGHTS ────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                Drop-off Between Stages
              </p>
              {stats[worstDropIndex] && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Worst: {stats[worstDropIndex - 1]?.stage.label} → {stats[worstDropIndex]?.stage.label}
                </span>
              )}
            </div>

            {stats.slice(1).map((s, idx) => {
              const prevStage = stats[idx];
              const prevCount = prevStage.count;
              const dropPct = pct(s.dropOff, prevCount);
              const isWorst = idx + 1 === worstDropIndex;

              return (
                <div key={s.stage.id} className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg border",
                  isWorst ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"
                )}>
                  <div className="flex items-center gap-1.5 w-44 shrink-0">
                    <span className="text-[11px] font-bold text-gray-500">{prevStage.stage.emoji} {prevStage.stage.label}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-700">{s.stage.emoji} {s.stage.label}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isWorst ? "bg-red-500" : "bg-orange-400"
                      )}
                      style={{ width: `${dropPct}%` }}
                    />
                  </div>

                  <div className="shrink-0 text-right w-20">
                    <span className={cn(
                      "text-[12px] font-black",
                      isWorst ? "text-red-700" : "text-orange-600"
                    )}>
                      -{s.dropOff} ({dropPct}%)
                    </span>
                  </div>

                  {isWorst && (
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer hint */}
          <p className="text-[10px] text-gray-400 text-center">
            Click any stage bubble to filter the lead table below ↓
          </p>
        </div>
      )}
    </div>
  );
};
