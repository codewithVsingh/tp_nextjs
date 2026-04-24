"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Flame, Calendar, CheckCircle, IndianRupee,
  ChevronRight, AlertTriangle, Clock, TrendingUp, ArrowRight,
  Bell, CalendarClock, Activity, Globe
} from "lucide-react";
import { SEOAttributionPanel } from "@/components/admin/SEOAttributionPanel";
import { AIInsightsPanel } from "@/components/admin/AIInsightsPanel";
import { format, isPast, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { resolveTemperature, getTemperatureColor, getTemperatureEmoji, resolveScore } from "@/modules/shared/logic/leadScoring";
import { useDashboard } from "../hooks/useDashboard";

const fmt = (n: number) => n.toLocaleString("en-IN");
const STAGE_ORDER = ["New Lead", "Contacted", "Trial Booked", "Trial Done", "Converted"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-slate-400",
  "Contacted": "bg-blue-400",
  "Trial Booked": "bg-violet-500",
  "Trial Done": "bg-amber-500",
  "Converted": "bg-emerald-500",
};

const KPI = ({ icon: Icon, label, value, sub, color, to, gradient }: any) => (
  <Link href={to} className={cn("group relative rounded-xl p-4 flex flex-col gap-3 border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden", gradient || "bg-white border-gray-200")}>
    <div className="flex items-center justify-between">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", color)}><Icon className="w-4.5 h-4.5 text-white" /></div>
      <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity", gradient ? "text-white/70" : "text-gray-400")} />
    </div>
    <div>
      <p className={cn("text-[28px] font-black leading-none", gradient ? "text-white" : "text-gray-900")}>{value}</p>
      <p className={cn("text-[11px] font-semibold mt-0.5", gradient ? "text-white/70" : "text-gray-400")}>{label}</p>
    </div>
  </Link>
);

export default function AdminDashboardView() {
  const { metrics, funnelData, topLeads, followUps, autoPending, loading, rawLeads, rawTutors, rawPayments, fetchAll } = useDashboard();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const now = format(new Date(), "EEEE, dd MMMM yyyy");
  const totalFunnel = Object.values(funnelData).reduce((a, b) => a + b, 0);

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-gray-900 leading-none">Good morning 👋</h1>
          <p className="text-[12px] text-gray-400 mt-1 font-medium">{now}</p>
        </div>
        <Link href="/admin/leads" className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg transition-colors">
          Open CRM <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {autoPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Bell className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[13px] font-semibold text-amber-800">Automation: <strong>{autoPending}</strong> leads marked inactive.</p>
        </div>
      )}

      {!loading && <AIInsightsPanel leads={rawLeads} tutors={rawTutors} payments={rawPayments} assignments={[]} />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPI icon={Users} label="Total Leads" value={fmt(metrics.totalLeads)} color="bg-indigo-500" to="/admin/leads" />
        <KPI icon={Flame} label="Hot Leads" value={metrics.hotLeads} color="bg-red-500" to="/admin/leads" />
        <KPI icon={Calendar} label="Trials This Week" value={metrics.trialsThisWeek} color="bg-violet-500" to="/admin/leads" />
        <KPI icon={CheckCircle} label="Conversions" value={metrics.conversions} color="bg-emerald-500" to="/admin/leads" />
        <KPI icon={IndianRupee} label="Monthly Revenue" value={`₹${fmt(metrics.monthlyRevenue)}`} color="bg-teal-500" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" to="/admin/revenue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-[14px] font-black text-gray-900 mb-4">Funnel Snapshot</h2>
          <div className="space-y-2.5">
            {STAGE_ORDER.map(stage => {
                const count = funnelData[stage] || 0;
                const pct = totalFunnel > 0 ? Math.round((count / totalFunnel) * 100) : 0;
                return (
                    <div key={stage} className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-500 w-24 shrink-0">{stage}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={cn("h-full", STAGE_COLORS[stage])} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] font-black">{count}</span>
                    </div>
                );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-[14px] font-black text-gray-900">Due Follow-Ups</h2>
             <Link href="/admin/followups" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View Schedule</Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followUps.length > 0 ? followUps.map(item => {
                const date = new Date(item.next_follow_up);
                const isOverdue = isPast(date);
                
                return (
                  <div 
                    key={item.id} 
                    className="group relative p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate w-32">{item.name}</span>
                        
                        {/* THE SWAP CONTAINER: Keeps height constant */}
                        <div className="relative h-4 mt-0.5 overflow-hidden">
                          {/* Default: City & Class */}
                          <div className="absolute inset-0 flex items-center gap-1 transition-all duration-300 transform group-hover:-translate-y-full group-hover:opacity-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{item.city}</span>
                            <span className="text-[9px] text-slate-300">•</span>
                            <span className="text-[9px] text-slate-400 font-bold truncate w-24">{item.class_level}</span>
                          </div>
                          
                          {/* Hover: Date & Phone */}
                          <div className="absolute inset-0 flex items-center gap-2 transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="text-[9px] text-slate-500 font-bold">{format(date, "dd MMM")}</span>
                            <span className="text-[9px] text-slate-300">|</span>
                            <span className="text-[9px] text-indigo-600 font-black tracking-tighter">{item.phone || "No Contact"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <div className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter",
                          isOverdue ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600"
                        )}>
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(date, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Gradient Strip */}
                    <div className={cn(
                      "absolute bottom-0 left-3 right-3 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                      isOverdue ? "bg-gradient-to-r from-rose-400 to-orange-400" : "bg-gradient-to-r from-indigo-400 to-violet-400"
                    )} />
                  </div>
                );
            }) : (
              <div className="col-span-2 py-8 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <CalendarClock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No follow-ups due today</p>
              </div>
            )}
           </div>
        </div>
      </div>

      <SEOAttributionPanel leads={rawLeads} />
    </div>
  );
}

