"use client";

/**
 * AdminAssignments — Smart Tutor Matching System
 * Left panel: lead list with assignment status indicators
 * Right panel: Smart Match recommendations + assignment history
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  Link2, Loader2, Download, Search, Zap,
  Users, CheckCircle, BarChart3, RefreshCw, Filter,
} from "lucide-react";
import { AssignmentDetailDrawer } from "@/components/admin/AssignmentDetailDrawer";
import { SmartMatchPanel } from "@/components/admin/SmartMatchPanel";
import { ExportModal } from "@/components/admin/ExportModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolveTemperature, getTemperatureColor, getTemperatureEmoji } from "@/lib/leadScoring";

// ─── Temperature chip ────────────────────────────────────────────────────────
const TempChip = ({ lead }: { lead: any }) => {
  const temp   = resolveTemperature(lead);
  const colors = getTemperatureColor(temp);
  const emoji  = getTemperatureEmoji(temp);
  return (
    <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full border shrink-0", colors.bg, colors.text, colors.border)}>
      {emoji} {temp}
    </span>
  );
};

// ─── Lead row in left panel ───────────────────────────────────────────────────
const LeadRow = ({
  lead, isSelected, assignedCount, onClick,
}: {
  lead: any; isSelected: boolean; assignedCount: number; onClick(): void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left px-3 py-3 rounded-xl border transition-all group",
      isSelected
        ? "bg-indigo-600 border-indigo-600 shadow-md text-white"
        : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm",
    )}
  >
    <div className="flex items-start gap-2.5">
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black shrink-0",
        isSelected ? "bg-white/20 text-white" : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white",
      )}>
        {(lead.name || "?")[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className={cn("text-[13px] font-bold truncate", isSelected ? "text-white" : "text-gray-900")}>{lead.name}</p>
          <TempChip lead={lead} />
        </div>
        <p className={cn("text-[10px] truncate mt-0.5", isSelected ? "text-indigo-200" : "text-gray-400")}>
          {lead.class_level || "—"} · {lead.city || "—"} · {lead.subjects ? (Array.isArray(lead.subjects) ? lead.subjects[0] : lead.subjects) : "No subject"}
        </p>
      </div>

      {/* Assign badge */}
      {assignedCount > 0 && (
        <span className={cn(
          "text-[9px] font-black px-1.5 py-0.5 rounded-full border shrink-0",
          isSelected ? "bg-white/20 text-white border-white/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
        )}>
          {assignedCount} ✓
        </span>
      )}
    </div>
  </button>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminAssignments() {
  // ── Leads state ─────────────────────────────────────
  const [leads, setLeads]           = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadPage, setLeadPage]     = useState(1);
  const [leadTotal, setLeadTotal]   = useState(0);
  const [filterStatus, setStatus]   = useState("all");
  const leadPageSize = 20;

  // ── Assignments summary ──────────────────────────────
  const [assignSummary, setAssignSummary] = useState<Record<string, number>>({});

  // ── Selected lead for smart match ───────────────────
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // ── Assignment list tab (right panel when no lead) ──
  const [assignments, setAssignments]   = useState<any[]>([]);
  const [loadingA, setLoadingA]         = useState(false);
  const [assnPage, setAssnPage]         = useState(1);
  const [assnTotal, setAssnTotal]       = useState(0);
  const [assnSearch, setAssnSearch]     = useState("");
  const [assnStatus, setAssnStatus]     = useState("all");
  const assnPageSize = 12;

  const [detailAssn, setDetailAssn]     = useState<any>(null);
  const [exportOpen, setExport]         = useState(false);

  // ── KPIs ────────────────────────────────────────────
  const [kpi, setKpi] = useState({ total: 0, active: 0, completed: 0 });

  // Fetch leads for left panel
  const fetchLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      const start = (leadPage - 1) * leadPageSize;
      let q = supabase.from("leads").select("id, name, phone, class_level, city, subjects, status, lead_temperature, lead_score, budget, mode", { count: "exact" })
        .order("created_at", { ascending: false });
      if (leadSearch.trim()) q = q.ilike("name", `%${leadSearch}%`);
      if (filterStatus !== "all") q = q.eq("status", filterStatus);
      const { data, count, error } = await q.range(start, start + leadPageSize - 1);
      if (error) throw error;
      setLeads(data || []);
      if (count !== null) setLeadTotal(count);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoadingLeads(false); }
  }, [leadPage, leadSearch, filterStatus]);

  // Fetch assignment summary (lead_id → count)
  const fetchSummary = useCallback(async () => {
    const { data } = await supabase.from("lead_tutor_assignments").select("lead_id, status").eq("status", "Active");
    const map: Record<string, number> = {};
    (data || []).forEach((a: any) => { map[a.lead_id] = (map[a.lead_id] || 0) + 1; });
    setAssignSummary(map);
  }, []);

  // Fetch right-panel assignments list
  const fetchAssignments = useCallback(async () => {
    setLoadingA(true);
    try {
      const start = (assnPage - 1) * assnPageSize;
      let q = supabase.from("lead_tutor_assignments").select("*", { count: "exact" }).order("start_date", { ascending: false });
      if (assnStatus !== "all") q = q.eq("status", assnStatus);
      if (assnSearch.trim()) q = q.or(`lead_name.ilike.%${assnSearch}%,tutor_name.ilike.%${assnSearch}%`);
      const { data, count, error } = await q.range(start, start + assnPageSize - 1);
      if (error) throw error;
      setAssignments(data || []);
      if (count !== null) {
        setAssnTotal(count);
        setKpi({
          total: count,
          active:    (data || []).filter((r: any) => r.status === "Active").length,
          completed: (data || []).filter((r: any) => r.status === "Completed").length,
        });
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setLoadingA(false); }
  }, [assnPage, assnSearch, assnStatus]);

  useEffect(() => { fetchLeads(); fetchSummary(); }, [fetchLeads, fetchSummary]);
  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  // ── Status colours ──────────────────────────────────
  const SC: Record<string, string> = {
    Active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    Completed: "bg-blue-50 text-blue-700 border-blue-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const leadTotalPages = Math.ceil(leadTotal / leadPageSize);

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Global header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 shrink-0 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-black text-gray-900 flex items-center gap-2">
            <Link2 className="w-4.5 h-4.5 text-blue-500" /> Smart Tutor Matching
          </h1>
          <p className="text-[11px] text-gray-400">Click a lead to see AI-ranked tutor recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          {/* KPI chips */}
          <div className="hidden sm:flex items-center gap-2">
            {[
              { label: "Total", value: assnTotal, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
              { label: "Active", value: kpi.active, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { label: "Done", value: kpi.completed, color: "bg-blue-50 text-blue-700 border-blue-200" },
            ].map(k => (
              <div key={k.label} className={cn("text-[11px] font-bold px-2.5 py-1 rounded-lg border", k.color)}>
                {k.value} {k.label}
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => { fetchLeads(); fetchSummary(); fetchAssignments(); }} className="h-8 text-[12px]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExport(true)} className="h-8 text-[12px]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* ── Two-panel body ─────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Lead list ──────────────────────────────────────────────── */}
        <div className="w-[300px] xl:w-[340px] shrink-0 flex flex-col border-r border-gray-200 bg-[#F4F6FA] overflow-hidden">
          {/* Lead filter toolbar */}
          <div className="px-3 py-3 space-y-2 bg-white border-b border-gray-200 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <Input placeholder="Search lead..." value={leadSearch} onChange={e => { setLeadSearch(e.target.value); setLeadPage(1); }} className="h-8 pl-7 text-[12px]" />
            </div>
            <Select value={filterStatus} onValueChange={v => { setStatus(v); setLeadPage(1); }}>
              <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="New Lead">New Lead</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Trial Booked">Trial Booked</SelectItem>
                <SelectItem value="Trial Done">Trial Done</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lead rows */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loadingLeads ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-indigo-400" /></div>
            ) : leads.length === 0 ? (
              <p className="text-center text-[12px] text-gray-400 py-10">No leads found</p>
            ) : (
              leads.map(lead => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLead?.id === lead.id}
                  assignedCount={assignSummary[lead.id] || 0}
                  onClick={() => setSelectedLead(lead.id === selectedLead?.id ? null : lead)}
                />
              ))
            )}
          </div>

          {/* Lead pagination */}
          {leadTotalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white shrink-0">
              <Button variant="ghost" size="sm" disabled={leadPage === 1} onClick={() => setLeadPage(p => p - 1)} className="h-7 text-[11px]">← Prev</Button>
              <span className="text-[11px] text-gray-400">{leadPage} / {leadTotalPages}</span>
              <Button variant="ghost" size="sm" disabled={leadPage === leadTotalPages} onClick={() => setLeadPage(p => p + 1)} className="h-7 text-[11px]">Next →</Button>
            </div>
          )}
        </div>

        {/* RIGHT: Smart match OR assignment list ───────────────────────── */}
        <div className="flex-1 overflow-hidden">
          {selectedLead ? (
            <SmartMatchPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
          ) : (
            /* Assignment list view */
            <div className="h-full flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-2 shrink-0">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span className="text-[13px] font-black text-gray-700">Assignment Log</span>
                <span className="text-[10px] text-gray-400 ml-1">← Select a lead to run smart matching</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input placeholder="Search..." value={assnSearch} onChange={e => { setAssnSearch(e.target.value); setAssnPage(1); }} className="h-8 pl-7 w-[160px] text-[12px]" />
                  </div>
                  <Select value={assnStatus} onValueChange={v => { setAssnStatus(v); setAssnPage(1); }}>
                    <SelectTrigger className="h-8 w-[120px] text-[12px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Assignment cards */}
              <div className="flex-1 overflow-y-auto p-4">
                {loadingA ? (
                  <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-dashed rounded-xl">
                    <Link2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-[13px] font-bold text-gray-500">No assignments yet</p>
                    <p className="text-[11px] text-gray-400 mt-1">Select a lead from the left to match tutors.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignments.map(a => (
                      <button key={a.id} onClick={() => setDetailAssn(a)}
                        className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-indigo-200 transition-all group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[12px] font-black shrink-0">
                          {(a.tutor_name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-bold text-gray-900 truncate">{a.tutor_name}</p>
                            <span className="text-[9px] text-gray-400">→</span>
                            <p className="text-[12px] font-semibold text-indigo-600 truncate">{a.lead_name}</p>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {a.class_level || "—"} · {a.start_date ? format(parseISO(a.start_date), "dd MMM yy") : "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.fee && <span className="text-[12px] font-black text-emerald-700">₹{a.fee}/mo</span>}
                          <Badge variant="outline" className={cn("text-[9px] h-5 font-bold border", SC[a.status] || "")}>{a.status}</Badge>
                        </div>
                      </button>
                    ))}

                    {/* Pagination */}
                    {Math.ceil(assnTotal / assnPageSize) > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <Button variant="outline" size="sm" disabled={assnPage === 1} onClick={() => setAssnPage(p => p - 1)} className="h-8 text-[12px]">← Prev</Button>
                        <span className="text-[12px] text-gray-400">{assnPage} / {Math.ceil(assnTotal / assnPageSize)}</span>
                        <Button variant="outline" size="sm" disabled={assnPage === Math.ceil(assnTotal / assnPageSize)} onClick={() => setAssnPage(p => p + 1)} className="h-8 text-[12px]">Next →</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {detailAssn && <AssignmentDetailDrawer isOpen onClose={() => setDetailAssn(null)} assignment={detailAssn} />}
      <ExportModal isOpen={exportOpen} onClose={() => setExport(false)} activeTab="lead_tutor_assignments" />
    </div>
  );
}
