"use client";

import { useEffect, useState } from "react";
import Link from "next/link";;
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Flame, Calendar, CheckCircle, IndianRupee,
  ChevronRight, AlertTriangle, Clock, TrendingUp, ArrowRight,
  Bell, Loader2, CalendarClock, Activity, Globe
} from "lucide-react";
import { SEOAttributionPanel } from "@/components/admin/SEOAttributionPanel";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { runAllAutomations } from "@/lib/automationEngine";
import { resolveTemperature, getTemperatureColor, getTemperatureEmoji, resolveScore } from "@/lib/leadScoring";
import { toast } from "sonner";
import { AIInsightsPanel } from "@/components/admin/AIInsightsPanel";
import { computeTutorMetrics } from "@/lib/tutorScore";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("en-IN");

const STAGE_ORDER = ["New Lead", "Contacted", "Trial Booked", "Trial Done", "Converted"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead":   "bg-slate-400",
  "Contacted":  "bg-blue-400",
  "Trial Booked": "bg-violet-500",
  "Trial Done": "bg-amber-500",
  "Converted":  "bg-emerald-500",
};

// ─── Metric card ─────────────────────────────────────────────────────────────
const KPI = ({
  icon: Icon, label, value, sub, color, to, gradient,
}: {
  icon: any; label: string; value: string|number; sub?: string;
  color: string; to: string; gradient?: string;
}) => (
  <Link
    href={to}
    className={cn(
      "group relative rounded-xl p-4 flex flex-col gap-3 border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
      gradient || "bg-white border-gray-200",
    )}
  >
    <div className="flex items-center justify-between">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity", gradient ? "text-white/70" : "text-gray-400")} />
    </div>
    <div>
      <p className={cn("text-[28px] font-black leading-none", gradient ? "text-white" : "text-gray-900")}>{value}</p>
      <p className={cn("text-[11px] font-semibold mt-0.5", gradient ? "text-white/70" : "text-gray-400")}>{label}</p>
      {sub && <p className={cn("text-[10px] mt-0.5", gradient ? "text-white/50" : "text-gray-400")}>{sub}</p>}
    </div>
  </Link>
);

// ─── Mini funnel bar ──────────────────────────────────────────────────────────
const FunnelBar = ({ stage, count, total }: { stage: string; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-gray-500 w-24 shrink-0 font-medium">{stage}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", STAGE_COLORS[stage] || "bg-gray-400")} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-black text-gray-700 w-8 text-right">{count}</span>
      <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
};

