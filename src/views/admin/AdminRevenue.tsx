"use client";

/**
 * AdminRevenue — Revenue Intelligence System
 * ─────────────────────────────────────────────────────────────────────────────
 * Metrics: Monthly Revenue, MRR, Expected 30d, Growth %, Paid, Pending, Overdue
 * Charts : Monthly trend (Paid/Pending/Overdue), Tutor revenue split
 * Tables : Overdue alerts, Tutor leaderboard, Full payment ledger
 * Filters: Date range, City
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  format, parseISO, startOfMonth, endOfDay, isPast, subMonths, addDays,
} from "date-fns";
import {
  IndianRupee, TrendingUp, TrendingDown, Calendar, AlertTriangle,
  Plus, RefreshCw, Loader2, Trophy, BarChart3, Users, Clock,
  Download, Filter, ChevronRight, CheckCircle,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { AddPaymentModal } from "@/components/admin/AddPaymentModal";

// ─── helpers ──────────────────────────────────────────────────────────────────
const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const KPICard = ({
  icon: Icon, label, value, sub, color, trend,
}: {
  icon: any; label: string; value: string; sub?: string;
  color: string; trend?: { dir: "up"|"down"|"flat"; pct: number };
}) => (
  <div className={cn("rounded-xl border p-4 flex flex-col gap-2", color)}>
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className={cn("text-[10px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
          trend.dir === "up" ? "bg-emerald-100 text-emerald-700" :
          trend.dir === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
        )}>
          {trend.dir === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : trend.dir === "down" ? <TrendingDown className="w-2.5 h-2.5" /> : null}
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

// ─── Tutor revenue row ─────────────────────────────────────────────────────────
const TutorRevenueRow = ({ tutor, rank }: { tutor: any; rank: number }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
    <span className={cn("text-[12px] font-black w-5 shrink-0 text-center",
      rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-amber-600" : "text-gray-300"
    )}>#{rank}</span>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[12px] font-black shrink-0">
      {(tutor.tutor_name || "?")[0].toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-bold text-gray-900 truncate">{tutor.tutor_name || "—"}</p>
      <p className="text-[10px] text-gray-400">{tutor.paid_count} paid · {tutor.pending_count} pending</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[14px] font-black text-emerald-700">{INR(tutor.total_collected || 0)}</p>
      <p className="text-[9px] text-gray-400">Agency: {INR((tutor.total_collected || 0) * 0.5)}</p>
    </div>
  </div>
);

// ─── Payment row ───────────────────────────────────────────────────────────────
const PaymentRow = ({ p, onEdit }: { p: any; onEdit(p: any): void }) => {
  const isOverdue = p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date)));
  const statusCfg = {
    Paid:    { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    Pending: { cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400" },
    Overdue: { cls: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
  };
  const cfg = isOverdue ? statusCfg.Overdue : statusCfg[p.status as keyof typeof statusCfg] || statusCfg.Pending;
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors", isOverdue && "bg-red-50/30")}>
      <div className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-0.5">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[12px] font-bold text-gray-900 truncate">{p.lead_name || "—"}</p>
          <p className="text-[10px] text-gray-400 truncate">{p.tutor_name || "No tutor"}</p>
        </div>
        <p className="text-[11px] text-gray-600 font-medium self-center hidden sm:block">{p.month || "—"}</p>
        <p className="text-[11px] text-gray-500 self-center hidden sm:block">{p.city || "—"}</p>
        <div className="text-right">
          <p className="text-[13px] font-black text-gray-900">{INR(Number(p.amount) || 0)}</p>
          {p.subscription_type === "Monthly" && <p className="text-[9px] text-indigo-500 font-bold">Monthly</p>}
        </div>
      </div>
      <Badge variant="outline" className={cn("text-[9px] h-5 font-bold border shrink-0", cfg.cls)}>
        {isOverdue ? "Overdue" : p.status}
      </Badge>
      <Button size="sm" variant="ghost" onClick={() => onEdit(p)} className="h-7 text-[10px] shrink-0 text-gray-400 hover:text-indigo-600">
        Edit
      </Button>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdminRevenue() {
  const [payments, setPayments]   = useState<any[]>([]);
  const [assignments, setAssign]  = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [addOpen, setAddOpen]     = useState(false);
  const [editPayment, setEdit]    = useState<any>(null);
  const [chartMode, setChartMode] = useState<"trend"|"donut">("trend");

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(startOfMonth(new Date()), 5),
    to: new Date(),
  });
  const [filterCity, setCity]     = useState("");
  const [filterStatus, setStatus] = useState("all");
  const [filterSub, setSub]       = useState("all");
  const [payPage, setPayPage]     = useState(1);
  const payPageSize = 12;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [payRes, assnRes] = await Promise.all([
        supabase.from("payments").select("*").order("payment_month", { ascending: false }).limit(500),
        supabase.from("lead_tutor_assignments").select("tutor_id, tutor_name, fee, status, start_date, class_level").eq("status", "Active"),
      ]);
      setPayments(payRes.data || []);
      setAssign(assnRes.data || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);

  const exportToCSV = (data: any[]) => {
    const headers = ["Date", "Month", "Lead", "Tutor", "Mobile", "City", "Amount", "Tutor Earning", "Commission %", "Commission Amt", "Status", "Payout Status"];
    const rows = data.map(p => [
      p.created_at ? format(parseISO(p.created_at), "dd/MM/yyyy") : "-",
      p.month || "-",
      p.lead_name || "-",
      p.tutor_name || "-",
      p.tutor_phone || "-",
      p.city || "-",
      p.amount || 0,
      p.tutor_payout_amount || 0,
      p.commission_pct || 50,
      p.commission_amount || 0,
      p.status || "Pending",
      p.payout_status || "Pending"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `revenue_payout_report_${format(new Date(), "yyyy_MM_dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtered payments ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let p = payments;
    if (filterCity.trim())   p = p.filter(x => x.city?.toLowerCase().includes(filterCity.toLowerCase()));
    if (filterStatus !== "all") p = p.filter(x => {
      const isOvr = x.status === "Overdue" || (x.status === "Pending" && x.due_date && isPast(new Date(x.due_date)));
      if (filterStatus === "Overdue") return isOvr;
      return x.status === filterStatus;
    });
    if (filterSub !== "all") p = p.filter(x => x.subscription_type === filterSub);
    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from.getTime();
      const to   = endOfDay(dateRange.to).getTime();
      p = p.filter(x => {
        const d = x.payment_month ? new Date(x.payment_month).getTime() : 0;
        return d >= from && d <= to;
      });
    }
    return p;
  }, [payments, filterCity, filterStatus, filterSub, dateRange]);

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const kpi = useMemo(() => {
    const now = new Date();
    const thisMonth = format(now, "MMMM yyyy");
    const lastMonth = format(subMonths(now, 1), "MMMM yyyy");

    const paid    = filtered.filter(p => p.status === "Paid");
    const pending = filtered.filter(p => p.status === "Pending");
    const overdue = filtered.filter(p => p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date))));

    const thisPaid = paid.filter(p => p.month === thisMonth).reduce((a, p) => a + Number(p.amount), 0);
    const lastPaid = paid.filter(p => p.month === lastMonth).reduce((a, p) => a + Number(p.amount), 0);
    const growth   = lastPaid > 0 ? Math.round(((thisPaid - lastPaid) / lastPaid) * 100) : 0;

    const mrr = assignments.filter(a => a.status === "Active").reduce((a, r) => a + (r.fee || 0) * 0.5, 0);
    const expected30d = mrr; // Active subscriptions expected next month

    return {
      monthlyRevenue: thisPaid,
      totalPaid:      paid.reduce((a, p) => a + Number(p.amount), 0),
      totalPending:   pending.reduce((a, p) => a + Number(p.amount), 0),
      totalOverdue:   overdue.reduce((a, p) => a + Number(p.amount), 0),
      overdueList:    overdue,
      mrr,
      expected30d,
      growth,
      paidCount:      paid.length,
      pendingCount:   pending.length,
      overdueCount:   overdue.length,
      totalPayoutDue: filtered.filter(p => p.payout_status === 'Pending').reduce((a, p) => a + Number(p.tutor_payout_amount || 0), 0),
      totalPayoutPaid: filtered.filter(p => (p.payout_status === 'Paid' || p.payout_date)).reduce((a, p) => a + Number(p.tutor_payout_amount || 0), 0),
    };
  }, [filtered, assignments]);

  // ── Monthly trend chart data ───────────────────────────────────────────────
  const trendData = useMemo(() => {
    const map: Record<string, { month: string; paid: number; pending: number; overdue: number; total: number }> = {};
    payments.forEach(p => {
      const m = p.month || "Unknown";
      if (!map[m]) map[m] = { month: m.split(" ")[0].slice(0, 3) + " " + (m.split(" ")[1] || ""), paid: 0, pending: 0, overdue: 0, total: 0 };
      const amt = Number(p.amount) || 0;
      const isOvr = p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date)));
      if (p.status === "Paid")  { map[m].paid    += amt; map[m].total += amt; }
      else if (isOvr)           { map[m].overdue  += amt; map[m].total += amt; }
      else                      { map[m].pending  += amt; map[m].total += amt; }
    });
    return Object.values(map).slice(-6); // last 6 months
  }, [payments]);

  // ── Tutor revenue leaderboard ─────────────────────────────────────────────
  const tutorLeaderboard = useMemo(() => {
    const map: Record<string, { tutor_name: string; total_collected: number; paid_count: number; pending_count: number }> = {};
    payments.forEach(p => {
      if (!p.tutor_id) return;
      const k = p.tutor_id;
      if (!map[k]) map[k] = { tutor_name: p.tutor_name || "—", total_collected: 0, paid_count: 0, pending_count: 0 };
      if (p.status === "Paid") { 
        map[k].total_collected += Number(p.tutor_payout_amount || (Number(p.amount) * 0.5)); 
        map[k].paid_count++; 
      }
      else map[k].pending_count++;
    });
    return Object.values(map).sort((a, b) => b.total_collected - a.total_collected).slice(0, 8);
  }, [payments]);

  // ── Subject donut data ────────────────────────────────────────────────────
  const subjectData = useMemo(() => {
    const map: Record<string, number> = {};
    assignments.forEach(a => {
      const key = a.class_level || "General";
      map[key] = (map[key] || 0) + (a.fee || 0) * 0.5;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    return Object.entries(map).map(([label, amount]) => ({
      label,
      amount: Math.round(amount),
      pct: total > 0 ? Math.round((amount / total) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);
  }, [assignments]);

  // ── Paginated payments ────────────────────────────────────────────────────
  const paginatedPay = filtered.slice((payPage - 1) * payPageSize, payPage * payPageSize);
  const payTotalPages = Math.ceil(filtered.length / payPageSize);

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1700px] mx-auto">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-500" /> Revenue Intelligence
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{payments.length} payment records · {assignments.length} active assignments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={fetchAll} className="h-8 text-[12px]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(filtered)} className="h-8 text-[12px]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Payouts
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[12px]">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Payment
          </Button>
        </div>
      </div>

      {/* Analytics helper function moved inside component */}
      {(() => {
          // Export function defined here for access to dependencies if needed, or just keep it simple
          return null;
      })()}

      {/* ── 6 KPI Cards ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-[110px] rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
          <div className="lg:col-span-2">
            <KPICard icon={IndianRupee}  label="This Month Revenue"   value={INR(kpi.monthlyRevenue)} color="bg-emerald-50 border-emerald-200 text-emerald-800"
              trend={{ dir: kpi.growth >= 0 ? "up" : "down", pct: Math.abs(kpi.growth) }} />
          </div>
          <div className="lg:col-span-2">
            <KPICard icon={TrendingUp}   label="Agency MRR"          value={INR(kpi.mrr)}           color="bg-indigo-50 border-indigo-200 text-indigo-800"  sub="Fees × 50%" />
          </div>
          <div className="lg:col-span-2">
            <KPICard icon={Clock}        label="Payouts Due"      value={INR(kpi.totalPayoutDue)}  color="bg-amber-50 border-amber-200 text-amber-800"    sub="Tutor earnings pending" />
          </div>
          <div className="lg:col-span-2">
            <KPICard icon={CheckCircle}  label="Payouts Paid"   value={INR(kpi.totalPayoutPaid)}  color="bg-blue-50 border-blue-200 text-blue-800"       sub="Completed payouts" />
          </div>
        </div>
      )}

      {/* ── Overdue alert strip ───────────────────────────────────────── */}
      {kpi.overdueList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-red-200 flex items-center gap-2 bg-red-100/50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="font-black text-red-800 text-[13px]">⚠️ {kpi.overdueList.length} Overdue Payment{kpi.overdueList.length > 1 ? "s" : ""} — Action Required</h3>
            <span className="ml-auto text-[10px] font-black text-red-700">{INR(kpi.totalOverdue)} total</span>
          </div>
          <div className="divide-y divide-red-100">
            {kpi.overdueList.slice(0, 5).map(p => (
              <div key={p.id} className="px-4 py-2.5 flex items-center gap-3 text-[12px]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="font-bold text-red-900">{p.lead_name || "—"}</span>
                <span className="text-red-600">{p.tutor_name || "—"}</span>
                <span className="text-red-500">{p.month}</span>
                <span className="ml-auto font-black text-red-800">{INR(Number(p.amount))}</span>
                {p.due_date && <span className="text-[10px] text-red-500">Due: {format(new Date(p.due_date), "dd MMM")}</span>}
              </div>
            ))}
            {kpi.overdueList.length > 5 && (
              <div className="px-4 py-2 text-[11px] text-red-600 font-bold">+{kpi.overdueList.length - 5} more overdue…</div>
            )}
          </div>
        </div>
      )}

      {/* ── Charts row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly trend chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-[14px] font-black text-gray-900">Monthly Revenue Trend</h3>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setChartMode("trend")} className={cn("text-[10px] font-bold px-2.5 py-1 rounded border transition-all",
                chartMode === "trend" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>Trend</button>
              <button onClick={() => setChartMode("donut")} className={cn("text-[10px] font-bold px-2.5 py-1 rounded border transition-all",
                chartMode === "donut" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>Split</button>
            </div>
          </div>
          <div className="h-[260px]">
            <RevenueChart
              data={chartMode === "trend" ? trendData : subjectData}
              type={chartMode}
            />
          </div>
        </div>

        {/* Tutor leaderboard */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-[14px] font-black text-gray-900">Top Earning Tutors</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-indigo-400" /></div>
            ) : tutorLeaderboard.length === 0 ? (
              <p className="text-center py-8 text-[12px] text-gray-400">No payment data yet</p>
            ) : (
              tutorLeaderboard.map((t, i) => <TutorRevenueRow key={i} tutor={t} rank={i + 1} />)
            )}
          </div>
        </div>
      </div>

      {/* ── Filter toolbar + Payment ledger ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 font-black text-[14px] text-gray-800">
            <IndianRupee className="w-4 h-4 text-emerald-500" /> Payment Ledger
            <span className="text-[11px] text-gray-400 font-medium">{filtered.length} records</span>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Date range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-[12px] px-3">
                  <Calendar className="w-3 h-3 mr-1.5 opacity-60" />
                  {dateRange?.from
                    ? `${format(dateRange.from, "MMM dd")} – ${dateRange.to ? format(dateRange.to, "MMM dd") : "…"}`
                    : "Date range"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <CalendarUI mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>

            {/* City filter */}
            <Input placeholder="City…" value={filterCity} onChange={e => { setCity(e.target.value); setPayPage(1); }} className="h-8 w-[100px] text-[12px]" />

            {/* Status */}
            <Select value={filterStatus} onValueChange={v => { setStatus(v); setPayPage(1); }}>
              <SelectTrigger className="h-8 w-[110px] text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid ✓</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue ⚠️</SelectItem>
              </SelectContent>
            </Select>

            {/* Subscription type */}
            <Select value={filterSub} onValueChange={v => { setSub(v); setPayPage(1); }}>
              <SelectTrigger className="h-8 w-[120px] text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="One-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-4 px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          <span>Lead / Tutor</span>
          <span>Month</span>
          <span>City</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
        ) : paginatedPay.length === 0 ? (
          <div className="text-center py-16">
            <IndianRupee className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[13px] font-bold text-gray-500">No payments found</p>
            <p className="text-[11px] text-gray-400 mt-1">Try adjusting the filters above.</p>
          </div>
        ) : (
          paginatedPay.map(p => <PaymentRow key={p.id} p={p} onEdit={setEdit} />)
        )}

        {/* Pagination */}
        {payTotalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button variant="ghost" size="sm" disabled={payPage === 1} onClick={() => setPayPage(p => p - 1)} className="h-8 text-[12px]">← Prev</Button>
            <span className="text-[12px] text-gray-400">Page {payPage} of {payTotalPages} · {filtered.length} total</span>
            <Button variant="ghost" size="sm" disabled={payPage === payTotalPages} onClick={() => setPayPage(p => p + 1)} className="h-8 text-[12px]">Next →</Button>
          </div>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <AddPaymentModal
        isOpen={addOpen || !!editPayment}
        onClose={() => { setAddOpen(false); setEdit(null); }}
        onSuccess={() => { setAddOpen(false); setEdit(null); fetchAll(); }}
        editPayment={editPayment}
      />
    </div>
  );
}
