import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format, parseISO } from "date-fns";
import { FileText, User, GraduationCap, MapPin, IndianRupee, Clock, ShieldCheck, Plus, CheckCircle2, RotateCcw, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AssignmentDetailDrawer = ({ isOpen, onClose, assignment }: any) => {
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPay, setLoadingPay] = useState(false);
  
  // Payment Form State
  const [showPayForm, setShowPayForm] = useState(false);
  const [editingPayId, setEditingPayId] = useState<string | null>(null);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen && assignment) {
      fetchDetails();
    } else {
      setShowPayForm(false);
      setEditingPayId(null);
    }
  }, [isOpen, assignment]);

  const fetchDetails = async () => {
    // Fetch Tutor Details securely bypassing generic scopes
    const { data: tp } = await supabase.from('tutor_registrations').select('*').eq('id', assignment.tutor_id).single();
    if (tp) setTutorProfile(tp);

    // Fetch Payments
    const { data: pay } = await supabase.from('payment_logs').select('*').eq('assignment_id', assignment.id).order('created_at', { ascending: false });
    if (pay) setPayments(pay);
  };

  const startPaymentEdit = (p: any) => {
    setShowPayForm(true);
    setEditingPayId(p.id);
    setMonth(p.month);
    setAmount(p.amount);
    setNote(p.note || '');
  };

  const closePayForm = () => {
    setShowPayForm(false);
    setEditingPayId(null);
    setMonth("");
    setAmount("");
    setNote("");
  };

  const savePayment = async () => {
    if (!month || !amount) {
      toast.error("Month and Amount are required.");
      return;
    }
    setLoadingPay(true);
    try {
      if (editingPayId) {
        await supabase.from('payment_logs').update({ month, amount, note }).eq('id', editingPayId);
        toast.success("Payment entry updated!");
      } else {
        await supabase.from('payment_logs').insert({
          assignment_id: assignment.id,
          month,
          amount,
          note
        });
        toast.success("New payment recorded!");
      }
      closePayForm();
      fetchDetails();
    } catch (e: any) {
      toast.error("Payment sync failed: " + e.message);
    } finally {
      setLoadingPay(false);
    }
  };

  if (!assignment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-gray-50/50 p-0 border-l border-gray-200">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-start justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-gray-900 leading-none">Active Contract</SheetTitle>
              <div className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully Assigned
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* 1. TUTOR BLOCK */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 font-bold text-blue-800 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Provider Information (Tutor)
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
               <div className="sm:col-span-2">
                 <p className="text-gray-500 font-semibold mb-0.5">Tutor Identity</p>
                 <p className="text-gray-900 font-bold text-base">{assignment.tutor_name}</p>
                 <p className="text-xs text-gray-500">{assignment.tutor_phone}</p>
               </div>
               <div className="sm:col-span-2">
                 <p className="text-gray-500 font-semibold mb-0.5">Subjects Specialization</p>
                 <p className="text-gray-900 font-medium">
                   {tutorProfile ? (Array.isArray(tutorProfile.subjects) ? tutorProfile.subjects.join(', ') : tutorProfile.subjects) : <Loader2 className="w-3 h-3 animate-spin"/>}
                 </p>
               </div>
               <div>
                 <p className="text-gray-500 font-semibold mb-0.5">Teaching Experience</p>
                 <p className="text-gray-900 font-medium">{tutorProfile?.experience || 'Unknown'}</p>
               </div>
            </div>
          </div>

          {/* 2. STUDENT BLOCK */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 font-bold text-indigo-800 flex items-center gap-2">
              <User className="w-4 h-4" /> Client Information (Student)
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
               <div className="sm:col-span-2">
                 <p className="text-gray-500 font-semibold mb-0.5">Student Contact</p>
                 <p className="text-gray-900 font-bold text-base">{assignment.lead_name}</p>
                 <p className="text-xs text-gray-500">{assignment.lead_phone}</p>
               </div>
               <div>
                 <p className="text-gray-500 font-semibold mb-0.5">Assigned Class / Scope</p>
                 <p className="text-gray-900 font-medium">{assignment.class_level || 'General Scope'}</p>
               </div>
               <div>
                 <p className="text-gray-500 font-semibold mb-0.5">Delivery Location</p>
                 <p className="text-gray-900 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {assignment.location || 'Remote/Unknown'}</p>
               </div>
            </div>
          </div>

          {/* 3. ASSIGNMENT METADATA */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b font-bold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" /> Administrative Metrics
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
               <div>
                 <p className="text-gray-500 font-semibold mb-0.5">Start Date</p>
                 <p className="text-gray-900 font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {assignment.start_date ? format(parseISO(assignment.start_date), "PP") : 'Unknown'}</p>
               </div>
               <div>
                 <p className="text-gray-500 font-semibold mb-0.5">Agreed Base Fee</p>
                 <p className="text-emerald-700 font-bold flex items-center">₹ {assignment.fee || 'Open Bound'}</p>
               </div>
               <div className="col-span-2">
                 <p className="text-gray-500 font-semibold mb-0.5">Active Contract Status</p>
                 <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">{assignment.status || 'Active'}</Badge>
               </div>
               {assignment.notes && (
                 <div className="col-span-2 mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 border">
                    <span className="font-bold block mb-1">Contract Notes:</span>
                    {assignment.notes}
                 </div>
               )}
            </div>
          </div>

          {/* 4. PAYMENT TRACKING ENGINE */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b font-bold text-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-amber-500" /> Payment Tracking Registry</div>
              {!showPayForm && (
                <Button size="sm" onClick={() => setShowPayForm(true)} className="h-7 text-[11px] bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
                  <Plus className="w-3 h-3 mr-1" /> Add Payment
                </Button>
              )}
            </div>
            
            <div className="p-4">
              {showPayForm && (
                <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-lg mb-4 space-y-4">
                   <h4 className="font-bold text-amber-900 text-sm border-b border-amber-200 pb-2">
                     {editingPayId ? 'Edit Payment Log' : 'Sync New Payment Record'}
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-semibold text-gray-600 block mb-1">Target Month</label>
                       <Select value={month} onValueChange={setMonth}>
                         <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                         <SelectContent>
                           {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                             <SelectItem key={m} value={m}>{m}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div>
                       <label className="text-xs font-semibold text-gray-600 block mb-1">Disbursed Amount (₹)</label>
                       <Input type="number" placeholder="Amt" value={amount} onChange={e => setAmount(e.target.value)} className="h-9 bg-white" />
                     </div>
                   </div>
                   <div>
                       <label className="text-xs font-semibold text-gray-600 block mb-1">Internal Log Notes</label>
                       <Input placeholder="e.g. Paid in full via UPI" value={note} onChange={e => setNote(e.target.value)} className="h-9 bg-white" />
                   </div>
                   <div className="flex justify-end gap-2 pt-2">
                     <Button variant="ghost" size="sm" onClick={closePayForm}>Cancel</Button>
                     <Button variant="default" size="sm" onClick={savePayment} disabled={loadingPay} className="bg-amber-600 hover:bg-amber-700 font-bold">
                       {loadingPay ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : null} Save Log
                     </Button>
                   </div>
                </div>
              )}

              {payments.length === 0 && !showPayForm ? (
                <div className="text-center py-6 text-gray-400 text-sm">No payment history logged yet.</div>
              ) : (
                <div className="space-y-3">
                  {payments.map(pay => (
                     <div key={pay.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-gray-50 group hover:border-amber-200 transition-colors">
                       <div>
                         <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                           {pay.month} <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-none font-bold">₹ {pay.amount}</Badge>
                         </p>
                         <p className="text-[11px] text-gray-500 mt-1">{pay.note || 'No notes provided.'} • {format(parseISO(pay.created_at), 'dd MMM, p')}</p>
                       </div>
                       <Button variant="ghost" size="sm" onClick={() => startPaymentEdit(pay)} className="text-gray-400 hover:text-amber-600 h-8 mt-2 sm:mt-0">
                         <Edit className="w-3.5 h-3.5" /> Edit
                       </Button>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </SheetContent>
    </Sheet>
  );
};