// ─── Lead priority row ────────────────────────────────────────────────────────
const LeadRow = ({ lead, onClick }: { lead: any; onClick(): void }) => {
  const temp   = resolveTemperature(lead);
  const score  = resolveScore(lead);
  const colors = getTemperatureColor(temp);
  const emoji  = getTemperatureEmoji(temp);
  return (
    <button onClick={onClick} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[11px] font-black text-white shrink-0">
        {(lead.name || "?")[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-900 truncate">{lead.name}</p>
        <p className="text-[10px] text-gray-400">{lead.class_level || "—"} · {lead.city || "—"}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full border", colors.bg, colors.text, colors.border)}>
          {emoji} {temp}
        </span>
        <span className="text-[11px] font-black text-gray-500">{score}</span>
      </div>
    </button>
  );
};

// ─── Follow-up row ───────────────────────────────────────────────────────────
const FollowUpRow = ({ item }: { item: any }) => {
  const isOverdue = item.next_follow_up && isPast(new Date(item.next_follow_up));
  return (
    <div className={cn("flex items-start gap-3 px-3 py-2.5 rounded-lg", isOverdue && "bg-red-50/60")}>
      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", isOverdue ? "bg-red-500" : "bg-amber-400")} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-900 truncate">{item.name}</p>
        <p className="text-[10px] text-gray-500">{item.next_action || "Follow up due"}</p>
      </div>
      <span className={cn("text-[10px] font-bold shrink-0", isOverdue ? "text-red-600" : "text-amber-600")}>
        {item.next_follow_up ? format(new Date(item.next_follow_up), "dd MMM") : "Today"}
      </span>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0, hotLeads: 0, trialsThisWeek: 0, conversions: 0, monthlyRevenue: 0,
  });
  const [funnelData, setFunnelData] = useState<Record<string, number>>({});
  const [topLeads, setTopLeads]     = useState<any[]>([]);
  const [followUps, setFollowUps]   = useState<any[]>([]);
  const [autoPending, setAutoPending] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [selectedLead, setSelectedLead]     = useState<any>(null);

  // Raw data for insights
  const [rawLeads, setRawLeads] = useState<any[]>([]);
  const [rawTutors, setRawTutors] = useState<any[]>([]);
  const [rawPayments, setRawPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    runAllAutomations().then(({ noResponse }) => {
      if (noResponse > 0) setAutoPending(noResponse);
    }).catch(console.error);
  }, []); // eslint-disable-line

  const fetchAll = async () => {
    setLoadingMetrics(true);
    try {
      const weekStart = startOfWeek(new Date()).toISOString();
      const weekEnd   = endOfWeek(new Date()).toISOString();
      const monthStart = startOfMonth(new Date()).toISOString();
      const today = new Date().toISOString().slice(0, 10);

      const [
        leadsRes, hotRes, trialsRes, convRes, revenueRes, funnelRes, topRes, followRes,
        res9, res10, res11, demoRes
      ] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("lead_temperature", "Hot"),
        supabase.from("leads").select("id", { count: "exact", head: true }).in("status", ["Trial Booked", "Trial Done"]).gte("created_at", weekStart).lte("created_at", weekEnd),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "Converted"),
        supabase.from("lead_tutor_assignments").select("fee").eq("status", "Active"),
        supabase.from("leads").select("status"),
        supabase.from("leads").select("*").order("lead_score", { ascending: false }).limit(5),
        supabase.from("leads").select("id, name, class_level, city, next_follow_up, next_action").not("next_follow_up", "is", null).lte("next_follow_up", today).limit(8),
        // Additional for insights
        supabase.from("leads").select("id, status, city, lead_temperature, last_contacted_at, created_at").limit(100),
        supabase.from("tutor_registrations").select("*"),
        supabase.from("payments").select("*").eq("status", "Pending").limit(50),
        supabase.from("demo_bookings").select("id", { count: "exact", head: true })
      ]);

      const leadsForAI = (res9.data || []);
      const tutorsForAI = (res10.data || []).map(t => ({ 
        ...t, 
        score: computeTutorMetrics([], parseFloat(t.rating) || 0).tutorScore 
      }));
      const paymentsForAI = (res11.data || []);

      setRawLeads(leadsForAI);
      setRawTutors(tutorsForAI);
      setRawPayments(paymentsForAI);

      const rev = (revenueRes.data || []).reduce((a: number, r: any) => a + (r.fee || 0) * 0.5, 0);
      const funnel: Record<string, number> = {};
      (funnelRes.data || []).forEach((r: any) => {
        const s = r.status || "New Lead";
        funnel[s] = (funnel[s] || 0) + 1;
      });

      const totalLeadsCount = (leadsRes.count || 0) + (demoRes.count || 0);

      setMetrics({
        totalLeads:     totalLeadsCount,
        hotLeads:       hotRes.count     || 0,
        trialsThisWeek: trialsRes.count  || 0,
        conversions:    convRes.count    || 0,
        monthlyRevenue: rev,
      });
      setFunnelData(funnel);
      setTopLeads(topRes.data || []);
      setFollowUps(followRes.data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const totalFunnel = Object.values(funnelData).reduce((a, b) => a + b, 0);
  const overdueCount = followUps.length;

  const now = format(new Date(), "EEEE, dd MMMM yyyy");

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1400px] mx-auto">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-gray-900 leading-none">Good morning 👋</h1>
          <p className="text-[12px] text-gray-400 mt-1 font-medium">{now}</p>
        </div>
        <Link href="/admin/leads" className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
          Open CRM <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Automation alert ─────────────────────────────────────────── */}
      {autoPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Bell className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[13px] font-semibold text-amber-800">
            Automation: <strong>{autoPending}</strong> lead{autoPending > 1 ? "s" : ""} marked <em>Inactive</em> — no activity for 48h.
          </p>
          <Link href="/admin/leads" className="ml-auto text-[11px] font-bold text-amber-700 hover:underline shrink-0">View →</Link>
        </div>
      )}

      {/* ── AI Insights Panel ───────────────────────────────────────── */}
      {!loadingMetrics && (
        <AIInsightsPanel 
          leads={rawLeads} 
          tutors={rawTutors} 
          payments={rawPayments} 
          assignments={[]} 
        />
      )}

      {/* ── 5 KPI Cards ──────────────────────────────────────────────── */}
      {loadingMetrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="h-[110px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI icon={Users}       label="Total Leads"       value={fmt(metrics.totalLeads)}     color="bg-indigo-500"  to="/admin/leads"   sub="All time" />
          <KPI icon={Flame}       label="Hot Leads"         value={metrics.hotLeads}             color="bg-red-500"     to="/admin/leads"   sub="🔴 Needs action" />
          <KPI icon={Calendar}    label="Trials This Week"  value={metrics.trialsThisWeek}       color="bg-violet-500"  to="/admin/leads"   sub="Trial Booked + Done" />
          <KPI icon={CheckCircle} label="Conversions"       value={metrics.conversions}          color="bg-emerald-500" to="/admin/leads"   sub="Total converted" />
          <KPI icon={IndianRupee} label="Monthly Revenue"   value={`₹${fmt(metrics.monthlyRevenue)}`} color="bg-teal-500" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" to="/admin/revenue" sub="50% agency cut" />
          <KPI icon={Globe}       label="SEO Leads"         value={rawLeads.filter(l => l.source_page).length} color="bg-indigo-600" to="/admin/funnel" sub="From landing pages" />
        </div>
      )}

      {/* ── Middle row: Funnel snapshot + Priority actions ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Funnel snapshot – compact only */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h2 className="text-[14px] font-black text-gray-900">Funnel Snapshot</h2>
            </div>
            <Link href="/admin/funnel" className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5">
              Full view <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loadingMetrics ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : totalFunnel === 0 ? (
            <p className="text-[12px] text-gray-400 text-center py-6">No leads in funnel yet</p>
          ) : (
            <div className="space-y-2.5">
              {STAGE_ORDER.map(stage => (
                <FunnelBar key={stage} stage={stage} count={funnelData[stage] || 0} total={totalFunnel} />
              ))}
            </div>
          )}
          {!loadingMetrics && totalFunnel > 0 && (
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-gray-500">
              <span>{totalFunnel} total leads</span>
              <span className="font-black text-emerald-600">
                {totalFunnel > 0 ? Math.round(((funnelData["Converted"] || 0) / totalFunnel) * 100) : 0}% conv. rate
              </span>
            </div>
          )}
        </div>

        {/* Priority actions – today's follow-ups + high priority */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Today's / Overdue Follow-Ups */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-500" />
                <h2 className="text-[14px] font-black text-gray-900">Follow-Ups Due</h2>
                {overdueCount > 0 && (
                  <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200">
                    {overdueCount}
                  </span>
                )}
              </div>
              <Link href="/admin/followups" className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex-1 space-y-0.5 -mx-1 overflow-hidden">
              {loadingMetrics ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
              ) : followUps.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                  <p className="text-[12px] text-gray-400 font-medium">All clear! No overdue follow-ups.</p>
                </div>
              ) : (
                followUps.slice(0, 5).map(item => <FollowUpRow key={item.id} item={item} />)
              )}
            </div>
            {followUps.length > 5 && (
              <Link href="/admin/followups" className="mt-3 text-center text-[11px] font-bold text-indigo-500 hover:underline">
                +{followUps.length - 5} more overdue
              </Link>
            )}
          </div>

          {/* Top 5 Hot Leads */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <h2 className="text-[14px] font-black text-gray-900">Priority Leads</h2>
              </div>
              <Link href="/admin/leads" className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex-1 space-y-0.5 -mx-1">
              {loadingMetrics ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
              ) : topLeads.length === 0 ? (
                <p className="text-[12px] text-gray-400 text-center py-6">No leads yet</p>
              ) : (
                topLeads.slice(0, 5).map(lead => (
                  <LeadRow key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Insights / alerts row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-amber-900">Overdue Follow-Ups</p>
            <p className="text-[24px] font-black text-amber-700 leading-none mt-1">{overdueCount}</p>
            <Link href="/admin/followups" className="text-[10px] font-bold text-amber-600 hover:underline mt-1 inline-block">Resolve →</Link>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
          <Activity className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-indigo-900">Hot Leads</p>
            <p className="text-[24px] font-black text-indigo-700 leading-none mt-1">{metrics.hotLeads}</p>
            <Link href="/admin/leads" className="text-[10px] font-bold text-indigo-600 hover:underline mt-1 inline-block">View →</Link>
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
          <Calendar className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-violet-900">Trials This Week</p>
            <p className="text-[24px] font-black text-violet-700 leading-none mt-1">{metrics.trialsThisWeek}</p>
            <Link href="/admin/leads" className="text-[10px] font-bold text-violet-600 hover:underline mt-1 inline-block">View →</Link>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-emerald-900">Conversion Rate</p>
            <p className="text-[24px] font-black text-emerald-700 leading-none mt-1">
              {metrics.totalLeads > 0 ? Math.round((metrics.conversions / metrics.totalLeads) * 100) : 0}%
            </p>
            <Link href="/admin/funnel" className="text-[10px] font-bold text-emerald-600 hover:underline mt-1 inline-block">Funnel →</Link>
          </div>
        </div>
      </div>

      {/* ── Quick nav links ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: "/admin/leads",       label: "Lead CRM",    sub: "Table, filters, scoring", icon: Users,       bg: "bg-indigo-500" },
          { to: "/admin/assignments", label: "Assignments", sub: "Tutor-lead map",           icon: Clock,       bg: "bg-blue-500"   },
          { to: "/admin/revenue",     label: "Revenue",     sub: "Payments & dues",          icon: IndianRupee, bg: "bg-teal-500"   },
          { to: "/admin/funnel",      label: "Funnel",      sub: "Conversion analytics",     icon: TrendingUp,  bg: "bg-violet-500" },
        ].map(item => (
          <Link
            key={item.to}
            href={item.to}
            className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-all hover:border-indigo-200"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.bg)}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-gray-900 truncate">{item.label}</p>
              <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 ml-auto shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
