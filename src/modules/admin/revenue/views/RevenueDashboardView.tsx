"use client";

import { useState, useMemo } from "react";
import { format, parseISO, isPast } from "date-fns";
import {
  IndianRupee, TrendingUp, Calendar, AlertTriangle,
  Plus, RefreshCw, Loader2, Trophy, BarChart3, Clock,
  Download, CheckCircle,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { AddPaymentModal } from "@/components/admin/AddPaymentModal";
import { useRevenue } from "../hooks/useRevenue";
import { TPKPICard } from "@/design-system/components/TPKPICard";

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function RevenueDashboardView() {
  const {
    payments, assignments, loading, filtered, kpi,
    dateRange, setDateRange, filterCity, setCity,
    filterStatus, setStatus, filterSub, setSub,
    payPage, setPayPage, payPageSize, fetchAll
  } = useRevenue();

  const [addOpen, setAddOpen] = useState(false);
  const [editPayment, setEdit] = useState<any>(null);
  const [chartMode, setChartMode] = useState<"trend"|"donut">("trend");

  const trendData = useMemo(() => {
    const map: Record<string, { month: string; paid: number; pending: number; overdue: number; total: number; _sort: number }> = {};
    payments.forEach(p => {
      const m = p.month || "Unknown";
      if (!map[m]) {
        const parts = m.split(" ");
        const monthIdx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(parts[0]);
        const year = parseInt(parts[1] || "0");
        map[m] = { 
          month: parts[0].slice(0, 3) + " " + (parts[1] || ""), 
          paid: 0, pending: 0, overdue: 0, total: 0,
          _sort: year * 100 + monthIdx
        };
      }
      const amt = Number(p.amount) || 0;
      const isOvr = p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date)));
      if (p.status === "Paid") { map[m].paid += amt; map[m].total += amt; }
      else if (isOvr) { map[m].overdue += amt; map[m].total += amt; }
      else { map[m].pending += amt; map[m].total += amt; }
    });
    return Object.values(map)
      .sort((a, b) => a._sort - b._sort)
      .slice(-6);
  }, [payments]);

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

  const paginatedPay = filtered.slice((payPage - 1) * payPageSize, payPage * payPageSize);
  const payTotalPages = Math.ceil(filtered.length / payPageSize);

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-500" /> Revenue Intelligence
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{payments.length} records · {assignments.length} assignments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={fetchAll} className="h-8 text-[12px]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[12px]">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Payment
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
        <div className="lg:col-span-2">
          <TPKPICard icon={IndianRupee} label="This Month" value={INR(kpi.monthlyRevenue)} color="bg-emerald-50 border-emerald-200 text-emerald-800" trend={{ dir: kpi.growth >= 0 ? "up" : "down", pct: Math.abs(kpi.growth) }} />
        </div>
        <div className="lg:col-span-2">
          <TPKPICard icon={TrendingUp} label="Agency MRR" value={INR(kpi.mrr)} color="bg-indigo-50 border-indigo-200 text-indigo-800" sub="Fees × 50%" />
        </div>
        <div className="lg:col-span-2">
          <TPKPICard icon={Clock} label="Payouts Due" value={INR(kpi.totalPayoutDue)} color="bg-amber-50 border-amber-200 text-amber-800" sub="Tutor earnings pending" />
        </div>
        <div className="lg:col-span-2">
          <TPKPICard icon={CheckCircle} label="Payouts Paid" value={INR(kpi.totalPayoutPaid)} color="bg-blue-50 border-blue-200 text-blue-800" sub="Completed payouts" />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[14px] font-black text-gray-900">Revenue Analysis</h3>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setChartMode("trend")} className={cn("text-[10px] font-bold px-2.5 py-1 rounded border transition-all", chartMode === "trend" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>Trend</button>
            <button onClick={() => setChartMode("donut")} className={cn("text-[10px] font-bold px-2.5 py-1 rounded border transition-all", chartMode === "donut" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>Split</button>
          </div>
        </div>
        <div className="h-[260px]">
          <RevenueChart data={chartMode === "trend" ? trendData : subjectData} type={chartMode} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <div className="font-black text-[14px] text-gray-800">Payment Ledger</div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-[12px] px-3">
                  <Calendar className="w-3 h-3 mr-1.5 opacity-60" />
                  {dateRange?.from ? `${format(dateRange.from, "MMM dd")} – ${dateRange.to ? format(dateRange.to, "MMM dd") : "…"}` : "Date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50"><CalendarUI mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent>
            </Popover>
            <Input placeholder="City…" value={filterCity} onChange={e => { setCity(e.target.value); setPayPage(1); }} className="h-8 w-[100px] text-[12px]" />
            <Select value={filterStatus} onValueChange={v => { setStatus(v); setPayPage(1); }}>
              <SelectTrigger className="h-8 w-[110px] text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid ✓</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue ⚠️</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
          ) : paginatedPay.map(p => {
            const isOvr = p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date)));
            const statusStyle = p.status === "Paid" 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : isOvr 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200";
            
            const payoutStyle = p.payout_status === "Paid"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-slate-50 text-slate-500 border-slate-200";

            return (
              <div key={p.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-all border-b border-gray-50 last:border-0">
                {/* Visual indicator */}
                <div className={cn("w-1.5 h-10 rounded-full", p.status === "Paid" ? "bg-emerald-500" : isOvr ? "bg-red-500" : "bg-amber-500")} />
                
                <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-5 gap-6 items-center">
                  <div className="col-span-1">
                    <p className="text-[13px] font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{p.lead_name || "Anonymous Lead"}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5 truncate">Tutor: {p.tutor_name || "Unassigned"}</p>
                  </div>
                  
                  <div className="hidden lg:block">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">
                      <Calendar className="w-3 h-3" /> Billing Period
                    </div>
                    <p className="text-[12px] text-slate-600 font-bold">{p.month || "—"}</p>
                  </div>

                  <div className="hidden lg:block text-center">
                    <div className="flex justify-center items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">
                      <TrendingUp className="w-3 h-3" /> Student Pay
                    </div>
                    <Badge variant="outline" className={cn("text-[9px] h-5 font-black uppercase border", statusStyle)}>
                      {isOvr ? "Overdue" : p.status}
                    </Badge>
                  </div>

                  <div className="hidden lg:block text-center">
                    <div className="flex justify-center items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">
                      <Clock className="w-3 h-3" /> Tutor Payout
                    </div>
                    <Badge variant="outline" className={cn("text-[9px] h-5 font-black uppercase border", payoutStyle)}>
                      {p.payout_status || "Pending"}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="text-[15px] font-black text-slate-900 leading-none">{INR(Number(p.amount) || 0)}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Gross Revenue</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {payTotalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-gray-100">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {((payPage - 1) * payPageSize) + 1}-{Math.min(payPage * payPageSize, filtered.length)} <span className="mx-1">/</span> {filtered.length} Records
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={payPage === 1} 
                onClick={() => setPayPage(p => p - 1)} 
                className="h-10 px-4 text-[12px] font-black uppercase tracking-widest hover:bg-slate-50"
              >
                Prev
              </Button>

              <Select 
                value={payPage.toString()} 
                onValueChange={(val) => setPayPage(parseInt(val))}
              >
                <SelectTrigger className="h-10 w-[110px] text-[12px] font-black bg-slate-50 border-slate-200 rounded-xl uppercase tracking-widest">
                  <SelectValue placeholder={`Page ${payPage}`} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {Array.from({ length: payTotalPages }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()} className="text-[12px] font-bold">
                      Page {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="sm" 
                disabled={payPage === payTotalPages} 
                onClick={() => setPayPage(p => p + 1)} 
                className="h-10 px-4 text-[12px] font-black uppercase tracking-widest hover:bg-slate-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddPaymentModal
        isOpen={addOpen || !!editPayment}
        onClose={() => { setAddOpen(false); setEdit(null); }}
        onSuccess={() => { setAddOpen(false); setEdit(null); fetchAll(); }}
        editPayment={editPayment}
      />
    </div>
  );
}
