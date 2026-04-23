import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isPast } from "date-fns";
import { IndianRupee, Plus, Edit2, AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddPaymentModal } from "@/components/admin/AddPaymentModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  leadId: string;
  leadName?: string;
}

export const PaymentHistoryPanel = ({ leadId, leadName }: Props) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<any>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("lead_id", leadId)
        .order("payment_month", { ascending: false });
      if (error) {
        if (error.message.includes("does not exist")) { setPayments([]); return; }
        throw error;
      }
      setPayments(data || []);
    } catch (e) {
      console.error("PaymentHistoryPanel:", e);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const markPaid = async (payment: any) => {
    try {
      await supabase.from("payments").update({
        status: "Paid",
        payment_date: new Date().toISOString().slice(0, 10),
      }).eq("id", payment.id);
      toast.success("Marked as Paid ✓");
      fetchPayments();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const totalPaid    = payments.filter(p => p.status === "Paid").reduce((a, p) => a + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status !== "Paid").reduce((a, p) => a + Number(p.amount), 0);

  const statusBadge = (p: any) => {
    const isOverdue = p.status === "Pending" && p.due_date && isPast(new Date(p.due_date));
    if (p.status === "Paid")    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-[10px] font-black shadow-none">✓ Paid</Badge>;
    if (p.status === "Overdue" || isOverdue) return <Badge className="bg-red-100 text-red-700 border-red-200 border text-[10px] font-black shadow-none flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</Badge>;
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-[10px] font-black shadow-none">⏳ Pending</Badge>;
  };

  return (
    <>
      <div className="space-y-3">
        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Paid</p>
            <p className="text-[18px] font-black text-emerald-700">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">Pending</p>
            <p className="text-[18px] font-black text-amber-700">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Add button */}
        <Button
          size="sm"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-[12px]"
          onClick={() => { setEditPayment(null); setAddOpen(true); }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Payment
        </Button>

        {/* Payment list */}
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-emerald-500" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-xl bg-gray-50 text-gray-400">
            <IndianRupee className="w-7 h-7 mx-auto mb-2 text-gray-300" />
            <p className="text-[12px] font-semibold">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map(p => {
              const isOverdue = p.status === "Pending" && p.due_date && isPast(new Date(p.due_date));
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    p.status === "Paid" ? "bg-emerald-50/40 border-emerald-100" :
                    (p.status === "Overdue" || isOverdue) ? "bg-red-50/60 border-red-200" :
                    "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-gray-900 text-[15px]">₹{Number(p.amount).toLocaleString()}</span>
                        {statusBadge(p)}
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{p.month}</p>
                      <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-400 mt-0.5">
                        {p.due_date    && <span className={cn("flex items-center gap-0.5", isOverdue ? "text-red-500 font-bold" : "")}><Clock className="w-2.5 h-2.5" /> Due: {format(new Date(p.due_date), "dd MMM yyyy")}</span>}
                        {p.payment_date && <span className="flex items-center gap-0.5 text-emerald-600"><CheckCircle2 className="w-2.5 h-2.5" /> Paid: {format(new Date(p.payment_date), "dd MMM yyyy")}</span>}
                        {p.tutor_name  && <span>👤 {p.tutor_name}</span>}
                      </div>
                      {p.notes && <p className="text-[10px] text-gray-400 italic mt-1 truncate">"{p.notes}"</p>}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {p.status !== "Paid" && (
                        <button onClick={() => markPaid(p)} className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded transition-colors">
                          ✓ Mark Paid
                        </button>
                      )}
                      <button onClick={() => { setEditPayment(p); setAddOpen(true); }} className="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors flex items-center gap-1">
                        <Edit2 className="w-2.5 h-2.5" /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddPaymentModal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); setEditPayment(null); }}
        onSuccess={fetchPayments}
        leadId={leadId}
        leadName={leadName}
        editPayment={editPayment}
      />
    </>
  );
};
