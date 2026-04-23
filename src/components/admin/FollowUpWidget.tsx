import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isToday, isPast, addHours } from "date-fns";
import { AlertTriangle, Clock, CheckCircle2, Calendar, RotateCcw, PhoneCall, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowUpLead {
  id: string;
  name: string | null;
  phone: string;
  city: string | null;
  next_follow_up: string | null;
  follow_up_status: string | null;
  next_action: string | null;
  status: string | null;
}

interface Props {
  onSelectLead?: (lead: any) => void;
  onRefresh?: () => void;
}

export const FollowUpWidget = ({ onSelectLead, onRefresh }: Props) => {
  const [todayLeads, setTodayLeads] = useState<FollowUpLead[]>([]);
  const [overdueLeads, setOverdueLeads] = useState<FollowUpLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"today" | "overdue">("overdue");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

      const [todayRes, overdueRes] = await Promise.all([
        supabase
          .from("leads")
          .select("id, name, phone, city, next_follow_up, follow_up_status, next_action, status")
          .gte("next_follow_up", todayStart.toISOString())
          .lte("next_follow_up", todayEnd.toISOString())
          .neq("follow_up_status", "Done")
          .order("next_follow_up", { ascending: true })
          .limit(10),
        supabase
          .from("leads")
          .select("id, name, phone, city, next_follow_up, follow_up_status, next_action, status")
          .lt("next_follow_up", todayStart.toISOString())
          .neq("follow_up_status", "Done")
          .order("next_follow_up", { ascending: true })
          .limit(10),
      ]);

      setTodayLeads(todayRes.data || []);
      setOverdueLeads(overdueRes.data || []);

      // Auto-mark overdue as Missed
      const overdueIds = (overdueRes.data || [])
        .filter(l => l.follow_up_status === "Pending")
        .map(l => l.id);
      if (overdueIds.length > 0) {
        await supabase.from("leads").update({ follow_up_status: "Missed" }).in("id", overdueIds);
      }
    } catch (e) {
      console.error("FollowUpWidget:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const markDone = async (lead: FollowUpLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(lead.id + "_done");
    try {
      await supabase.from("leads").update({
        follow_up_status: "Done",
        last_contacted_at: new Date().toISOString(),
      }).eq("id", lead.id);

      await supabase.from("follow_up_logs").insert({
        record_id: lead.id,
        table_name: "leads",
        note: "Follow-up marked as Done",
        status: lead.status || "Contacted",
        activity_type: "Note Added",
      });

      toast.success(`${lead.name || "Lead"} marked as Done ✓`);
      fetchFollowUps();
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const reschedule = async (lead: FollowUpLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(lead.id + "_reschedule");
    try {
      const newDate = addHours(new Date(), 24);
      await supabase.from("leads").update({
        next_follow_up: newDate.toISOString(),
        follow_up_status: "Pending",
      }).eq("id", lead.id);

      await supabase.from("follow_up_logs").insert({
        record_id: lead.id,
        table_name: "leads",
        note: `Follow-up rescheduled to ${format(newDate, "dd MMM, hh:mm a")}`,
        status: lead.status || "Pending",
        activity_type: "Note Added",
        next_follow_up: newDate.toISOString(),
      });

      toast.success(`Rescheduled to ${format(newDate, "dd MMM, hh:mm a")}`);
      fetchFollowUps();
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const displayList = activeView === "today" ? todayLeads : overdueLeads;
  const isEmpty = displayList.length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-stretch border-b border-gray-100">
        <button
          onClick={() => setActiveView("overdue")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-bold transition-colors",
            activeView === "overdue"
              ? "bg-red-50 text-red-700 border-b-2 border-red-500"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
          {overdueLeads.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {overdueLeads.length}
            </span>
          )}
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => setActiveView("today")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-bold transition-colors",
            activeView === "today"
              ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          Today
          {todayLeads.length > 0 && (
            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {todayLeads.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 max-h-[340px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-[12px] font-semibold">
              {activeView === "today" ? "No follow-ups due today!" : "No overdue follow-ups!"}
            </p>
          </div>
        ) : (
          displayList.map(lead => (
            <div
              key={lead.id}
              onClick={() => onSelectLead?.(lead)}
              className={cn(
                "group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                "hover:shadow-sm hover:border-gray-300",
                activeView === "overdue"
                  ? "bg-red-50/40 border-red-100 hover:bg-red-50"
                  : "bg-amber-50/40 border-amber-100 hover:bg-amber-50"
              )}
            >
              {/* Status dot */}
              <div className={cn(
                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                lead.follow_up_status === "Missed" ? "bg-red-500" :
                lead.follow_up_status === "Done" ? "bg-emerald-500" : "bg-amber-500"
              )} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{lead.name || "Unknown"}</p>
                  {lead.follow_up_status === "Missed" && (
                    <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {lead.city || "—"} ·{" "}
                  <span className={cn(
                    "font-semibold",
                    activeView === "overdue" ? "text-red-600" : "text-amber-600"
                  )}>
                    {lead.next_follow_up
                      ? format(parseISO(lead.next_follow_up), "dd MMM, hh:mm a")
                      : "—"}
                  </span>
                </p>
                {lead.next_action && (
                  <p className="text-[10px] text-indigo-600 font-medium mt-0.5 truncate">
                    → {lead.next_action}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={e => e.stopPropagation()}>
                <button
                  onClick={e => markDone(lead, e)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded transition-colors"
                >
                  {actionLoading === lead.id + "_done"
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <CheckCircle2 className="w-3 h-3" />}
                  Done
                </button>
                <button
                  onClick={e => reschedule(lead, e)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2 py-1 rounded transition-colors"
                >
                  {actionLoading === lead.id + "_reschedule"
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <RotateCcw className="w-3 h-3" />}
                  +24h
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {!loading && !isEmpty && (
        <div className="border-t border-gray-100 px-3 py-2 flex justify-between items-center bg-gray-50/50">
          <span className="text-[10px] text-gray-400 font-medium">
            Click a lead to open detail · hover for quick actions
          </span>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-gray-400" onClick={fetchFollowUps}>
            <RotateCcw className="w-3 h-3 mr-1" /> Refresh
          </Button>
        </div>
      )}
    </div>
  );
};
