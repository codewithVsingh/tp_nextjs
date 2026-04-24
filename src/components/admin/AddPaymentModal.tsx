import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addMonths, startOfMonth } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadId?: string;
  leadName?: string;
  tutorId?: string;
  tutorName?: string;
  assignmentId?: string;
  defaultAmount?: number;
  editPayment?: any; // pre-fill for editing
}

// Build last 12 months list
const buildMonthOptions = () => {
  const months: { label: string; value: string; date: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = addMonths(startOfMonth(new Date()), -i);
    months.push({
      label: format(d, "MMMM yyyy"),
      value: format(d, "MMMM yyyy"),
      date: format(d, "yyyy-MM-dd"),
    });
  }
  return months;
};

const MONTHS = buildMonthOptions();

export const AddPaymentModal = ({
  isOpen, onClose, onSuccess,
  leadId, leadName, tutorId, tutorName, assignmentId,
  defaultAmount, editPayment,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(MONTHS[0].value);
  const [status, setStatus] = useState<"Paid" | "Pending" | "Overdue">("Pending");
  const [paymentDate, setPaymentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [commissionPct, setCommissionPct] = useState("50");
  const [payoutStatus, setPayoutStatus] = useState<"Pending" | "Paid">("Pending");
  const [payoutDate, setPayoutDate] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<"Monthly" | "One-time">("Monthly");
  const [city, setCity] = useState("");

  // Lead / tutor search (when opened from dashboard without pre-fill)
  const [searchLeads, setSearchLeads] = useState<any[]>([]);
  const [searchTutors, setSearchTutors] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editPayment) {
        setAmount(String(editPayment.amount ?? ""));
        setMonth(editPayment.month ?? MONTHS[0].value);
        setStatus(editPayment.status ?? "Pending");
        setPaymentDate(editPayment.payment_date ?? "");
        setDueDate(editPayment.due_date ?? "");
        setNotes(editPayment.notes ?? "");
        setCommissionPct(String(editPayment.commission_pct ?? "50"));
        setPayoutStatus(editPayment.payout_status ?? "Pending");
        setPayoutDate(editPayment.payout_date ?? "");
        setSubscriptionType(editPayment.subscription_type ?? "Monthly");
        setCity(editPayment.city ?? "");
        setSelectedLead(editPayment.lead_id ? { id: editPayment.lead_id, name: editPayment.lead_name } : null);
        setSelectedTutor(editPayment.tutor_id ? { id: editPayment.tutor_id, name: editPayment.tutor_name } : null);
      } else {
        setAmount(defaultAmount ? String(defaultAmount) : "");
        setMonth(MONTHS[0].value);
        setStatus("Pending");
        setPaymentDate("");
        setDueDate("");
        setNotes("");
        setCommissionPct("50");
        setPayoutStatus("Pending");
        setPayoutDate("");
        setSubscriptionType("Monthly");
        setCity("");
        setSelectedLead(leadId ? { id: leadId, name: leadName } : null);
        setSelectedTutor(tutorId ? { id: tutorId, name: tutorName } : null);
      }
    }
  }, [isOpen, editPayment, leadId, tutorId]);

  const searchLeadsFn = async (q: string) => {
    if (!q.trim()) return setSearchLeads([]);
    const { data } = await supabase.from("leads").select("id, name, phone").ilike("name", `%${q}%`).limit(6);
    setSearchLeads(data || []);
  };

  const searchTutorsFn = async (q: string) => {
    if (!q.trim()) return setSearchTutors([]);
    const { data } = await supabase.from("tutor_registrations").select("id, name, phone").ilike("name", `%${q}%`).limit(6);
    setSearchTutors(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount");
    const finalLeadId = leadId || selectedLead?.id;
    const finalTutorId = tutorId || selectedTutor?.id;
    if (!finalLeadId) return toast.error("Select a lead");

    setLoading(true);
    try {
      const monthDate = MONTHS.find(m => m.value === month)?.date ?? null;

      const payload = {
        lead_id: finalLeadId,
        lead_name: leadName || selectedLead?.name || "",
        tutor_id: finalTutorId ?? null,
        tutor_name: (tutorName || selectedTutor?.name) ?? null,
        assignment_id: assignmentId ?? null,
        amount: parseFloat(amount),
        month,
        payment_month: monthDate,
        status,
        payment_date: paymentDate || null,
        due_date: dueDate || null,
        notes: notes || null,
        commission_pct: parseFloat(commissionPct),
        commission_amount: parseFloat(amount) * (parseFloat(commissionPct) / 100),
        tutor_payout_amount: parseFloat(amount) - (parseFloat(amount) * (parseFloat(commissionPct) / 100)),
        payout_status: payoutStatus,
        payout_date: payoutDate || null,
        subscription_type: subscriptionType,
        city: city || (selectedLead?.city ?? null),
      };

      if (editPayment?.id) {
        const { error } = await supabase.from("payments").update(payload).eq("id", editPayment.id);
        if (error) throw error;
        toast.success("Payment updated ✓");
      } else {
        const { error } = await supabase.from("payments").insert([payload]);
        if (error) throw error;
        toast.success("Payment recorded ✓");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            {editPayment ? "Edit Payment" : "Record Payment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">

          {/* Lead (searchable if not pre-filled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lead *</label>
            {leadId ? (
              <div className="h-9 px-3 bg-gray-50 border rounded-md flex items-center text-sm font-medium">{leadName}</div>
            ) : (
              <div className="relative">
                <Input
                  placeholder="Search lead name..."
                  value={selectedLead ? selectedLead.name : leadSearch}
                  onChange={e => { setLeadSearch(e.target.value); searchLeadsFn(e.target.value); setSelectedLead(null); }}
                  className="h-9"
                />
                {searchLeads.length > 0 && !selectedLead && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
                    {searchLeads.map(l => (
                      <button key={l.id} type="button" onClick={() => { setSelectedLead(l); setSearchLeads([]); setLeadSearch(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0">
                        <span className="font-semibold">{l.name}</span>
                        <span className="text-gray-400 ml-2 text-xs">{l.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tutor (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tutor (optional)</label>
            {tutorId ? (
              <div className="h-9 px-3 bg-gray-50 border rounded-md flex items-center text-sm font-medium">{tutorName}</div>
            ) : (
              <div className="relative">
                <Input
                  placeholder="Search tutor name..."
                  value={selectedTutor ? selectedTutor.name : tutorSearch}
                  onChange={e => { setTutorSearch(e.target.value); searchTutorsFn(e.target.value); setSelectedTutor(null); }}
                  className="h-9"
                />
                {searchTutors.length > 0 && !selectedTutor && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
                    {searchTutors.map(t => (
                      <button key={t.id} type="button" onClick={() => { setSelectedTutor(t); setSearchTutors([]); setTutorSearch(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-gray-400 ml-2 text-xs">{t.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount + Month */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount (₹) *</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type="number" min="0" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} className="h-9 pl-8" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Billing Month *</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</label>
            <div className="flex gap-2">
              {(["Pending", "Paid", "Overdue"] as const).map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg border text-[12px] font-bold transition-all ${
                    status === s
                      ? s === "Paid" ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : s === "Overdue" ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-amber-100 text-amber-700 border-amber-300"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}>
                  {s === "Paid" ? "✓ Paid" : s === "Overdue" ? "⚠ Overdue" : "⏳ Pending"}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Type + City */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plan Type</label>
              <Select value={subscriptionType} onValueChange={(v: any) => setSubscriptionType(v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
              <Input placeholder="City..." value={city} onChange={e => setCity(e.target.value)} className="h-9" />
            </div>
          </div>

          {/* Commission Logic */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tutor Payout & Commission</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commission (%)</label>
                <Input type="number" value={commissionPct} onChange={e => setCommissionPct(e.target.value)} className="h-9 bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tutor Earning</label>
                <div className="h-9 px-3 bg-white border rounded-md flex items-center text-sm font-black text-emerald-600">
                  ₹{(parseFloat(amount || "0") * (1 - parseFloat(commissionPct || "0") / 100)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payout Status</label>
                <Select value={payoutStatus} onValueChange={(v: any) => setPayoutStatus(v)}>
                  <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">⏳ Pending</SelectItem>
                    <SelectItem value="Paid">✓ Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payout Date</label>
                <Input type="date" value={payoutDate} onChange={e => setPayoutDate(e.target.value)} className="h-9 bg-white" />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {status === "Paid" ? "Paid On" : "Payment Date"}
              </label>
              <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="h-9" />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes (optional)</label>
            <Textarea placeholder="e.g. UPI collected, receipt number, partial payment..." value={notes} onChange={e => setNotes(e.target.value)} className="resize-none min-h-[60px]" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <IndianRupee className="w-4 h-4 mr-2" />}
              {editPayment ? "Update" : "Save Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

