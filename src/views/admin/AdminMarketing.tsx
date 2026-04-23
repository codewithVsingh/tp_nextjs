"use client";

/**
 * AdminMarketing — Marketing Attribution & Performance System
 * ─────────────────────────────────────────────────────────────────────────────
 * Tracks: Lead sources, Campaign ROI, CPL, CAC, and Channel Revenue.
 * Visuals: Performance split (Donut), ROI Trend (Bar), Source Table.
 * Filters: Date Range, City.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth, endOfDay } from "date-fns";
import {
  Megaphone, Target, DollarSign, TrendingUp, Users,
  BarChart3, Loader2, Filter, Calendar, Search, RefreshCw,
  ArrowUpRight, ArrowDownRight, Compass, MousePointer2
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  ComposedChart, Line
} from "recharts";

// ─── types & helpers ──────────────────────────────────────────────────────────
const INR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const PCT = (n: number) => `${n.toFixed(1)}%`;

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

const MetricCard = ({ label, value, sub, color, icon: Icon }: any) => (
  <div className={cn("bg-white border rounded-xl p-4 flex items-start gap-4 shadow-sm", color)}>
    <div className="p-2 rounded-lg bg-white/60">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[22px] font-black leading-tight">{value}</p>
      <p className="text-[11px] font-bold opacity-70 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] opacity-50 mt-0.5 font-medium">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMarketing() {
  const [leads, setLeads]           = useState<any[]>([]);
  const [payments, setPayments]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterCity, setFilterCity]   = useState("");
  const [filterDate, setFilterDate]   = useState<DateRange | undefined>({
    from: subMonths(startOfMonth(new Date()), 2),
    to: new Date(),
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, payRes, demoRes] = await Promise.all([
        supabase.from("leads").select("*"),
        supabase.from("payments").select("*").eq("status", "Paid"),
        supabase.from("demo_bookings").select("*")
      ]);
      
      const combinedLeads = [
        ...(leadsRes.data || []),
        ...(demoRes.data || []).map(d => ({ ...d, source: d.source || "demo_booking_page" }))
      ];

      setLeads(combinedLeads);
      setPayments(payRes.data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Filter Logic ───────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    let l = leads;
    if (filterCity.trim()) {
      l = l.filter(x => x.city?.toLowerCase().includes(filterCity.toLowerCase()));
    }
    if (filterDate?.from && filterDate?.to) {
      const from = filterDate.from.getTime();
      const to   = endOfDay(filterDate.to).getTime();
      l = l.filter(x => {
        const d = new Date(x.created_at).getTime();
        return d >= from && d <= to;
      });
    }
    return l;
  }, [leads, filterCity, filterDate]);

  // ─── Stats Logic ────────────────────────────────────────────────────────────
  const sourcePerformance = useMemo(() => {
    const map: Record<string, any> = {};
    
    filteredData.forEach(lead => {
      const src = lead.source || "Organic";
      if (!map[src]) {
        map[src] = {
          source: src,
          leads: 0,
          conversions: 0,
          spend: 0,
          revenue: 0,
        };
      }
      map[src].leads += 1;
      map[src].spend += Number(lead.campaign_cost || 0);
      
      // Determine conversion: either status is 'Converted' or has active assignments
      const isConverted = lead.status === "Converted" || lead.status === "Trial Done";
      if (isConverted) map[src].conversions += 1;

      // Revenue for this specific lead
      map[src].revenue += payments
        .filter(p => p.lead_id === lead.id)
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    });

    return Object.values(map).map(s => {
      const cpl = s.leads > 0 ? s.spend / s.leads : 0;
      const cac = s.conversions > 0 ? s.spend / s.conversions : 0;
      const roi = s.spend > 0 ? ((s.revenue - s.spend) / s.spend) * 100 : 0;
      const convRate = s.leads > 0 ? (s.conversions / s.leads) * 100 : 0;
      return { ...s, cpl, cac, roi, convRate };
    }).sort((a, b) => b.leads - a.leads);
  }, [filteredData, payments]);

  const totalMetrics = useMemo(() => {
    const leadsCount   = filteredData.length;
    const spend        = filteredData.reduce((a, b) => a + Number(b.campaign_cost || 0), 0);
    const revenue      = sourcePerformance.reduce((a, b) => a + b.revenue, 0);
    const conversions  = sourcePerformance.reduce((a, b) => a + b.conversions, 0);
    const avgROI       = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
    
    return {
      leads: leadsCount,
      spend,
      revenue,
      conversions,
      cpl: leadsCount > 0 ? spend / leadsCount : 0,
      cac: conversions > 0 ? spend / conversions : 0,
      roi: avgROI
    };
  }, [filteredData, sourcePerformance]);

  const bestSource = useMemo(() => {
    if (!sourcePerformance.length) return null;
    return [...sourcePerformance].sort((a, b) => b.roi - a.roi)[0];
  }, [sourcePerformance]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-pink-500" /> Marketing Attribution
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Track lead acquisition cost & ROI per channel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchAll} className="h-8 text-[12px]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-[12px]">
            <Target className="w-3.5 h-3.5 mr-1.5" /> Optimize Reach
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard icon={Users}       label="Total Leads"  value={totalMetrics.leads}        color="bg-gray-50 border-gray-100 text-gray-700" />
        <MetricCard icon={DollarSign}  label="Total Spend"  value={INR(totalMetrics.spend)}  color="bg-pink-50 border-pink-100 text-pink-800" />
        <MetricCard icon={TrendingUp}   label="Total Revenue" value={INR(totalMetrics.revenue)} color="bg-emerald-50 border-emerald-100 text-emerald-800" />
        <MetricCard icon={MousePointer2} label="Avg CPL"      value={INR(totalMetrics.cpl)}      color="bg-blue-50 border-blue-100 text-blue-800" sub="Cost per Lead" />
        <MetricCard icon={Target}      label="Avg CAC"      value={INR(totalMetrics.cac)}      color="bg-violet-50 border-violet-100 text-violet-800" sub="Acquisition Cost" />
        <MetricCard icon={ArrowUpRight} label="Avg ROI"      value={`${totalMetrics.roi.toFixed(0)}%`} color="bg-amber-50 border-amber-100 text-amber-800" />
      </div>

      {/* Highlights & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Split (Donut) */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[14px] font-black text-gray-900">Lead Source Mix</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcePerformance}
                  dataKey="leads"
                  nameKey="source"
                  cx="50%" cy="50%"
                  innerRadius="50%" outerRadius="80%"
                  stroke="#fff" strokeWidth={2}
                  label={({ source, percent }) => percent > 0.1 ? `${source}` : ""}
                >
                  {sourcePerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  formatter={(v, name) => [`${v} leads`, name]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
             {sourcePerformance.slice(0, 4).map((s, i) => (
               <div key={s.source} className="flex items-center gap-1.5 overflow-hidden">
                 <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                 <span className="text-[11px] font-bold text-gray-700 truncate">{s.source}</span>
                 <span className="text-[10px] text-gray-400 ml-auto">{((s.leads / totalMetrics.leads) * 100).toFixed(0)}%</span>
               </div>
             ))}
          </div>
        </div>

        {/* ROI Performance (Bar) */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[14px] font-black text-gray-900">ROI & Revenue per Source</h3>
            </div>
            <div className="flex items-center gap-3">
               {bestSource && (
                 <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                   <ZapIcon className="w-3 h-3" />
                   <span className="text-[10px] font-black">BEST CHANNEL: {bestSource.source}</span>
                 </div>
               )}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcePerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="source" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} />
                <Bar name="Revenue" dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar name="Spend" dataKey="spend" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-[15px] text-gray-800">
             <BarChart3 className="w-4 h-4 text-blue-500" /> Channel Performance Ledger
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter: City */}
            <Input 
              placeholder="Filter City..." 
              value={filterCity} 
              onChange={e => setFilterCity(e.target.value)} 
              className="h-8 text-[12px] w-[130px]"
            />
            {/* Filter: Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-[12px] min-w-[180px] justify-start px-3 font-normal overflow-hidden">
                  <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                  {filterDate?.from ? (
                    filterDate.to ? <>{format(filterDate.from, "MMM dd")} – {format(filterDate.to, "MMM dd")}</> : format(filterDate.from, "MMM dd")
                  ) : "Date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarUI mode="range" selected={filterDate} onSelect={setFilterDate} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-6 py-3">Source Channel</th>
                <th className="px-6 py-3 text-center">Leads</th>
                <th className="px-6 py-3 text-center">Conversions</th>
                <th className="px-6 py-3 text-right">Spend</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3 text-center">CPL / CAC</th>
                <th className="px-6 py-3 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" /></td></tr>
              ) : sourcePerformance.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No attribution data detected for this filter.</td></tr>
              ) : (
                sourcePerformance.map((s, idx) => (
                  <tr key={s.source} className={cn("hover:bg-gray-50 transition-colors", idx === 0 && "bg-emerald-50/20")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-500">
                          {s.source[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{s.source}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{PCT(s.convRate)} Conv. Rate</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black">{s.leads}</td>
                    <td className="px-6 py-4 text-center font-black text-blue-600">{s.conversions}</td>
                    <td className="px-6 py-4 text-right font-black text-pink-600">{INR(s.spend)}</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">{INR(s.revenue)}</td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col items-center">
                         <span className="text-[11px] font-bold text-gray-900">{INR(s.cpl)} CPL</span>
                         <span className="text-[10px] text-gray-400">{INR(s.cac)} CAC</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end">
                         <Badge className={cn("text-[10px] font-black border-none shadow-none", s.roi > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                           {s.roi > 0 ? "+" : ""}{s.roi.toFixed(0)}% ROI
                         </Badge>
                         {s.roi > 200 && <span className="text-[9px] text-emerald-600 font-bold mt-1 uppercase tracking-tight">High Perf ✨</span>}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-center text-[10px] text-gray-400 italic">
        * Marketing metrics are computed in real-time based on campaign_cost fields in Leads and Student payments in Revenue logs.
      </p>

    </div>
  );
}

function ZapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
