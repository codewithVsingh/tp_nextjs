"use client";

/**
 * AdminTutors — Tutor Intelligence System
 * Full performance analytics, scoring, and management for all tutors.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  GraduationCap, Search, Plus, Download, Star, Loader2,
  Trophy, TrendingUp, Users, Target, BarChart3, ChevronRight,
  RefreshCw, Filter, ArrowUpDown,
} from "lucide-react";
import { TutorDrawer } from "@/components/admin/TutorDrawer";
import { EditTutorModal } from "@/components/admin/EditTutorModal";
import { AddEntryModal } from "@/components/admin/AddEntryModal";
import { ExportModal } from "@/components/admin/ExportModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { enrichTutor, TutorMetrics, TIER_CONFIG, TutorTier } from "@/modules/shared/logic/tutorScore";

// ─── Sub-components ────────────────────────────────────────────────────────────

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={cn("w-3 h-3", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200")} />
    ))}
    {rating > 0 && <span className="text-[10px] text-gray-400 ml-1 font-semibold">{rating.toFixed(1)}</span>}
  </div>
);

const ScoreBadge = ({ score, tier }: { score: number; tier: TutorTier }) => {
  const cfg = TIER_CONFIG[tier];
  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-black text-[12px]", cfg.bg, cfg.border, cfg.color)}>
      <span className="text-[16px] leading-none">{score}</span>
      <span className="text-[9px] font-bold opacity-70">/ 100</span>
    </div>
  );
};

const MetricPill = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className={cn("rounded-lg px-2.5 py-1.5 text-center border", color)}>
    <p className="text-[15px] font-black leading-none">{value}</p>
    <p className="text-[9px] font-semibold mt-0.5 opacity-70">{label}</p>
  </div>
);

// ─── Tutor card (grid view) ────────────────────────────────────────────────────
const TutorCard = ({ tutor, onClick }: { tutor: any; onClick(): void }) => {
  const cfg = TIER_CONFIG[tutor.tier as TutorTier] || TIER_CONFIG.Low;
  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : [];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group bg-white border rounded-xl p-4 text-left hover:shadow-md transition-all w-full relative overflow-hidden",
        tutor.tier === "Top" ? "border-emerald-200 hover:border-emerald-300" :
        tutor.tier === "Mid" ? "border-amber-200 hover:border-amber-300" :
        "border-gray-200 hover:border-red-200"
      )}
    >
      {/* Top performer ribbon */}
      {tutor.tier === "Top" && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg">
          ⭐ TOP
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-[15px] shrink-0">
          {(tutor.name || "?")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-[14px] truncate leading-tight">{tutor.name}</p>
          <p className="text-[10px] text-gray-400 truncate mt-0.5">{tutor.city || "—"} · {tutor.experience || "—"}</p>
          <StarRow rating={tutor.avgRating || 0} />
        </div>
        <ScoreBadge score={tutor.tutorScore || 0} tier={tutor.tier || "Low"} />
      </div>

      {/* Subject chips */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {subjects.slice(0, 3).map((s: string) => (
            <span key={s} className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">{s}</span>
          ))}
          {subjects.length > 3 && <span className="text-[9px] text-gray-400">+{subjects.length - 3}</span>}
        </div>
      )}

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-1.5">
        <MetricPill label="Assigned" value={tutor.totalAssigned || 0}          color="bg-indigo-50 border-indigo-100 text-indigo-700" />
        <MetricPill label="Active"   value={tutor.activeStudents || 0}          color="bg-emerald-50 border-emerald-100 text-emerald-700" />
        <MetricPill label="Success"  value={`${tutor.successRate || 0}%`}        color="bg-violet-50 border-violet-100 text-violet-700" />
        <MetricPill label="Retain"   value={`${tutor.retentionRate || 0}%`}      color="bg-amber-50 border-amber-100 text-amber-700" />
      </div>

      {/* Progress bar for registrations */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[9px] font-black uppercase text-gray-400 mb-1">
          <span>Registration Progress</span>
          <span>Step {tutor.step_reached || 1}/4</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", (tutor.step_reached || 0) >= s ? "bg-indigo-500" : "bg-gray-100")} />
          ))}
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", tutor.tier === "Top" ? "bg-emerald-500" : tutor.tier === "Mid" ? "bg-amber-400" : "bg-red-400")}
            style={{ width: `${tutor.tutorScore || 0}%` }}
          />
        </div>
        <span className={cn("text-[9px] font-bold shrink-0", cfg.color)}>{cfg.label}</span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2">
        <span className="text-[10px] text-gray-400">Joined: {new Date(tutor.created_at).toLocaleDateString()}</span>
        {tutor.teaching_mode && <span className="text-[10px] font-bold text-indigo-500 uppercase">{tutor.teaching_mode}</span>}
      </div>

      {/* Drop-off Intelligence Badge */}
      {tutor.frictionPoint && (
        <div className="mt-2 p-1.5 bg-rose-50 border border-rose-100 rounded-lg">
          <p className="text-[9px] font-black text-rose-700 flex items-center gap-1 uppercase">
            <Target className="w-2.5 h-2.5" /> {tutor.frictionPoint}
          </p>
        </div>
      )}
    </button>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminTutors() {
  const [tutors, setTutors]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"all"|"top"|"mid"|"low"|"dropoff">("all");
  const [search, setSearch]         = useState("");
  const [filterCity, setCity]       = useState("all");
  const [filterState, setState]     = useState("all");
  const [filterSubject, setSubject] = useState("");
  const [filterScore, setScore]     = useState("all");
  const [sortBy, setSortBy]         = useState<"score"|"rating"|"name"|"active"|"newest">("newest");
  const [page, setPage]             = useState(1);
  const pageSize = 12;

  const [addOpen,     setAddOpen]   = useState(false);
  const [exportOpen, setExport]     = useState(false);
  const [viewTutor,  setViewTutor]  = useState<any>(null);
  const [editTutor,  setEditTutor]  = useState<any>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch tutors + all assignments in parallel
      const [tutorRes, assignRes, visibilityRes] = await Promise.all([
        supabase.from("tutor_registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("lead_tutor_assignments").select("tutor_id, status, lead_name, lead_id, fee, start_date, class_level"),
        supabase.from("tutor_visibility").select("*")
      ]);
      if (tutorRes.error) throw tutorRes.error;

      const allAssignments = assignRes.data || [];

      // Group assignments by tutor_id
      const byTutor: Record<string, any[]> = {};
      allAssignments.forEach(a => {
        if (!byTutor[a.tutor_id]) byTutor[a.tutor_id] = [];
        byTutor[a.tutor_id].push(a);
      });

      // Enrich each tutor with computed metrics and visibility
      const enriched = (tutorRes.data || []).map(t => {
        const base = enrichTutor(t, byTutor[t.id] || []);
        const vis = (visibilityRes.data || []).find(v => v.tutor_id === t.id);
        
        // Add Intelligence for Drop-offs
        let frictionPoint = "";
        if ((t.step_reached || 0) < 4) {
          if (t.step_reached === 1) frictionPoint = "Abandoned at Identity/Location";
          else if (t.step_reached === 2) frictionPoint = "Stopped at Teaching Profile";
          else if (t.step_reached === 3) frictionPoint = "Quit at Experience/Availability";
          else frictionPoint = "Document Friction";
        }

        return {
          ...base,
          visibility_status: vis?.visibility_status || "pending",
          priority_score: vis?.priority_score || 0,
          is_featured: vis?.is_featured || false,
          frictionPoint
        };
      });
      setTutors(enriched);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived / filtered list ──────────────────────────────────────────────────
  let filtered = tutors;
  
  // 1. Separate Drop-offs from Main Views
  if (tab === "dropoff") {
    filtered = filtered.filter(t => (t.step_reached || 0) < 4);
  } else {
    filtered = filtered.filter(t => (t.step_reached || 0) >= 4);
    if (tab === "top") filtered = filtered.filter(t => t.tier === "Top");
    if (tab === "mid") filtered = filtered.filter(t => t.tier === "Mid");
    if (tab === "low") filtered = filtered.filter(t => t.tier === "Low");
  }

  // 2. Location Filters
  if (filterState !== "all") filtered = filtered.filter(t => t.state === filterState);
  if (filterCity !== "all")  filtered = filtered.filter(t => t.city === filterCity);

  // 3. Search & Subject Filters
  if (search.trim())       filtered = filtered.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.phone?.includes(search));
  if (filterSubject.trim()) filtered = filtered.filter(t => {
    const s = Array.isArray(t.subjects) ? t.subjects.join(" ") : (t.subjects || "");
    return s.toLowerCase().includes(filterSubject.toLowerCase());
  });
  if (filterScore === "80+")  filtered = filtered.filter(t => t.tutorScore >= 80);
  if (filterScore === "50+")  filtered = filtered.filter(t => t.tutorScore >= 50 && t.tutorScore < 80);
  if (filterScore === "<50")  filtered = filtered.filter(t => t.tutorScore < 50);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score")  return (b.tutorScore || 0)      - (a.tutorScore || 0);
    if (sortBy === "rating") return (b.avgRating || 0)       - (a.avgRating || 0);
    if (sortBy === "active") return (b.activeStudents || 0)  - (a.activeStudents || 0);
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return (a.name || "").localeCompare(b.name || "");
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  // ── Aggregate stats ──────────────────────────────────────────────────────────
  const topCount   = tutors.filter(t => t.tier === "Top" && (t.step_reached || 0) >= 4).length;
  const midCount   = tutors.filter(t => t.tier === "Mid" && (t.step_reached || 0) >= 4).length;
  const lowCount   = tutors.filter(t => t.tier === "Low" && (t.step_reached || 0) >= 4).length;
  const activeTutors = tutors.filter(t => (t.step_reached || 0) >= 4);
  const avgScore   = activeTutors.length > 0 ? Math.round(activeTutors.reduce((a, t) => a + (t.tutorScore || 0), 0) / activeTutors.length) : 0;
  const totalActive = activeTutors.reduce((a, t) => a + (t.activeStudents || 0), 0);
  const top5 = [...activeTutors].sort((a, b) => (b.tutorScore || 0) - (a.tutorScore || 0)).slice(0, 5);

  // Dynamic Location Lists
  const states = Array.from(new Set(activeTutors.map(t => t.state).filter(Boolean))).sort();
  const cities = Array.from(new Set(activeTutors.filter(t => filterState === "all" || t.state === filterState).map(t => t.city).filter(Boolean))).sort();

  const resetFilters = () => {
    setSearch("");
    setCity("all");
    setState("all");
    setSubject("");
    setScore("all");
    setPage(1);
  };

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1700px] mx-auto">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" /> Tutor Intelligence
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {tutors.filter(t => (t.step_reached || 0) >= 4).length} active tutors · {tutors.filter(t => (t.step_reached || 0) < 4).length} drop-offs · {totalActive} students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={fetchAll} className="h-8 text-[12px]"><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => setExport(true)} className="h-8 text-[12px]"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="h-8 bg-blue-600 hover:bg-blue-700 text-[12px]"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Tutor</Button>
        </div>
      </div>

      {/* ── KPI bar ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: GraduationCap, label: "Active Tutors", value: tutors.filter(t => (t.step_reached || 0) >= 4).length, color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
          { icon: Trophy,        label: "Top Performers", value: topCount,       color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          { icon: Users,         label: "Active Students", value: totalActive,   color: "bg-blue-50 border-blue-200 text-blue-700" },
          { icon: Target,        label: "Market Reach",   value: `${cities.length} Cities`, color: "bg-violet-50 border-violet-200 text-violet-700" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={cn("rounded-xl border p-4 flex items-center gap-3", color)}>
            <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center">
              {Icon === Teams ? <GraduationCap className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-[22px] font-black leading-none">{value}</p>
              <p className="text-[10px] font-semibold opacity-70 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Top Performers Highlight (pinned row) ─────────────────────── */}
      {top5.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[13px] font-black text-emerald-800">Top 5 Tutors This Month</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {top5.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setViewTutor(t)}
                className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-3 py-2 hover:shadow-sm transition-all hover:border-emerald-400 group"
              >
                <span className={cn("text-[11px] font-black shrink-0", i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-300")}>
                  #{i + 1}
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-black">
                  {(t.name || "?")[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-gray-900 leading-none">{t.name}</p>
                  <p className="text-[9px] text-gray-400">{t.city || "—"}</p>
                </div>
                <div className={cn("text-[11px] font-black px-2 py-0.5 rounded-md", TIER_CONFIG[t.tier as TutorTier]?.bg, TIER_CONFIG[t.tier as TutorTier]?.color)}>
                  {t.tutorScore}
                </div>
                <StarRow rating={t.avgRating || 0} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tier tabs + Filters ───────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-3">
        {/* Tier tabs */}
        <div className="flex gap-2 flex-wrap">
          {([
            { id: "all", label: "All Tutors",      count: activeTutors.length, color: "" },
            { id: "top", label: "🏆 Top (80+)",    count: topCount,      color: "text-emerald-700" },
            { id: "mid", label: "⚡ Mid (50–79)",  count: midCount,      color: "text-amber-700" },
            { id: "low", label: "🔴 Low (<50)",    count: lowCount,      color: "text-red-700" },
            { id: "dropoff", label: "⚠️ Drop-offs", count: tutors.filter(t => (t.step_reached || 0) < 4).length, color: "text-rose-700" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setPage(1); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all",
                tab === t.id ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
              )}>
              {t.label}
              <span className={cn("ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full",
                tab === t.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
              )}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input placeholder="Search name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="h-8 pl-7 w-[160px] text-[12px]" />
          </div>
          
          <Select value={filterState} onValueChange={v => { setState(v); setCity("all"); setPage(1); }}>
            <SelectTrigger className="h-8 w-[140px] text-[12px]"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map(s => (
                <SelectItem key={s} value={s}>
                  {s} ({activeTutors.filter(t => t.state === s).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCity} onValueChange={v => { setCity(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[140px] text-[12px]"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(c => (
                <SelectItem key={c} value={c}>
                  {c} ({activeTutors.filter(t => t.city === c).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Subject..." value={filterSubject} onChange={e => { setSubject(e.target.value); setPage(1); }} className="h-8 w-[120px] text-[12px]" />
          <Select value={filterScore} onValueChange={v => { setScore(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[120px] text-[12px]"><SelectValue placeholder="Score" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="80+">Top (80+)</SelectItem>
              <SelectItem value="50-79">Mid (50-79)</SelectItem>
              <SelectItem value="<50">Low (&lt;50)</SelectItem>
            </SelectContent>
          </Select>
          
          {(search || filterCity !== "all" || filterState !== "all" || filterSubject || filterScore !== "all") && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-[11px] font-bold text-rose-500 hover:bg-rose-50">
               Clear All
            </Button>
          )}

          <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
            <SelectTrigger className="h-8 w-[130px] text-[12px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Sort: Score ↓</SelectItem>
              <SelectItem value="rating">Sort: Rating ↓</SelectItem>
              <SelectItem value="active">Sort: Active ↓</SelectItem>
              <SelectItem value="newest">Sort: Newest</SelectItem>
              <SelectItem value="name">Sort: Name A–Z</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-[11px] text-gray-400 font-medium flex items-center">
            {sorted.length} results
          </div>
        </div>
      </div>

      {/* ── Tutor Grid ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[14px] font-bold text-gray-500">No tutors found</p>
          <p className="text-[12px] text-gray-400 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginated.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} onClick={() => setViewTutor(tutor)} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-8 text-[12px]">← Prev</Button>
              <span className="text-[12px] text-gray-500 font-medium">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-8 text-[12px]">Next →</Button>
            </div>
          )}
        </>
      )}

      {/* ── Legend ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 border-t pt-4">
        <span className="font-bold text-gray-700">Tutor Score formula:</span>
        <span>Success Rate × 40%</span>
        <span className="text-gray-300">+</span>
        <span>Rating × 30%</span>
        <span className="text-gray-300">+</span>
        <span>Retention × 30%</span>
        <span className="text-gray-300">·</span>
        <span className="text-emerald-600 font-bold">🟢 80+ = Top</span>
        <span className="text-amber-600 font-bold">🟡 50–79 = Mid</span>
        <span className="text-red-600 font-bold">🔴 &lt;50 = Low</span>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <AddEntryModal isOpen={addOpen} onClose={() => setAddOpen(false)} activeTab="tutor_registrations" onAdded={fetchAll} />
      <ExportModal   isOpen={exportOpen} onClose={() => setExport(false)} activeTab="tutor_registrations" />
      {viewTutor && (
        <TutorDrawer isOpen onClose={() => setViewTutor(null)} tutor={viewTutor} onEditClick={t => { setViewTutor(null); setEditTutor(t); }} />
      )}
      <EditTutorModal isOpen={!!editTutor} onClose={() => setEditTutor(null)} tutor={editTutor} onSuccess={fetchAll} />
    </div>
  );
}

// ── Placeholder for icon that doesn't exist in lucide ──────────────────────────
const Teams = GraduationCap;

