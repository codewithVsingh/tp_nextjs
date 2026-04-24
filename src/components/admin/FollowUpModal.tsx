import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Phone, MessageSquare, FileText, CheckCircle2, RotateCcw } from "lucide-react";
import { format, addHours } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  activeTab: string;
  currentStatus: string;
  onSuccess: () => void;
}

import { FUNNEL_STATUS_OPTIONS } from "@/domains/lead-management/constants/funnelStages";
import { runStatusChangeAutomations } from "@/modules/shared/logic/automationEngine";

type ActivityType = "Call Made" | "Message Sent" | "Note Added";

const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "Call Made",     label: "Call Made",     icon: <Phone className="w-3.5 h-3.5" />,        color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"   },
  { value: "Message Sent",  label: "Message Sent",  icon: <MessageSquare className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" },
  { value: "Note Added",    label: "Note Added",    icon: <FileText className="w-3.5 h-3.5" />,      color: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"    },
];

export const FollowUpModal = ({ isOpen, onClose, recordId, activeTab, currentStatus, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus || "Pending");
  const [remark, setRemark] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextDate, setNextDate] = useState<Date | undefined>(undefined);
  const [activityType, setActivityType] = useState<ActivityType>("Note Added");
  const [followUpStatus, setFollowUpStatus] = useState<"Pending" | "Done">("Pending");
  const [dropReason, setDropReason] = useState("");

  const DROP_REASONS = [
    "High Budget", "Distance/Location", "Hired Competitor",
    "No Response", "Invalid Inquiry", "Delayed Starting", "Changed Mind"
  ];

  const statusOptions = FUNNEL_STATUS_OPTIONS;

  const quickReschedule = (hours: number) => {
    setNextDate(addHours(new Date(), hours));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remark.trim()) return toast.error("Remark is required");
    setLoading(true);

    try {
      const dbStatusKey = activeTab === "tutor_registrations" ? "current_status" : "status";

      const payload: any = {
        [dbStatusKey]: status,
        last_contacted_at: new Date().toISOString(),
        remarks: remark,
        follow_up_status: followUpStatus,
      };

      if (activeTab === "leads") {
        if (status === "Converted" && currentStatus !== "Converted") {
          payload.converted_at = new Date().toISOString();
        }
        if (status === "Dropped") {
          payload.dropped_at = new Date().toISOString();
          payload.drop_reason = dropReason || "Unspecified";
        }
      }

      if (nextAction.trim()) payload.next_action = nextAction.trim();
      if (nextDate) payload.next_follow_up = nextDate.toISOString();
      // Auto-set 24h follow-up if marking Done without scheduling
      if (followUpStatus === "Done" && !nextDate) {
        payload.next_follow_up = addHours(new Date(), 48).toISOString();
        payload.follow_up_status = "Pending"; // reset for next cycle
      }

      const { error: updateError } = await supabase.from(activeTab).update(payload).eq("id", recordId);
      if (updateError) {
        if (updateError.message.includes('column "last_contacted_at" does not exist')) {
          toast.error("Run supabase-followup-init.sql + supabase-followup-upgrade.sql first!");
          setLoading(false);
          return;
        }
        throw updateError;
      }

      // Log activity
      const { error: logError } = await supabase.from("follow_up_logs").insert({
        record_id: recordId,
        table_name: activeTab,
        note: remark,
        status,
        activity_type: activityType,
        next_follow_up: nextDate ? nextDate.toISOString() : null,
      });
      if (logError) console.warn("Log insert:", logError.message);

      toast.success("Follow-up logged successfully ✓");

      // Fire automation rules based on new status (for leads only)
      if (activeTab === "leads") {
        runStatusChangeAutomations(recordId, status).catch(console.error);
      }
      setStatus("Pending"); setRemark(""); setNextAction(""); setNextDate(undefined);
      setActivityType("Note Added"); setFollowUpStatus("Pending");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Log CRM Follow-up
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">

          {/* Activity Type Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Type</label>
            <div className="flex gap-2">
              {ACTIVITY_TYPES.map(at => (
                <button
                  key={at.value}
                  type="button"
                  onClick={() => setActivityType(at.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[12px] font-bold transition-all",
                    activityType === at.value
                      ? at.color + " shadow-sm ring-2 ring-offset-1 ring-current/20"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {at.icon}
                  {at.label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Status */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFollowUpStatus("Pending")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[12px] font-bold transition-all",
                followUpStatus === "Pending"
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reschedule
            </button>
            <button
              type="button"
              onClick={() => setFollowUpStatus("Done")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[12px] font-bold transition-all",
                followUpStatus === "Done"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
            </button>
          </div>

          {/* Status Update */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Drop Reason (Only if status is Dropped) */}
          {status === "Dropped" && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
              <label className="text-xs font-bold text-red-600 uppercase tracking-wider">Drop Reason *</label>
              <Select value={dropReason} onValueChange={setDropReason}>
                <SelectTrigger className="h-9 border-red-200 bg-red-50 text-red-700">
                  <SelectValue placeholder="Select why they dropped..." />
                </SelectTrigger>
                <SelectContent>
                  {DROP_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  <SelectItem value="Other">Other (mention in remarks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Remark */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks *</label>
            <Textarea
              placeholder="What was discussed? Any commitment made?"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          {/* Next Action */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next Action (Optional)</label>
            <Input
              placeholder="e.g. Send brochure, Call back to confirm..."
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Schedule Next Follow-up */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next Follow-Up Date</label>
            {/* Quick schedule buttons */}
            <div className="flex gap-2 mb-2">
              {[
                { label: "+2h",    hours: 2   },
                { label: "+24h",   hours: 24  },
                { label: "+3 days",hours: 72  },
                { label: "+1 week",hours: 168 },
              ].map(q => (
                <button
                  key={q.hours}
                  type="button"
                  onClick={() => quickReschedule(q.hours)}
                  className="flex-1 text-[11px] font-bold py-1.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !nextDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextDate ? format(nextDate, "PPP") : "Or pick a custom date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar mode="single" selected={nextDate} onSelect={setNextDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 px-6">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Follow-up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

