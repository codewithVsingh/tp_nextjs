"use client";

/**
 * AdminCities — City Intelligence System
 * ─────────────────────────────────────────────────────────────────────────────
 * Tracks performance across different geographic regions.
 * Metrics: Demand (Leads), Supply (Tutors), Conversion Rate, and Revenue.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay, endOfDay, subMonths } from "date-fns";
import {
  MapPin, Users, GraduationCap, IndianRupee, Target,
  RefreshCw, Filter, Calendar, Search, ArrowUpRight,
  Loader2, Globe, Building2, TrendingUp, AlertCircle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell, ComposedChart, Line
} from "recharts";

// ─── types & helpers ──────────────────────────────────────────────────────────
const INR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const PCT = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

const KPICard = ({ label, value, sub, icon: Icon, color }: any) => (
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
export default function AdminCities() {
  const [leads, setLeads]   = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, tutorRes, payRes] = await Promise.all([
        supabase.from("leads").select("id, city, subjects, status, created_at"),
        supabase.from("tutor_registrations").select("id, city, subjects"),
        supabase.from("payments").select("amount, city, status, created_at").eq("status", "Paid"),
      ]);
      setLeads(leadsRes.data || []);
      setTutors(tutorRes.data || []);
      setPayments(payRes.data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Analytics Logic ────────────────────────────────────────────────────────
  const cityData = useMemo(() => {
    // 1. Initial City Map
    const map: Record<string, any> = {};
    
    // Process Leads (Demand)
    leads.forEach(l => {
      const city = (l.city || "Other").trim().toLowerCase();
      const cityName = (l.city || "Other").trim();
      
      // Filter by subject if needed
      if (filterSubject.trim()) {
        const subs = Array.isArray(l.subjects) ? l.subjects : [];
        if (!subs.some((s: string) => s.toLowerCase().includes(filterSubject.toLowerCase()))) return;
      }
      
      // Filter by time if needed
      if (dateRange?.from && dateRange?.to) {
        const d = new Date(l.created_at).getTime();
        if (d < startOfDay(dateRange.from).getTime() || d > endOfDay(dateRange.to).getTime()) return;
      }

      const key = city;
      if (!map[key]) map[key] = { city: cityName, leads: 0, conv: 0, revenue: 0, tutors: 0 };
      map[key].leads++;
      if (l.status === "Converted") map[key].conv++;
    });

    // Process Tutors (Supply)
    tutors.forEach(t => {
      const city = (t.city || "Other").trim().toLowerCase();
      // Subject filter for supply too
      if (filterSubject.trim()) {
        const subs = Array.isArray(t.subjects) ? t.subjects : [];
        if (!subs.some((s: string) => s.toLowerCase().includes(filterSubject.toLowerCase()))) return;
      }
      const key = city;
      if (map[key]) map[key].tutors++;
    });

    // Process Revenue
    payments.forEach(p => {
      const city = (p.city || "Other").trim().toLowerCase();
      if (dateRange?.from && dateRange?.to) {
        const d = new Date(p.created_at).getTime();
        if (d < startOfDay(dateRange.from).getTime() || d > endOfDay(dateRange.to).getTime()) return;
      }
      const key = city;
      if (map[key]) map[key].revenue += Number(p.amount);
    });

    return Object.values(map).map(c => ({
      ...c,
      rate: PCT(c.conv, c.leads),
      ratio: c.tutors > 0 ? (c.leads / c.tutors).toFixed(1) : c.leads.toFixed(1),
    })).sort((a, b) => b.revenue - a.revenue);
  }, [leads, tutors, payments, filterSubject, dateRange]);

  const topCity = cityData[0];
  const totalRevenue = cityData.reduce((a, b) => a + b.revenue, 0);

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" /> City Analytics
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Geographic performance · Demand/Supply heatmaps</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 text-gray-400">
             <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Filter Subject..." 
              value={filterSubject} 
              onChange={e => setFilterSubject(e.target.value)} 
              className="h-8 text-[12px] w-[130px] border-teal-100"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-[12px] border-teal-100">
                  <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                  {dateRange?.from ? format(dateRange.from, "MMM dd") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarUI mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Building2} label="Primary City" value={topCity?.city || "—"} sub={`Contributing ${PCT(topCity?.revenue || 0, totalRevenue)}% revenue`} color="bg-teal-50 border-teal-100 text-teal-800" />
        <KPICard icon={IndianRupee} label="Avg Revenue / City" value={INR(totalRevenue / (cityData.length || 1))} color="bg-emerald-50 border-emerald-100 text-emerald-800" />
        <KPICard icon={Target} label="Avg Conv. Rate" value={`${PCT(cityData.reduce((a,b)=>a+b.conv,0), cityData.reduce((a,b)=>a+b.leads,0))}%`} color="bg-blue-50 border-blue-100 text-blue-800" />
        <KPICard icon={Users} label="Total Coverage" value={`${cityData.length} Cities`} sub="Active inquiry locations" color="bg-gray-50 border-gray-100 text-gray-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Demand vs Supply Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <h3 className="text-[14px] font-black text-gray-900">Demand vs Supply Gap</h3>
            </div>
          </div>
          <div className="p-6 h-[340px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={cityData.slice(0, 10)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="city" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                 <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                 <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                 <Bar name="Leads (Demand)" dataKey="leads" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={32} />
                 <Bar name="Tutors (Supply)" dataKey="tutors" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={32} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage Highlights */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <h3 className="text-[14px] font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" /> Underserved Regions
          </h3>
          <p className="text-[12px] text-gray-400 mb-6">Cities with high demand but low tutor supply.</p>
          
          <div className="space-y-4 flex-1">
            {cityData
              .filter(c => c.leads > 5 && c.tutors < 3)
              .slice(0, 5)
              .map(c => (
                <div key={c.city} className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900 text-[13px]">{c.city}</p>
                    <p className="text-[10px] text-orange-600 font-bold">{c.leads} Leads · Only {c.tutors} Tutors</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 shadow-none border-none text-[10px] h-5">Action</Badge>
                </div>
              ))}
            {cityData.filter(c => c.leads > 5 && c.tutors < 3).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                <Globe className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-[11px] font-bold">All regions well-covered</p>
              </div>
            )}
          </div>
          
          <Button variant="outline" className="w-full mt-6 text-teal-600 border-teal-200 hover:bg-teal-50 font-bold text-[12px] h-9">
            View Hiring Strategy
          </Button>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-[14px] font-black text-gray-900">City Performance Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white text-gray-400 font-bold border-b">
              <tr>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px]">City Name</th>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px] text-center">Leads</th>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px] text-center">Tutors</th>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px] text-center">Conv. Rate</th>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px] text-right">Revenue</th>
                <th className="px-6 py-3 uppercase tracking-widest text-[9px] text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-400" /></td></tr>
              ) : cityData.map((c, i) => (
                <tr key={c.city} className="hover:bg-teal-50/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center font-black text-teal-600 border border-teal-100">
                        {i + 1}
                      </div>
                      <span className="font-bold text-gray-900">{c.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700">{c.leads}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-400">{c.tutors}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-black text-blue-600">{c.rate}%</span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.rate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-emerald-600">{INR(c.revenue)}</td>
                  <td className="px-6 py-4 text-right">
                     <Badge className={cn("text-[10px] font-black shadow-none border-none", c.leads > 10 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                        {c.leads > 10 ? "High Demand" : "Stable"}
                     </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
