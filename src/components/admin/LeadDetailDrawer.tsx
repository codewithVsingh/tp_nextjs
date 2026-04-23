import { useEffect, useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, formatDistanceToNow, addHours } from "date-fns";
import {
  Loader2, History, PhoneCall, Clock, Copy, Eye, Star,
  Phone, MessageSquare, FileText, AlertTriangle, CheckCircle2,
  RotateCcw, CalendarClock, Zap, Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSmartTutorMatches, getAssignedTutors } from "@/lib/tutorMatcher";
import { resolveScore, resolveTemperature, getTemperatureColor, getTemperatureEmoji } from "@/lib/leadScoring";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PaymentHistoryPanel } from "@/components/admin/PaymentHistoryPanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: any | null;
  activeTab: string;
  onViewTutor?: (tutor: any) => void;
  onEditClick?: (record: any) => void;
}

type DrawerTab = "followup" | "timeline" | "matches" | "payments";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  "Call Made":    <Phone className="w-3.5 h-3.5 text-blue-500" />,
  "Message Sent": <MessageSquare className="w-3.5 h-3.5 text-green-500" />,
  "Note Added":   <FileText className="w-3.5 h-3.5 text-gray-400" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  "Call Made":    "bg-blue-500",
  "Message Sent": "bg-green-500",
  "Note Added":   "bg-indigo-500",
};

