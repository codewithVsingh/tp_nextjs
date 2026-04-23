"use client";

/**
 * AdminLeads — Full CRM Lead Table
 * The complete lead management interface moved out of the dashboard.
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Loader2, Plus, Download, RotateCcw, CalendarIcon, ArrowUpDown, Filter,
  Users, Flame, CheckCircle, Clock, Link as LinkIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { DataTable } from "@/components/admin/DataTable";
import { AddEntryModal } from "@/components/admin/AddEntryModal";
import { ExportModal } from "@/components/admin/ExportModal";
import { FollowUpModal } from "@/components/admin/FollowUpModal";
import { AssignTutorModal } from "@/components/admin/AssignTutorModal";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { TutorDrawer } from "@/components/admin/TutorDrawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { calculateLeadScore, resolveScore, resolveTemperature, getTemperatureColor, getTemperatureEmoji } from "@/lib/leadScoring";
import { FUNNEL_STATUS_OPTIONS } from "@/lib/funnelStages";

const TemperatureBadge = ({ lead }: { lead: any }) => {
  const temp   = resolveTemperature(lead);
  const score  = resolveScore(lead);
  const colors = getTemperatureColor(temp);
  const emoji  = getTemperatureEmoji(temp);
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border", colors.bg, colors.text, colors.border)}>
        {emoji} {temp}
      </span>
      <div className="flex items-center gap-1">
        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", score >= 70 ? "bg-red-500" : score >= 40 ? "bg-amber-500" : "bg-slate-300")} style={{ width: `${score}%` }} />
        </div>
        <span className={cn("text-[10px] font-black", score >= 70 ? "text-red-600" : score >= 40 ? "text-amber-600" : "text-slate-400")}>{score}</span>
      </div>
    </div>
  );
};

export default function AdminLeads() {
  const [data, setData]               = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [filteredCount, setCount]     = useState(0);
  const pageSize = 15;

  const [filterStatus,      setFilterStatus]      = useState("all");
  const [filterCity,        setFilterCity]        = useState("");
  const [filterTemperature, setFilterTemperature] = useState("all");
  const [sortByScore,       setSortByScore]       = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: subDays(new Date(), 30), to: new Date() });

  const [addOpen,         setAddOpen]         = useState(false);
  const [exportOpen,      setExportOpen]      = useState(false);
  const [followUpRecord,  setFollowUpRecord]  = useState<any>(null);
  const [assignRecord,    setAssignRecord]    = useState<any>(null);
  const [detailRecord,    setDetailRecord]    = useState<any>(null);
  const [viewTutorRecord, setViewTutor]       = useState<any>(null);
  const [editLead,        setEditLead]        = useState<any>(null);

  useEffect(() => { fetchData(); }, [page, filterStatus, filterCity, filterTemperature, sortByScore, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const start = (page - 1) * pageSize;
      const end   = start + pageSize - 1;
      
      // Fetch from leads
      let q = supabase.from("leads").select("*", { count: "exact" });
      if (sortByScore) q = q.order("lead_score", { ascending: false });
      else             q = q.order("created_at", { ascending: false });
      if (filterStatus !== "all") q = q.eq("status", filterStatus);
      if (filterCity.trim())      q = q.ilike("city", `%${filterCity}%`);
      if (dateRange?.from) q = q.gte("created_at", startOfDay(dateRange.from).toISOString());
      if (dateRange?.to)   q = q.lte("created_at", endOfDay(dateRange.to).toISOString());
      const { data: leads, count: leadsCount, error: leadsErr } = await q.range(start, end);
      if (leadsErr) throw leadsErr;

      // Also fetch from demo_bookings as secondary source for legacy/demo leads
      // Only do this on page 1 or if specifically looking for them
      let demoLeads: any[] = [];
      let totalDemos = 0;
      if (page === 1) {
        let dq = supabase.from("demo_bookings").select("*", { count: "exact" });
        if (dateRange?.from) dq = dq.gte("created_at", startOfDay(dateRange.from).toISOString());
        if (dateRange?.to)   dq = dq.lte("created_at", endOfDay(dateRange.to).toISOString());
        const { data: dRows, count: dCount } = await dq.limit(50);
        demoLeads = (dRows || []).map(r => ({ ...r, source: r.source || "demo_booking_page" }));
        totalDemos = dCount || 0;
      }

      const combined = [...(leads || []), ...demoLeads];

      let enriched = combined.map(row => {
        const c = calculateLeadScore(row);
        return { ...row, lead_score: row.lead_score ?? c.score, lead_temperature: row.lead_temperature ?? c.temperature };
      });

      if (filterTemperature !== "all") enriched = enriched.filter(r => resolveTemperature(r) === filterTemperature);
      
      // Sort again because we merged
      if (sortByScore) enriched = [...enriched].sort((a, b) => resolveScore(b) - resolveScore(a));
      else enriched = [...enriched].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setData(enriched);
      setCount((leadsCount || 0) + totalDemos);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setFilterStatus("all"); setFilterCity(""); setFilterTemperature("all"); setSortByScore(false);
    setDateRange({ from: subDays(new Date(), 30), to: new Date() }); setPage(1);
  };

  const columns = [
    { key: "created_at", header: "Date",    render: (v: any) => v ? format(parseISO(v), "dd MMM, yy") : "—" },
    { key: "name",       header: "Name",    render: (v: any) => <span className="font-bold text-gray-900">{v}</span> },
    { key: "phone",      header: "Phone"   },
    { key: "class_level",header: "Class"   },
    { key: "city",       header: "City"    },
    { key: "status",     header: "Stage",  render: (v: any) => <Badge variant="outline" className="text-[10px] font-bold h-5 border-indigo-200 text-indigo-700 bg-indigo-50">{v || "New Lead"}</Badge> },
    { key: "source_page", header: "Source", render: (_: any, row: any) => (
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-indigo-600 truncate max-w-[100px]" title={row.source_page || row.source}>
          {row.source_page || row.source || "Direct"}
        </span>
        <span className="text-[9px] text-gray-400 truncate max-w-[100px]" title={row.source_cta}>
          {row.source_cta || "—"}
        </span>
      </div>
    )},
    { key: "lead_score", header: "Score",  render: (_: any, row: any) => <TemperatureBadge lead={row} /> },
    { key: "action",     header: "",       render: (_: any, row: any) => (
      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => setAssignRecord(row)}  className="h-7 text-[11px] text-indigo-600 hover:bg-indigo-50"><LinkIcon className="w-3 h-3 mr-1" /> Assign</Button>
        <Button variant="ghost" size="sm" onClick={() => setFollowUpRecord(row)} className="h-7 text-[11px] text-gray-500"><Clock className="w-3 h-3 mr-1" /> Log</Button>
      </div>
    )},
  ];

  const hotCount  = data.filter(r => resolveTemperature(r) === "Hot").length;
  const convCount = data.filter(r => r.status === "Converted").length;

  return (
    <div className="p-5 md:p-7 space-y-5 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Lead CRM
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Full pipeline management · {filteredCount.toLocaleString()} total records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)} className="h-8 text-[12px]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-[12px]">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Showing", value: filteredCount, color: "bg-gray-100 text-gray-700" },
          { label: "Hot 🔴", value: hotCount, color: "bg-red-50 text-red-700 border border-red-200" },
          { label: "Converted ✓", value: convCount, color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
        ].map(s => (
          <div key={s.label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold", s.color)}>
            {s.label} <span className="font-black">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 shadow-sm">
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-8 text-[12px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {FUNNEL_STATUS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterTemperature} onValueChange={v => { setFilterTemperature(v); setPage(1); }}>
          <SelectTrigger className="w-[120px] h-8 text-[12px]"><SelectValue placeholder="All Temps" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Temps</SelectItem>
            <SelectItem value="Hot">🔴 Hot</SelectItem>
            <SelectItem value="Warm">🟡 Warm</SelectItem>
            <SelectItem value="Cold">⚪ Cold</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Filter city..." value={filterCity} onChange={e => { setFilterCity(e.target.value); setPage(1); }} className="w-[120px] h-8 text-[12px]" />

        <Button variant={sortByScore ? "default" : "outline"} size="sm"
          onClick={() => { setSortByScore(s => !s); setPage(1); }}
          className={cn("h-8 text-[12px] gap-1", sortByScore ? "bg-indigo-600 text-white" : "")}>
          <ArrowUpDown className="w-3 h-3" /> {sortByScore ? "Score ↓" : "Sort Score"}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-[12px] px-3">
              <CalendarIcon className="w-3 h-3 mr-1.5 opacity-60" />
              {dateRange?.from ? format(dateRange.from, "MMM dd") + (dateRange.to ? ` — ${format(dateRange.to, "MMM dd")}` : "") : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50">
            <CalendarUI mode="range" selected={dateRange} onSelect={e => { setDateRange(e); setPage(1); }} numberOfMonths={2} />
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={reset} className="h-8 w-8 text-gray-400 hover:text-gray-700">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable
          data={data} columns={columns} loading={loading}
          page={page} pageSize={pageSize} totalRecords={filteredCount}
          onPageChange={setPage} onRowClick={setDetailRecord}
        />
      </div>

      {/* Modals */}
      <AddEntryModal isOpen={addOpen} onClose={() => setAddOpen(false)} activeTab="leads" onAdded={fetchData} />
      <AddEntryModal isOpen={!!editLead} onClose={() => setEditLead(null)} activeTab="leads" onAdded={fetchData} initialData={editLead} />
      <ExportModal   isOpen={exportOpen} onClose={() => setExportOpen(false)} activeTab="leads" />
      {followUpRecord && <FollowUpModal isOpen onClose={() => setFollowUpRecord(null)} recordId={followUpRecord.id} activeTab="leads" currentStatus={followUpRecord.status || "Pending"} onSuccess={fetchData} />}
      <LeadDetailDrawer 
        isOpen={!!detailRecord} 
        onClose={() => setDetailRecord(null)} 
        record={detailRecord} 
        activeTab="leads" 
        onViewTutor={setViewTutor}
        onEditClick={setEditLead}
      />
      {viewTutorRecord && <TutorDrawer isOpen onClose={() => setViewTutor(null)} tutor={viewTutorRecord} onEditClick={() => {}} />}
      <AssignTutorModal isOpen={!!assignRecord} onClose={() => setAssignRecord(null)} lead={assignRecord} activeTab="leads" onSuccess={fetchData} />
    </div>
  );
}
