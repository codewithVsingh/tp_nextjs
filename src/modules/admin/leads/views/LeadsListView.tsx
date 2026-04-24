"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { TPDataTable } from "@/design-system/components/TPDataTable";
import { AddEntryModal } from "@/components/admin/AddEntryModal";
import { ExportModal } from "@/components/admin/ExportModal";
import { FollowUpModal } from "@/components/admin/FollowUpModal";
import { AssignTutorModal } from "@/components/admin/AssignTutorModal";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { TutorDrawer } from "@/components/admin/TutorDrawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FUNNEL_STATUS_OPTIONS } from "@/domains/lead-management/constants/funnelStages";
import { useLeads } from "@/domains/lead-management/hooks/useLeads";
import { TemperatureBadge } from "@/domains/lead-management/components/TemperatureBadge";
import { TPSmartFilters } from "@/design-system/components/TPSmartFilters";
import { TPBulkActionToolbar } from "@/design-system/components/TPBulkActionToolbar";
import { TPButton } from "@/design-system/components/TPButton";
import { TPInput } from "@/design-system/components/TPInput";
import { Tag, Trash2, CheckCircle, RefreshCw, Plus, Download, RotateCcw, CalendarIcon, ArrowUpDown, Users, Clock, Link as LinkIcon } from "lucide-react";

export default function LeadsListView() {
  const {
    data, loading, page, setPage, filteredCount, pageSize,
    filterStatus, setFilterStatus, filterCity, setFilterCity,
    filterTemperature, setFilterTemperature, sortByScore, setSortByScore,
    dateRange, setDateRange, fetchData, reset
  } = useLeads();

  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [followUpRecord, setFollowUpRecord] = useState<any>(null);
  const [assignRecord, setAssignRecord] = useState<any>(null);
  const [detailRecord, setDetailRecord] = useState<any>(null);
  const [viewTutorRecord, setViewTutor] = useState<any>(null);
  const [editLead, setEditLead] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns = [
    { key: "created_at", header: "Date", render: (v: any) => v ? <span className="whitespace-nowrap text-[11px] font-medium text-slate-500 block min-w-[90px]">{format(parseISO(v), "dd MMM, yy")}</span> : "—" },
    { key: "name", header: "Name", render: (v: any) => <span className="font-bold text-gray-900">{v}</span> },
    { key: "phone", header: "Phone" },
    { key: "class_level", header: "Class" },
    { key: "city", header: "City" },
    { key: "status", header: "Stage", render: (v: any) => <Badge variant="outline" className="text-[10px] font-bold h-5 border-indigo-200 text-indigo-700 bg-indigo-50">{v || "New Lead"}</Badge> },
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
    { key: "lead_score", header: "Score", render: (_: any, row: any) => <TemperatureBadge lead={row} /> },
    { key: "action", header: "", render: (_: any, row: any) => (
      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => setAssignRecord(row)} className="h-7 text-[11px] text-indigo-600 hover:bg-indigo-50"><LinkIcon className="w-3 h-3 mr-1" /> Assign</Button>
        <Button variant="ghost" size="sm" onClick={() => setFollowUpRecord(row)} className="h-7 text-[11px] text-gray-500"><Clock className="w-3 h-3 mr-1" /> Log</Button>
      </div>
    )},
  ];

  const activeFiltersCount = [
    filterStatus !== 'all',
    filterTemperature !== 'all',
    filterCity !== '',
    dateRange?.from !== undefined
  ].filter(Boolean).length;

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
        <div className="flex gap-2.5">
          <TPButton variant="ghost" size="sm" onClick={fetchData} className="h-8 text-[11px]"><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh</TPButton>
          <TPButton variant="outline" size="sm" onClick={() => setExportOpen(true)} className="h-8 text-[11px]"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</TPButton>
          <TPButton size="sm" roleVariant="admin" onClick={() => setAddOpen(true)} className="h-8 text-[11px]"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Lead</TPButton>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <TPSmartFilters
        searchValue={filterCity}
        onSearchChange={setFilterCity}
        searchPlaceholder="Filter by city..."
        activeFiltersCount={activeFiltersCount}
        onClearFilters={reset}
      >
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="h-9 text-[12px] w-[140px] bg-white border-slate-200"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {FUNNEL_STATUS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterTemperature} onValueChange={v => { setFilterTemperature(v); setPage(1); }}>
          <SelectTrigger className="h-9 text-[12px] w-[130px] bg-white border-slate-200"><SelectValue placeholder="All Temps" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Temps</SelectItem>
            <SelectItem value="Hot">🔴 Hot</SelectItem>
            <SelectItem value="Warm">🟡 Warm</SelectItem>
            <SelectItem value="Cold">⚪ Cold</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 text-[12px] justify-start px-3 bg-white border-slate-200 w-[180px]">
              <CalendarIcon className="w-3.5 h-3.5 mr-2 opacity-60" />
              {dateRange?.from ? format(dateRange.from, "MMM dd") + (dateRange.to ? ` - ${format(dateRange.to, "MMM dd")}` : "") : "Select date..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50">
            <CalendarUI mode="range" selected={dateRange} onSelect={e => { setDateRange(e); setPage(1); }} numberOfMonths={2} />
          </PopoverContent>
        </Popover>

        <Button 
          variant={sortByScore ? "default" : "outline"} 
          size="sm"
          onClick={() => { setSortByScore(s => !s); setPage(1); }}
          className={cn("h-9 text-[12px] gap-2 bg-white border-slate-200 shrink-0", sortByScore ? "bg-indigo-600 text-white border-indigo-600" : "")}
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> {sortByScore ? "Score" : "Score"}
        </Button>
      </TPSmartFilters>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <TPDataTable
          data={data} columns={columns} loading={loading}
          page={page} pageSize={pageSize} totalRecords={filteredCount}
          onPageChange={setPage} onRowClick={setDetailRecord}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <TPBulkActionToolbar 
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        actions={[
          { label: "Update Stage", icon: Tag, onClick: () => {} },
          { label: "Verify", icon: CheckCircle, onClick: () => {} },
          { label: "Delete", icon: Trash2, onClick: () => {}, variant: "destructive" },
        ]}
      />

      {/* Modals */}
      <AddEntryModal isOpen={addOpen} onClose={() => setAddOpen(false)} activeTab="leads" onAdded={fetchData} />
      <AddEntryModal isOpen={!!editLead} onClose={() => setEditLead(null)} activeTab="leads" onAdded={fetchData} initialData={editLead} />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} activeTab="leads" />
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