export const LeadDetailDrawer = ({ isOpen, onClose, record, activeTab, onViewTutor, onEditClick }: Props) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [assignedTutors, setAssignedTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("followup");
  const [matchView, setMatchView] = useState<"recommended" | "assigned">("recommended");
  const [workloads, setWorkloads] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!record?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("follow_up_logs")
        .select("*")
        .eq("record_id", record.id)
        .order("created_at", { ascending: false });
      if (!error) setLogs(data || []);
    } catch (e) {}
    setLoading(false);
  }, [record?.id]);

  useEffect(() => {
    if (isOpen && record?.id) {
      fetchAll();
      fetchWorkloads();
      if (activeTab === "leads" || activeTab === "demo_bookings") fetchMatches();
    }
  }, [isOpen, record?.id]);

  const fetchWorkloads = async () => {
    try {
      const { data } = await supabase.from("lead_tutor_assignments").select("tutor_id").eq("status", "Active");
      if (data) setWorkloads(data.reduce((acc: any, curr: any) => { acc[curr.tutor_id] = (acc[curr.tutor_id] || 0) + 1; return acc; }, {}));
    } catch (e) {}
  };

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try { 
      const [recs, assigned] = await Promise.all([
        getSmartTutorMatches(record),
        getAssignedTutors(record?.id ?? ""),
      ]);
      setMatches(recs);
      setAssignedTutors(assigned);
    }
    catch (e) { console.error(e); }
    finally { setLoadingMatches(false); }
  };

  const markDone = async () => {
    if (!record?.id) return;
    setActionLoading("done");
    try {
      await supabase.from("leads").update({
        follow_up_status: "Done",
        last_contacted_at: new Date().toISOString(),
        next_follow_up: addHours(new Date(), 48).toISOString(),
      }).eq("id", record.id);
      await supabase.from("follow_up_logs").insert({
        record_id: record.id, table_name: "leads",
        note: "Follow-up marked as Done", status: record.status || "Contacted",
        activity_type: "Note Added",
      });
      toast.success("Marked as Done ✓");
      fetchAll();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const reschedule = async (hours: number) => {
    if (!record?.id) return;
    setActionLoading("reschedule");
    try {
      const newDate = addHours(new Date(), hours);
      await supabase.from("leads").update({
        next_follow_up: newDate.toISOString(),
        follow_up_status: "Pending",
      }).eq("id", record.id);
      await supabase.from("follow_up_logs").insert({
        record_id: record.id, table_name: "leads",
        note: `Rescheduled follow-up to ${format(newDate, "dd MMM, hh:mm a")}`,
        status: record.status || "Pending",
        activity_type: "Note Added",
        next_follow_up: newDate.toISOString(),
      });
      toast.success(`Rescheduled to ${format(newDate, "dd MMM, hh:mm a")}`);
      fetchAll();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const getStatusColor = (s: string) => {
    const v = s?.toLowerCase() || "";
    if (v.includes("verif") || v.includes("convert")) return "bg-emerald-100 text-emerald-800";
    if (v.includes("drop")) return "bg-red-100 text-red-800";
    if (v.includes("contact")) return "bg-purple-100 text-purple-800";
    return "bg-orange-100 text-orange-800";
  };

  const isLeads = activeTab === "leads";
  const score = isLeads ? resolveScore(record || {}) : null;
  const temp = isLeads ? resolveTemperature(record || {}) : null;
  const tempColors = temp ? getTemperatureColor(temp) : null;

  const followUpStatus = record?.follow_up_status || "Pending";
  const nextFollowUp = record?.next_follow_up;
  const isOverdue = nextFollowUp && new Date(nextFollowUp) < new Date() && followUpStatus !== "Done";

  const tabs: { id: DrawerTab; label: string; icon: React.ReactNode }[] = [
    { id: "followup", label: "Follow-Up", icon: <CalendarClock className="w-3.5 h-3.5" /> },
    { id: "timeline", label: "Timeline",  icon: <History className="w-3.5 h-3.5" />     },
    { id: "matches",  label: "Tutors",    icon: <Star className="w-3.5 h-3.5" />        },
    { id: "payments", label: "Payments",  icon: <Zap className="w-3.5 h-3.5" />        },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight">
                {record?.name || record?.tutor_name || "Anonymous Contact"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                {record?.phone || record?.mobile || "No Number"}
              </p>
            </div>
            {/* Score and Edit badges */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {isLeads && temp && tempColors && (
                <div className={cn("flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border", tempColors.bg, tempColors.border)}>
                  <span className="text-[18px] font-black leading-none">{score}</span>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wide", tempColors.text)}>
                    {getTemperatureEmoji(temp)} {temp}
                  </span>
                </div>
              )}
              {isLeads && onEditClick && (
                <Button variant="outline" size="sm" onClick={() => onEditClick(record)} className="h-7 text-[10px] font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <RotateCcw className="w-3 h-3 mr-1" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Overdue warning */}
          {isLeads && isOverdue && (
            <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Overdue since {nextFollowUp ? formatDistanceToNow(parseISO(nextFollowUp), { addSuffix: true }) : "—"}
            </div>
          )}
        </SheetHeader>

        {/* Tab bar */}
        <div className="flex border-b bg-white sticky top-[88px] z-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setDrawerTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold transition-colors",
                drawerTab === tab.id
                  ? "border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">

          {/* ── FOLLOW-UP TAB ─────────────────────────────── */}
          {drawerTab === "followup" && (
            <div className="space-y-4">

              {/* Status card */}
              <div className={cn(
                "rounded-xl border p-4 space-y-3",
                followUpStatus === "Done" ? "bg-emerald-50 border-emerald-200" :
                followUpStatus === "Missed" ? "bg-red-50 border-red-200" :
                "bg-amber-50 border-amber-200"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Follow-Up Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-sm font-black",
                        followUpStatus === "Done" ? "text-emerald-700" :
                        followUpStatus === "Missed" ? "text-red-700" : "text-amber-700"
                      )}>
                        {followUpStatus === "Done" ? "✓ Done" :
                         followUpStatus === "Missed" ? "⚠ Missed" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                  {nextFollowUp && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Scheduled</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        {format(parseISO(nextFollowUp), "dd MMM, hh:mm a")}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {formatDistanceToNow(parseISO(nextFollowUp), { addSuffix: true })}
                      </p>
                    </div>
                  )}
                </div>

                {record?.next_action && (
                  <div className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2 border text-sm text-indigo-700 font-medium">
                    <Target className="w-4 h-4" />
                    <span className="text-[12px]">Next Action: {record.next_action}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {isLeads && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={markDone}
                      disabled={!!actionLoading || followUpStatus === "Done"}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-[12px]"
                    >
                      {actionLoading === "done"
                        ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                      Mark Done
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reschedule(24)}
                      disabled={!!actionLoading}
                      className="h-9 text-[12px] border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      {actionLoading === "reschedule"
                        ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        : <RotateCcw className="w-3.5 h-3.5 mr-1.5" />}
                      +24h
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[{ label: "+2h", h: 2 }, { label: "+3 days", h: 72 }, { label: "+1 week", h: 168 }].map(q => (
                      <button
                        key={q.h}
                        onClick={() => reschedule(q.h)}
                        disabled={!!actionLoading}
                        className="text-[11px] font-bold py-1.5 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                {/* Contact quick links */}
                <div className="flex gap-2 pt-1">
                  <a
                    href={`https://wa.me/91${record?.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${record?.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>

                {/* Requirement Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Requirement Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium">Class / Subject</p>
                      <p className="text-[12px] font-bold text-gray-800">{record?.class_level || "—"} · {Array.isArray(record?.subjects) ? record.subjects.join(", ") : "—"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium">Tutor Pref.</p>
                      <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-100 font-bold">
                        {record?.preferred_tutor_gender || "Any"} Gender
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium">Location</p>
                      <p className="text-[12px] font-bold text-gray-800">{record?.area || "—"}, {record?.city || "—"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium">Source / Page</p>
                      <p className="text-[11px] font-medium text-indigo-600 truncate" title={record?.source_page}>
                        {record?.source_page || record?.source || "unknown"}
                      </p>
                      {record?.source_cta && (
                        <p className="text-[9px] text-gray-500 italic mt-0.5">CTA: {record.source_cta}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* ── TIMELINE TAB ──────────────────────────────── */}
          {drawerTab === "timeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <History className="w-4 h-4 text-indigo-500" /> Activity Timeline
                </div>
                <span className="text-[11px] text-gray-400">{logs.length} entries</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-xl bg-gray-50 text-gray-500">
                  <p className="text-sm">No activity logged yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the "Log" button to record calls, messages, and notes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map(log => {
                    const dotColor = ACTIVITY_COLORS[log.activity_type] || "bg-indigo-500";
                    const icon = ACTIVITY_ICONS[log.activity_type] || <FileText className="w-3.5 h-3.5 text-gray-400" />;
                    return (
                      <div key={log.id} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-1">
                        <div className={cn("absolute w-3 h-3 rounded-full -left-[7px] top-1 ring-4 ring-white", dotColor)} />
                        <div className="bg-white rounded-lg p-3 border shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              {icon}
                              <span className="text-[11px] font-bold text-gray-600">
                                {log.activity_type || "Note Added"}
                              </span>
                              <Badge variant="secondary" className={cn("text-[9px] h-4 px-1.5", getStatusColor(log.status))}>
                                {log.status}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {format(parseISO(log.created_at), "dd MMM, hh:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{log.note}</p>
                          {log.next_follow_up && (
                            <div className="mt-2 py-1.5 px-3 bg-indigo-50 rounded flex items-center gap-2 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                              <Clock className="w-3 h-3" />
                              Next: {format(parseISO(log.next_follow_up), "dd MMM, yyyy")}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── MATCHES TAB ───────────────────────────────── */}
          {drawerTab === "matches" && (
            <div className="space-y-3">
              {/* Sub-tab */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setMatchView("recommended")} className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-md transition-colors", matchView === "recommended" ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>⭐ Recommended ({matches.length})</button>
                <button onClick={() => setMatchView("assigned")} className={cn("flex-1 py-1.5 text-[12px] font-bold rounded-md transition-colors", matchView === "assigned" ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>✅ Assigned ({assignedTutors.length})</button>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm text-orange-800 font-medium flex items-center gap-2">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> {matchView === "recommended" ? "AI-Powered Smart Matching" : "Currently Assigned Tutors"}
              </div>
              {loadingMatches ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : matchView === "recommended" ? (
                matches.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-xl bg-gray-50 text-gray-500">
                    <p className="text-sm">No compatible tutors found.</p>
                    <p className="text-xs text-gray-400 mt-1">Add subject / location / budget to improve matching.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map(tutor => {
                      const bd = tutor.matchBreakdown ?? {};
                      const ratingNum = typeof tutor.rating === "number" ? tutor.rating : parseFloat(tutor.rating ?? "0") || 0;
                      return (
                        <div key={tutor.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:border-indigo-200 transition-colors">
                          {/* Header */}
                          <div className="flex items-start justify-between p-3 pb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-gray-900 text-[14px]">{tutor.name}</span>
                                {(workloads[tutor.id] ?? 0) > 0 && (
                                  <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                                    {workloads[tutor.id]} Active
                                  </span>
                                )}
                              </div>
                              {/* Rating */}
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} className={cn("w-3 h-3", i <= Math.round(ratingNum) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200")} />
                                ))}
                                <span className="text-[10px] text-gray-500 font-medium ml-0.5">
                                  {ratingNum > 0 ? ratingNum.toFixed(1) : "No rating"} · {tutor.experience || "—"} exp
                                </span>
                              </div>
                            </div>
                            {/* Match % */}
                            <div className={cn("shrink-0 flex flex-col items-center px-2.5 py-1.5 rounded-lg border text-center ml-2",
                              tutor.matchScore >= 70 ? "bg-emerald-50 border-emerald-200" :
                              tutor.matchScore >= 40 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200")}>
                              <span className={cn("text-[18px] font-black leading-none",
                                tutor.matchScore >= 70 ? "text-emerald-700" :
                                tutor.matchScore >= 40 ? "text-amber-700" : "text-gray-600")}>{tutor.matchScore}%</span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">match</span>
                            </div>
                          </div>

                          {/* Subject + location + budget chips */}
                          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                            {(Array.isArray(tutor.subjects) ? tutor.subjects : []).slice(0, 3).map((s: string) => (
                              <span key={s} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{s}</span>
                            ))}
                            <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">📌 {tutor.city || "—"}</span>
                            {(tutor.min_budget > 0 || tutor.max_budget > 0) && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                                ₹{tutor.min_budget}–{tutor.max_budget}/mo
                              </span>
                            )}
                          </div>

                          {/* Breakdown bars */}
                          {Object.keys(bd).length > 0 && (
                            <div className="px-3 pb-2 space-y-1">
                              {([
                                { key: "subjects", label: "Subject",  max: 30 },
                                { key: "class",    label: "Class",    max: 25 },
                                { key: "budget",   label: "Budget",   max: 20 },
                                { key: "location", label: "Location", max: 15 },
                                { key: "mode",     label: "Mode",     max: 10 },
                              ] as const).map(({ key, label, max }) => {
                                const val = (bd as any)[key] ?? 0;
                                const p   = Math.round((val / max) * 100);
                                return (
                                  <div key={key} className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-400 w-12 shrink-0">{label}</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className={cn("h-full rounded-full transition-all", p === 100 ? "bg-emerald-500" : p > 0 ? "bg-indigo-400" : "bg-gray-200")} style={{ width: `${p}%` }} />
                                    </div>
                                    <span className="text-[9px] text-gray-400 w-5 text-right font-mono">{val}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 p-3 pt-2 border-t bg-gray-50/50">
                            <Button size="sm" variant="secondary" className="flex-1 h-7 text-[11px] shadow-none"
                              onClick={() => {
                                const sub = Array.isArray(tutor.subjects) ? tutor.subjects.join(", ") : tutor.subjects || "";
                                navigator.clipboard.writeText(`Tutor: ${tutor.name}\nSubjects: ${sub}\nExp: ${tutor.experience}\nCity: ${tutor.city}\nFee: ${tutor.expected_fees}\nRating: ${ratingNum}`);
                                toast.success("Profile copied!");
                              }}>
                              <Copy className="w-3 h-3 mr-1" /> Copy
                            </Button>
                            <Button size="sm" className="flex-1 h-7 text-[11px] bg-gray-900 hover:bg-black" onClick={() => onViewTutor?.(tutor)}>
                              <Eye className="w-3 h-3 mr-1" /> Open Bio
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* ── ASSIGNED VIEW ─── */
                assignedTutors.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-xl bg-gray-50 text-gray-500">
                    <p className="text-sm">No tutor assigned yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Use the Assign button in the lead table to link a tutor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignedTutors.map((a: any) => {
                      const sc =
                        a.status === "Active"     ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        a.status === "Completed"  ? "bg-blue-100 text-blue-700 border-blue-200" :
                        "bg-gray-100 text-gray-600 border-gray-200";
                      return (
                        <div key={a.id} className="bg-white border rounded-xl p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-gray-900 text-[14px]">{a.tutor_name}</p>
                              <p className="text-[11px] text-gray-500">{a.tutor_phone}</p>
                            </div>
                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", sc)}>{a.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
                            {a.start_date && <span>📅 {format(new Date(a.start_date), "dd MMM yyyy")}</span>}
                            {a.fee        && <span>💰 ₹{a.fee}/mo</span>}
                            {a.location   && <span>📌 {a.location}</span>}
                          </div>
                          {a.notes && (
                            <p className="mt-2 text-[11px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border italic">"{a.notes}"</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          )}
          {/* ── PAYMENTS TAB ──────────────────────────────── */}
          {drawerTab === "payments" && record?.id && (
            <PaymentHistoryPanel
              leadId={record.id}
              leadName={record.name || record.tutor_name || ""}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
