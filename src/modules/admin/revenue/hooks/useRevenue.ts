"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { revenueService } from "../services/revenueService";
import { format, subMonths, startOfMonth, endOfDay, isPast } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export const useRevenue = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [assignments, setAssign] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(startOfMonth(new Date()), 5),
    to: new Date(),
  });
  const [filterCity, setCity] = useState("");
  const [filterStatus, setStatus] = useState("all");
  const [filterSub, setSub] = useState("all");
  const [payPage, setPayPage] = useState(1);
  const payPageSize = 10;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [payData, assnData] = await Promise.all([
        revenueService.fetchPayments(),
        revenueService.fetchActiveAssignments(),
      ]);
      setPayments(payData || []);
      setAssign(assnData || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    let p = payments;
    if (filterCity.trim()) {
      p = p.filter(x => x.city?.toLowerCase().includes(filterCity.toLowerCase()));
    }
    if (filterStatus !== "all") {
      p = p.filter(x => {
        const isOvr = x.status === "Overdue" || (x.status === "Pending" && x.due_date && isPast(new Date(x.due_date)));
        if (filterStatus === "Overdue") return isOvr;
        return x.status === filterStatus;
      });
    }
    if (filterSub !== "all") {
      p = p.filter(x => x.subscription_type === filterSub);
    }
    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from.getTime();
      const to = endOfDay(dateRange.to).getTime();
      p = p.filter(x => {
        const d = x.payment_month ? new Date(x.payment_month).getTime() : 0;
        return d >= from && d <= to;
      });
    }
    return p;
  }, [payments, filterCity, filterStatus, filterSub, dateRange]);

  const kpi = useMemo(() => {
    const now = new Date();
    const thisMonth = format(now, "MMMM yyyy");
    const lastMonth = format(subMonths(now, 1), "MMMM yyyy");

    const paid = filtered.filter(p => p.status === "Paid");
    const pending = filtered.filter(p => p.status === "Pending");
    const overdue = filtered.filter(p => p.status === "Overdue" || (p.status === "Pending" && p.due_date && isPast(new Date(p.due_date))));

    const thisPaid = paid.filter(p => p.month === thisMonth).reduce((a, p) => a + Number(p.amount), 0);
    const lastPaid = paid.filter(p => p.month === lastMonth).reduce((a, p) => a + Number(p.amount), 0);
    const growth = lastPaid > 0 ? Math.round(((thisPaid - lastPaid) / lastPaid) * 100) : 0;

    const mrr = assignments.filter(a => a.status === "Active").reduce((a, r) => a + (r.fee || 0) * 0.5, 0);

    return {
      monthlyRevenue: thisPaid,
      totalPaid: paid.reduce((a, p) => a + Number(p.amount), 0),
      totalPending: pending.reduce((a, p) => a + Number(p.amount), 0),
      totalOverdue: overdue.reduce((a, p) => a + Number(p.amount), 0),
      overdueList: overdue,
      mrr,
      growth,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      totalPayoutDue: filtered.filter(p => p.payout_status === 'Pending').reduce((a, p) => a + Number(p.tutor_payout_amount || 0), 0),
      totalPayoutPaid: filtered.filter(p => (p.payout_status === 'Paid' || p.payout_date)).reduce((a, p) => a + Number(p.tutor_payout_amount || 0), 0),
    };
  }, [filtered, assignments]);

  return {
    payments,
    assignments,
    loading,
    filtered,
    kpi,
    dateRange,
    setDateRange,
    filterCity,
    setCity,
    filterStatus,
    setStatus,
    filterSub,
    setSub,
    payPage,
    setPayPage,
    payPageSize,
    fetchAll
  };
};

