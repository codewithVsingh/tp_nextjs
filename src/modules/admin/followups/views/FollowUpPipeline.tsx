"use client";

/**
 * AdminFollowUps — Task Manager View
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { 
  CalendarClock, CheckCircle, AlertTriangle, Clock, Loader2, 
  RefreshCw, User, MapPin, GraduationCap, ArrowRight 
} from "lucide-react";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { FollowUpModal } from "@/components/admin/FollowUpModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [page, setPage]             = useState(1);
  const pageSize = 10;
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
        .limit(200);
      if (error) throw error;
      setLeads(data || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = useMemo(() => leads.filter(l => {
    if (!l.next_follow_up) return false;
    const d = new Date(l.next_follow_up);
    if (filter === "overdue") return isPast(d) && !isToday(d);
    if (filter === "today")   return isToday(d);
    if (filter === "upcoming") return !isPast(d) && !isToday(d);
    return true;
  }), [leads, filter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedLeads = filtered.slice((page - 1) * pageSize, page * pageSize);

  const overdue  = leads.filter(l => l.next_follow_up && isPast(new Date(l.next_follow_up)) && !isToday(new Date(l.next_follow_up))).length;
  const todayC   = leads.filter(l => l.next_follow_up && isToday(new Date(l.next_follow_up))).length;
  const upcoming = leads.filter(l => l.next_follow_up && !isPast(new Date(l.next_follow_up)) && !isToday(new Date(l.next_follow_up))).length;

  useEffect(() => { setPage(1); }, [filter]);

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <CalendarClock className="w-6 h-6 text-amber-600" />
            </div>
            Follow-Up Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            <span className="text-slate-900 font-bold">{leads.length}</span> leads tracked · 
            <span className={cn("ml-1", overdue > 0 ? "text-red-600 font-bold" : "text-slate-500")}> {overdue} overdue</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLeads} 
          className="h-10 px-4 bg-white shadow-sm border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} /> 
          Refresh Leads
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/60 w-fit">
        {([
          { id: "all",      label: "All Leads",      count: leads.length },
          { id: "overdue",  label: "Overdue",  count: overdue },
          { id: "today",    label: "Today",    count: todayC },
          { id: "upcoming", label: "Upcoming", count: upcoming },
        ] as const).map(f => (
          <button 
            key={f.id} 
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2.5",
              filter === f.id 
                ? "bg-white text-indigo-600 shadow-md shadow-indigo-100 border-white" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50 border-transparent"
            )}
          >
            {f.label}
            <span className={cn(
              "text-[10px] font-black px-2 py-0.5 rounded-full",
              filter === f.id ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"
            )}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Loading Intelligence...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Mission Accomplished</h3>
          <p className="text-slate-400 mt-1 font-medium">No follow-ups currently pending in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {paginatedLeads.map(lead => {
            const due = lead.next_follow_up ? dueLabel(lead.next_follow_up) : null;
            const isOvr = lead.next_follow_up && isPast(new Date(lead.next_follow_up)) && !isToday(new Date(lead.next_follow_up));
            
            return (
              <div 
                key={lead.id} 
                className={cn(
                  "group relative bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 cursor-pointer overflow-hidden",
                  isOvr && "border-red-100 hover:border-red-200"
                )} 
                onClick={() => setDetail(lead)}
              >
                {/* Visual Accent */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
                  isOvr ? "bg-red-500" : isToday(new Date(lead.next_follow_up!)) ? "bg-amber-500" : "bg-indigo-500"
                )} />

                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors shrink-0">
                    <User className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{lead.name}</h3>
                      {lead.status && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-200">
                          {lead.status}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-slate-500 text-[12px] font-medium">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 opacity-50" /> {lead.city || "Remote"}</div>
                      <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 opacity-50" /> {lead.class_level || "No Class"}</div>
                    </div>
                  </div>
                </div>

                {/* Next Action */}
                <div className="flex-1 px-4 md:border-l border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                    <ArrowRight className="w-3 h-3" /> Next Action
                  </div>
                  <p className="text-[13px] text-slate-600 font-bold line-clamp-1">{lead.next_action || "Manual follow-up required"}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                  {due && (
                    <div className={cn(
                      "flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-tight",
                      due.cls
                    )}>
                      {isOvr ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {due.label}
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={e => { e.stopPropagation(); setLogRecord(lead); }}
                    className="h-10 px-6 text-[12px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 rounded-xl"
                  >
                    Log Activity
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-6 bg-white border border-slate-200 rounded-3xl shadow-sm mt-8">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filtered.length)} <span className="mx-1">/</span> {filtered.length} Leads
          </p>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPage(p => p - 1)} 
              disabled={page <= 1}
              className="h-10 px-4 text-[12px] font-black uppercase tracking-widest hover:bg-slate-50"
            >
              Prev
            </Button>

            <Select 
              value={page.toString()} 
              onValueChange={(val) => setPage(parseInt(val))}
            >
              <SelectTrigger className="h-10 w-[110px] text-[12px] font-black bg-slate-50 border-slate-200 rounded-xl uppercase tracking-widest">
                <SelectValue placeholder={`Page ${page}`} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="text-[12px] font-bold">
                    Page {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPage(p => p + 1)} 
              disabled={page >= totalPages}
              className="h-10 px-4 text-[12px] font-black uppercase tracking-widest hover:bg-slate-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <LeadDetailDrawer isOpen={!!detailRecord} onClose={() => setDetail(null)} record={detailRecord} activeTab="leads" onViewTutor={() => {}} />
      {logRecord && <FollowUpModal isOpen onClose={() => setLogRecord(null)} recordId={logRecord.id} activeTab="leads" currentStatus={logRecord.status || "Pending"} onSuccess={fetchLeads} />}
    </div>
  );
}
