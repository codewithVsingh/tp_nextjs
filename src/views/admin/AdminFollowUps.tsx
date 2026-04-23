"use client";

/**
 * AdminFollowUps — Task Manager View
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { CalendarClock, CheckCircle, AlertTriangle, Clock, Loader2, RefreshCw } from "lucide-react";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { FollowUpModal } from "@/components/admin/FollowUpModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FollowUpLead = {
  id: string; name: string; phone: string; city: string; class_level: string;
  status: string; next_follow_up: string | null; next_action: string | null;
};

const dueLabel = (date: string) => {
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) return { label: "Overdue",   cls: "text-red-600 bg-red-50 border-red-200" };
  if (isToday(d))               return { label: "Today",     cls: "text-amber-600 bg-amber-50 border-amber-200" };
  if (isTomorrow(d))            return { label: "Tomorrow",  cls: "text-blue-600 bg-blue-50 border-blue-200" };
  return { label: format(d, "dd MMM"), cls: "text-gray-600 bg-gray-50 border-gray-200" };
};

export default function AdminFollowUps() {
  const [leads, setLeads]           = useState<FollowUpLead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<"all"|"overdue"|"today"|"upcoming">("all");
  const [detailRecord, setDetail]   = useState<any>(null);
  const [logRecord, setLogRecord]   = useState<any>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, phone, city, class_level, status, next_follow_up, next_action")
        .not("next_follow_up", "is", null)
        .order("next_follow_up", { ascending: true })
        .limit(100);
      if (error) throw error;
      setLeads(data || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter(l => {
    if (!l.next_follow_up) return false;
    const d = new Date(l.next_follow_up);
    if (filter === "overdue") return isPast(d) && !isToday(d);
    if (filter === "today")   return isToday(d);
    if (filter === "upcoming") return !isPast(d) && !isToday(d);
    return true;
  });

  const overdue  = leads.filter(l => l.next_follow_up && isPast(new Date(l.next_follow_up)) && !isToday(new Date(l.next_follow_up))).length;
  const todayC   = leads.filter(l => l.next_follow_up && isToday(new Date(l.next_follow_up))).length;
  const upcoming = leads.filter(l => l.next_follow_up && !isPast(new Date(l.next_follow_up)) && !isToday(new Date(l.next_follow_up))).length;

  return (
    <div className="p-5 md:p-7 space-y-5 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-500" /> Follow-Up Manager
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{leads.length} leads tracked · {overdue} overdue</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLeads} className="h-8 text-[12px]">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {([
          { id: "all",      label: "All",      count: leads.length, color: "gray"   },
          { id: "overdue",  label: "Overdue",  count: overdue,      color: "red"    },
          { id: "today",    label: "Today",    count: todayC,       color: "amber"  },
          { id: "upcoming", label: "Upcoming", count: upcoming,     color: "blue"   },
        ] as const).map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn("px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all",
              filter === f.id ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}>
            {f.label}
            <span className={cn("ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full",
              filter === f.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            )}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-[14px] font-bold text-gray-600">All clear!  </p>
          <p className="text-[12px] text-gray-400 mt-1">No follow-ups in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => {
            const due = lead.next_follow_up ? dueLabel(lead.next_follow_up) : null;
            const isOvr = lead.next_follow_up && isPast(new Date(lead.next_follow_up)) && !isToday(new Date(lead.next_follow_up));
            return (
              <div key={lead.id} className={cn(
                "bg-white border rounded-xl px-4 py-3 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer",
                isOvr ? "border-red-200 bg-red-50/30" : "border-gray-200"
              )} onClick={() => setDetail(lead)}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-[13px] shrink-0">
                  {(lead.name || "?")[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-gray-900 truncate">{lead.name}</p>
                    {lead.status && (
                      <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">{lead.status}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {lead.next_action || "Follow up required"} · {lead.class_level || "—"} · {lead.city || "—"}
                  </p>
                </div>

                {/* Due badge */}
                {due && (
                  <div className={cn("shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border", due.cls)}>
                    {isOvr ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {due.label}
                  </div>
                )}

                {/* Log button */}
                <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setLogRecord(lead); }}
                  className="h-7 text-[11px] shrink-0">
                  Log
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <LeadDetailDrawer isOpen={!!detailRecord} onClose={() => setDetail(null)} record={detailRecord} activeTab="leads" onViewTutor={() => {}} />
      {logRecord && <FollowUpModal isOpen onClose={() => setLogRecord(null)} recordId={logRecord.id} activeTab="leads" currentStatus={logRecord.status || "Pending"} onSuccess={fetchLeads} />}
    </div>
  );
}
