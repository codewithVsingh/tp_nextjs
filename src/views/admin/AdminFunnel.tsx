"use client";

/**
 * AdminFunnel — Advanced Analytics System
 * ─────────────────────────────────────────────────────────────────────────────
 * Features: Multi-stage vertical funnel, Cohort analysis, Drop-off insights,
 * Time-to-conversion metrics, and regional/counsellor breakdowns.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  format, subDays, startOfWeek, endOfWeek, differenceInHours,
  parseISO, startOfDay, endOfDay, subMonths
} from "date-fns";
import {
  TrendingUp, TrendingDown, Users, Target, Clock,
  AlertTriangle, Filter, RefreshCw, BarChart3, PieChart as PieIcon,
  ChevronRight, Calendar, UserCheck, Flame, Globe
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SEOAttributionPanel } from "@/components/admin/SEOAttributionPanel";

// ─── types & helpers ──────────────────────────────────────────────────────────
const PCT = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className={cn("bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm", color)}>
    <div className="p-2.5 rounded-lg bg-white/70 shadow-sm"><Icon className="w-4 h-4" /></div>
    <div>
      <p className="text-[22px] font-black text-gray-900 leading-none">{value}</p>
      <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminFunnel() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Analytics Logic ────────────────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return leads;
    const from = startOfDay(dateRange.from).getTime();
    const to   = endOfDay(dateRange.to).getTime();
    return leads.filter(l => {
      const d = new Date(l.created_at).getTime();
      return d >= from && d <= to;
    });
  }, [leads, dateRange]);

  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const conv  = filteredLeads.filter(l => l.status === "Converted").length;
    const trial = filteredLeads.filter(l => ["Trial Booked", "Trial Done", "Converted"].includes(l.status)).length;
    const dropped = filteredLeads.filter(l => l.status === "Dropped").length;

    // Time Metrics
    const convWithTime = filteredLeads.filter(l => l.status === "Converted" && l.converted_at);
    const avgConvTime = convWithTime.length > 0 
      ? Math.round(convWithTime.reduce((sum, l) => sum + differenceInHours(parseISO(l.converted_at), parseISO(l.created_at)), 0) / convWithTime.length)
      : null;

    // Subject breakdown
    const subjectMap: Record<string, { total: number; conv: number }> = {};
    filteredLeads.forEach(l => {
      const subs = Array.isArray(l.subjects) ? l.subjects : ["Unknown"];
      subs.forEach((s: string) => {
        if (!subjectMap[s]) subjectMap[s] = { total: 0, conv: 0 };
        subjectMap[s].total++;
        if (l.status === "Converted") subjectMap[s].conv++;
      });
    });
    const subjectData = Object.entries(subjectMap).map(([name, v]) => ({
      name,
      leads: v.total,
      rate: PCT(v.conv, v.total)
    })).sort((a, b) => b.leads - a.leads).slice(0, 6);

    // Drop reason breakdown
    const dropMap: Record<string, number> = {};
    filteredLeads.forEach(l => {
      if (l.status === "Dropped") {
        const reason = l.drop_reason || "Unspecified";
        dropMap[reason] = (dropMap[reason] || 0) + 1;
      }
    });
    const dropData = Object.entries(dropMap).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);

    // Cohort Analysis (Weekly)
    const cohortMap: Record<string, { week: string; leads: number; conv: number }> = {};
    filteredLeads.forEach(l => {
      const week = format(startOfWeek(parseISO(l.created_at)), "MMM dd");
      if (!cohortMap[week]) cohortMap[week] = { week, leads: 0, conv: 0 };
      cohortMap[week].leads++;
      if (l.status === "Converted") cohortMap[week].conv++;
    });
    const cohortData = Object.values(cohortMap).reverse();

    return {
      total,
      conv,
      trial,
      dropped,
      overallRate: PCT(conv, total),
      trialRate: PCT(trial, total),
      avgConvTime,
      subjectData,
      dropData,
      cohortData
    };
  }, [filteredLeads]);

  // Bottleneck detection
  const bottleneck = useMemo(() => {
    // Stage counts
    const s1 = filteredLeads.length; // New
    const s2 = filteredLeads.filter(l => ["Contacted", "Trial Booked", "Trial Done", "Converted"].includes(l.status)).length;
    const s3 = filteredLeads.filter(l => ["Trial Booked", "Trial Done", "Converted"].includes(l.status)).length;
    const s4 = filteredLeads.filter(l => l.status === "Converted").length;

    const stages = [
      { id: "Inquiry → Reach", val: PCT(s2, s1) },
      { id: "Reach → Trial", val: PCT(s3, s2) },
      { id: "Trial → Win", val: PCT(s4, s3) },
    ];
    return stages.sort((a, b) => a.val - b.val)[0]; // Lowest conv rate is the bottleneck
  }, [filteredLeads]);

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1600px] mx-auto">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-500" /> Advanced Funnel Analytics
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Conversion velocity · Cohort tracking · Drop-off forensics</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[12px] font-bold border-gray-200">
                <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                {dateRange?.from ? format(dateRange.from, "MMM dd") + " – " + (dateRange.to ? format(dateRange.to, "MMM dd") : "now") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarUI mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 text-gray-400">
             <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Higher Level KPIs ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Leads" value={stats.total} color="bg-blue-50 border-blue-100 text-blue-700" />
        <StatCard icon={Target} label="Lead → Conv" value={`${stats.overallRate}%`} sub={`Goal: 15%`} color="bg-emerald-50 border-emerald-100 text-emerald-700" />
        <StatCard icon={Clock} label="Avg Time to Win" value={stats.avgConvTime ? `${stats.avgConvTime}h` : "—"} sub="From Inquiry to Converted" color="bg-indigo-50 border-indigo-100 text-indigo-700" />
        <div className={cn("rounded-xl border p-4 flex flex-col justify-center", "bg-red-50 border-red-200")}>
           <div className="flex items-center gap-2 mb-1">
             <AlertTriangle className="w-4 h-4 text-red-500" />
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Main Bottleneck</p>
           </div>
           <p className="text-[18px] font-black text-red-900 leading-tight">{bottleneck?.id ?? "None detected"}</p>
           <p className="text-[11px] font-bold text-red-500 mt-0.5">Performance: {bottleneck?.val ?? 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funnel Visual */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-[14px] font-black text-gray-900">Conversion Workflow</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-400" /><span className="text-[10px] font-bold text-gray-400 uppercase">Input</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] font-bold text-gray-400 uppercase">Conversion</span></div>
            </div>
          </div>
          <div className="p-8 flex flex-col items-center">
            {/* Stage: Leads */}
            <div className="w-full max-w-[400px] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
                <span>Total Leads</span>
                <span>100%</span>
              </div>
              <div className="h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-between px-6 transform hover:scale-[1.02] transition-transform">
                 <span className="text-white font-black text-lg">{stats.total}</span>
                 <Users className="w-5 h-5 text-white/30" />
              </div>
            </div>

            <ChevronRight className="w-6 h-6 text-gray-200 rotate-90 my-2" />

            {/* Stage: Trials */}
            <div className="w-full max-w-[340px] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
                <span>Trials Booked</span>
                <span>{stats.trialRate}%</span>
              </div>
              <div className="h-12 bg-indigo-400 rounded-xl flex items-center justify-between px-6 opacity-90 transform hover:scale-[1.02] transition-transform">
                 <span className="text-white font-black text-[16px]">{stats.trial}</span>
                 <div className="text-[10px] text-white/60 font-black">-{stats.total - stats.trial} Dropoff</div>
              </div>
            </div>

            <ChevronRight className="w-6 h-6 text-gray-200 rotate-90 my-2" />

            {/* Stage: Conversions */}
            <div className="w-full max-w-[280px] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
                <span>Converted Won</span>
                <span>{stats.overallRate}%</span>
              </div>
              <div className="h-12 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-50 flex items-center justify-between px-6 transform hover:scale-[1.02] transition-transform">
                 <span className="text-white font-black text-[16px]">{stats.conv}</span>
                 <UserCheck className="w-4 h-4 text-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Drop Reasons */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
           <div className="flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-red-500" />
             <h3 className="text-[14px] font-black text-gray-900">Why are leads dropping?</h3>
           </div>
           <div className="space-y-4">
             {stats.dropData.length === 0 ? (
               <div className="py-12 text-center text-[12px] text-gray-400">No drop reason data available</div>
             ) : (
               stats.dropData.map((d, i) => (
                 <div key={d.name} className="space-y-1">
                   <div className="flex justify-between text-[11px] font-bold">
                     <span className="text-gray-600">{d.name}</span>
                     <span className="text-gray-900">{d.value}</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-400 rounded-full" style={{ width: `${(d.value / stats.dropped) * 100}%` }} />
                   </div>
                 </div>
               ))
             )}
           </div>
           <div className="pt-4 border-t border-dashed">
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                 <Flame className="w-4 h-4 text-orange-500" />
                 <p className="text-[11px] font-bold text-gray-500">Biggest opportunity: <span className="text-gray-900">Targeting {stats.dropData[0]?.name}</span></p>
              </div>
           </div>
        </div>

      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject wise conversion */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-500" />
            <h3 className="text-[14px] font-black text-gray-900">Subject Conversion Rate</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   formatter={(v: any) => [`${v}% Rate`]}
                />
                <Bar dataKey="rate" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Analysis */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-[14px] font-black text-gray-900">Weekly Performance Cohorts</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[12px]">
               <thead>
                 <tr className="border-b text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                    <th className="pb-3">Batch (Week Of)</th>
                    <th className="pb-3 text-center">New Leads</th>
                    <th className="pb-3 text-center">Conv.</th>
                    <th className="pb-3 text-right">Conv. %</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {stats.cohortData.map(c => (
                   <tr key={c.week} className="hover:bg-gray-50 transition-colors">
                     <td className="py-3 font-bold text-gray-900">{c.week}</td>
                     <td className="py-3 text-center">{c.leads}</td>
                     <td className="py-3 text-center font-bold text-emerald-600">{c.conv}</td>
                     <td className="py-3 text-right">
                       <Badge className={cn("text-[10px] font-black shadow-none border-none", (c.conv/c.leads)*100 > 15 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600")}>
                         {PCT(c.conv, c.leads)}%
                       </Badge>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

      </div>

      {/* ── SEO Attribution & ROI ────────────────────────────────────── */}
      <div className="pt-6 border-t border-gray-100">
        <div className="mb-6">
          <h2 className="text-[18px] font-black text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" /> Programmatic SEO ROI Dashboard
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">Real-time attribution and conversion analysis for 3,000+ landing pages</p>
        </div>
        <SEOAttributionPanel leads={filteredLeads} />
      </div>

    </div>
  );
}
