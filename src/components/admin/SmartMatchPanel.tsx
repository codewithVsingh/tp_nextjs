/**
 * SmartMatchPanel — Card-based tutor recommendation panel for a lead.
 * Shows Top 5 recommended tutors with match %, reason tags, metric breakdown,
 * and an Assign button with manual override support.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, MapPin, CheckCircle, Loader2, Zap, Users,
  TrendingUp, AlertCircle, Link2, Clock, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getSmartTutorMatches, getLeadAssignmentHistory, TutorMatch } from "@/modules/shared/logic/tutorMatcher";
import { TIER_CONFIG, TutorTier } from "@/modules/shared/logic/tutorScore";
import { format, parseISO } from "date-fns";

// ─── Reason tag colour map ────────────────────────────────────────────────────
const TAG_STYLES: Record<string, string> = {
  "Best Match":       "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Subject Expert":   "bg-blue-100 text-blue-700 border-blue-200",
  "High Success Rate":"bg-violet-100 text-violet-700 border-violet-200",
  "Nearby":           "bg-teal-100 text-teal-700 border-teal-200",
  "Top Performer":    "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Budget Friendly":  "bg-amber-100 text-amber-700 border-amber-200",
  "Class Specialist": "bg-orange-100 text-orange-700 border-orange-200",
};

// ─── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={cn("w-3 h-3", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200")} />
    ))}
    {rating > 0 && <span className="text-[10px] text-gray-400 ml-1">{rating.toFixed(1)}</span>}
  </div>
);

// ─── Match arc / ring ─────────────────────────────────────────────────────────
const MatchRing = ({ pct, isBest }: { pct: number; isBest: boolean }) => {
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#6366f1";
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 52 52" className="w-full h-full -rotate-90">
        <circle cx="26" cy="26" r={r} stroke="#f1f5f9" strokeWidth="5" fill="none" />
        <circle cx="26" cy="26" r={r} stroke={color} strokeWidth="5" fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[12px] font-black text-gray-900 leading-none">{pct}%</span>
        {isBest && <Zap className="w-3 h-3 text-amber-500 mt-0.5" />}
      </div>
    </div>
  );
};

// ─── Breakdown mini-bar ───────────────────────────────────────────────────────
const BreakBar = ({ label, pts, max, color }: { label: string; pts: number; max: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[9px] text-gray-400 w-16 shrink-0 font-medium">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${(pts / max) * 100}%` }} />
    </div>
    <span className="text-[9px] font-black text-gray-600 w-8 text-right">{pts}/{max}</span>
  </div>
);

// ─── Single tutor match card ───────────────────────────────────────────────────
const MatchCard = ({
  match, rank, leadId, leadName, onAssigned,
}: {
  match: TutorMatch; rank: number; leadId: string; leadName: string; onAssigned(): void;
}) => {
  const [assigning, setAssigning] = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const isBest = rank === 0;
  const tierCfg = TIER_CONFIG[match.tutorMetrics.tier as TutorTier];

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const { error } = await supabase.from("lead_tutor_assignments").insert({
        lead_id:    leadId,
        lead_name:  leadName,
        lead_phone: null,
        tutor_id:   match.tutor.id,
        tutor_name: match.tutor.name,
        tutor_phone: match.tutor.phone || null,
        class_level: null,
        fee:        match.tutor.expected_fees || null,
        status:     "Active",
        notes:      `Smart-matched · Score ${match.matchScore}/100 · ${match.reasonTags.join(", ")}`,
      });
      if (error) throw error;
      toast.success(`${match.tutor.name} assigned ✓`);
      onAssigned();
    } catch (e: any) {
      toast.error("Assignment failed: " + e.message);
    } finally { setAssigning(false); }
  };

  return (
    <div className={cn(
      "bg-white border rounded-xl overflow-hidden transition-all",
      isBest ? "border-indigo-300 ring-2 ring-indigo-100 shadow-md" : "border-gray-200 shadow-sm hover:shadow-md",
      match.alreadyAssigned && "opacity-60",
    )}>
      {/* Best label ribbon */}
      {isBest && (
        <div className="bg-indigo-600 text-white text-[9px] font-black px-3 py-0.5 flex items-center gap-1.5">
          <Zap className="w-2.5 h-2.5" /> TOP RECOMMENDATION
        </div>
      )}

      <div className="p-4">
        {/* Main row */}
        <div className="flex items-start gap-3">
          {/* Ring */}
          <MatchRing pct={match.matchPct} isBest={isBest} />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-black text-gray-900">{match.tutor.name}</p>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", tierCfg.bg, tierCfg.color, tierCfg.border)}>
                {match.tutorMetrics.tutorScore}/100
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{match.tutor.city || "—"}</span>
              <Stars rating={match.tutor.rating || 0} />
            </div>

            {/* Subjects */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(Array.isArray(match.tutor.subjects) ? match.tutor.subjects : []).slice(0, 3).map((s: string) => (
                <span key={s} className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>

            {/* Reason tags */}
            {match.reasonTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {match.reasonTags.map(tag => (
                  <span key={tag} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", TAG_STYLES[tag] || "bg-gray-100 text-gray-600 border-gray-200")}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Assign button */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {match.alreadyAssigned ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> Assigned
              </span>
            ) : (
              <Button size="sm" onClick={handleAssign} disabled={assigning}
                className={cn("h-7 text-[11px] font-bold", isBest ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-700 hover:bg-gray-800")}>
                {assigning ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Link2 className="w-3 h-3 mr-1" />}
                Assign
              </Button>
            )}
            <button onClick={() => setExpanded(e => !e)} className="text-[9px] text-gray-400 hover:text-indigo-500 font-semibold">
              {expanded ? "Less ↑" : "Details ↓"}
            </button>
          </div>
        </div>

        {/* Expanded breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Score Breakdown</p>
            <BreakBar label="Subject"     pts={match.breakdown.subjects}  max={30} color="bg-blue-400" />
            <BreakBar label="Class"       pts={match.breakdown.class}     max={20} color="bg-violet-400" />
            <BreakBar label="Budget"      pts={match.breakdown.budget}    max={15} color="bg-amber-400" />
            <BreakBar label="Location"    pts={match.breakdown.location}  max={15} color="bg-teal-400" />
            <BreakBar label="Tutor Perf." pts={match.breakdown.tutorPerf} max={20} color="bg-emerald-400" />

            <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-gray-100">
              {[
                { label: "Active", value: match.tutorMetrics.activeStudents },
                { label: "Success%", value: `${match.tutorMetrics.successRate}%` },
                { label: "Retention", value: `${match.tutorMetrics.retentionRate}%` },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 rounded-lg px-2 py-1.5 text-center border border-gray-100">
                  <p className="text-[13px] font-black text-gray-800">{m.value}</p>
                  <p className="text-[8px] text-gray-400 font-semibold">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Assignment history row ───────────────────────────────────────────────────
const HistoryRow = ({ a }: { a: any }) => {
  const STATUS_COLOR: Record<string, string> = {
    Active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    Completed: "bg-blue-50 text-blue-700 border-blue-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="w-2 h-2 rounded-full shrink-0 bg-blue-400" />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-gray-900 truncate">{a.tutor_name || "—"}</p>
        <p className="text-[10px] text-gray-400">{a.start_date ? format(parseISO(a.start_date), "dd MMM yy") : "—"} · {a.class_level || "—"}</p>
      </div>
      {a.fee && <span className="text-[11px] font-bold text-emerald-700 shrink-0">₹{a.fee}/mo</span>}
      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0", STATUS_COLOR[a.status] || "bg-gray-50 text-gray-500 border-gray-200")}>{a.status}</span>
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────
interface Props {
  lead: any;             // The selected lead
  onClose(): void;
}

export const SmartMatchPanel = ({ lead, onClose }: Props) => {
  const [tab, setTab]         = useState<"matches"|"history">("matches");
  const [matches, setMatches] = useState<TutorMatch[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, h] = await Promise.all([
        getSmartTutorMatches(lead, 5),
        getLeadAssignmentHistory(lead.id),
      ]);
      setMatches(m);
      setHistory(h);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [lead?.id]);

  useEffect(() => { if (lead?.id) loadAll(); }, [loadAll]);

  const subjects = Array.isArray(lead.subjects) ? lead.subjects : (lead.subjects ? [lead.subjects] : []);

  return (
    <div className="h-full flex flex-col bg-[#F4F6FA] overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-5 py-4 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-black text-[14px]">
                {(lead.name || "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-[15px] font-black text-gray-900 leading-tight">{lead.name}</p>
                <p className="text-[11px] text-gray-400">{lead.phone} · {lead.city || "—"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {subjects.slice(0, 4).map((s: string) => (
                <span key={s} className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">{s}</span>
              ))}
              {lead.class_level && (
                <span className="text-[9px] font-bold bg-violet-50 text-violet-700 border border-violet-100 px-1.5 py-0.5 rounded">Class {lead.class_level}</span>
              )}
              {lead.budget && (
                <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded">₹{lead.budget}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-bold text-[18px] leading-none mt-0.5">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setTab("matches")}
            className={cn("flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5",
              tab === "matches" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            <Zap className="w-3 h-3" /> Smart Matches
          </button>
          <button onClick={() => setTab("history")}
            className={cn("flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5",
              tab === "history" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            <Clock className="w-3 h-3" /> History
            {history.length > 0 && <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-1.5 rounded-full">{history.length}</span>}
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
            <p className="text-[12px] text-gray-400 font-medium">Running match algorithm…</p>
          </div>
        ) : tab === "matches" ? (
          <>
            {matches.length === 0 ? (
              <div className="text-center py-12 bg-white border border-dashed rounded-xl">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[13px] font-bold text-gray-500">No subject matches found</p>
                <p className="text-[11px] text-gray-400 mt-1">Add subjects to this lead to enable smart matching.</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                  {matches.length} recommended tutors · Subject match required
                </p>
                {matches.map((m, i) => (
                  <MatchCard
                    key={m.tutor.id}
                    match={m}
                    rank={i}
                    leadId={lead.id}
                    leadName={lead.name}
                    onAssigned={loadAll}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white border border-dashed rounded-xl">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[13px] font-bold text-gray-500">No past assignments</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">{history.length} past assignments</p>
                <div className="space-y-1.5">
                  {history.map(a => <HistoryRow key={a.id} a={a} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        <p className="text-[9px] text-gray-400 text-center">
          Score = Subject(30) + Class(20) + Budget(15) + Location(15) + Tutor Perf.(20)
        </p>
      </div>
    </div>
  );
};

