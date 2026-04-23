import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  Paperclip, Edit, UserCircle2, MapPin, Download, Star,
  GraduationCap, BarChart3, Users, IndianRupee, Loader2,
  TrendingUp, Target, CheckCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { computeTutorMetrics, TIER_CONFIG, TutorTier } from "@/lib/tutorScore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tutor: any | null;
  onEditClick: (tutor: any) => void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={cn("w-3.5 h-3.5", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200")} />
    ))}
    {rating > 0 && <span className="text-[11px] text-gray-400 ml-1">{rating.toFixed(1)}</span>}
  </div>
);

const StatCard = ({ label, value, sub, color }: { label: string; value: string|number; sub?: string; color: string }) => (
  <div className={cn("rounded-xl border p-3 text-center", color)}>
    <p className="text-[22px] font-black leading-none">{value}</p>
    <p className="text-[10px] font-bold uppercase tracking-wide mt-1 opacity-70">{label}</p>
    {sub && <p className="text-[9px] opacity-50 mt-0.5">{sub}</p>}
  </div>
);

const ScoreBar = ({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-semibold text-gray-600">{label}</span>
      <span className="text-[11px] font-black text-gray-900">{value}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  </div>
);

const InfoRow = ({ label, value, highlight }: { label: string; value: string; highlight?: string }) => (
  <div className={cn("p-3 rounded-lg border", highlight || "bg-gray-50 border-gray-100")}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
    <p className="text-[13px] font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",     label: "Overview",     icon: UserCircle2 },
  { id: "performance",  label: "Performance",  icon: BarChart3   },
  { id: "students",     label: "Students",     icon: Users       },
  { id: "payments",     label: "Payments",     icon: IndianRupee },
] as const;
type TabId = typeof TABS[number]["id"];

export const TutorDrawer = ({ isOpen, onClose, tutor, onEditClick }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [payments, setPayments]       = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && tutor?.id) {
      setActiveTab("overview");
      loadTutorData(tutor.id);
    }
  }, [isOpen, tutor?.id]);

  const loadTutorData = async (tutorId: string) => {
    setLoadingData(true);
    try {
      const [aRes, pRes] = await Promise.all([
        supabase.from("lead_tutor_assignments").select("*").eq("tutor_id", tutorId).order("start_date", { ascending: false }),
        supabase.from("payments").select("*").eq("tutor_id", tutorId).order("created_at", { ascending: false }).limit(20),
      ]);
      setAssignments(aRes.data || []);
      setPayments(pRes.data || []);
    } catch (_) {}
    finally { setLoadingData(false); }
  };

  const handleDownload = (fileName: string, label: string) => {
    if (!fileName) return;
    const content = `Tutors Parliament Platform\n\nDocument: ${label}\nFile: ${fileName}\n\n[Production: live file bytes would be streamed from Supabase Storage.]`;
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = fileName.includes(".") ? fileName : `${fileName}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloading ${label}...`);
  };

  if (!tutor) return null;

  const rating  = parseFloat(tutor.rating) || 0;
  const metrics = computeTutorMetrics(assignments, rating);
  const tierCfg = TIER_CONFIG[metrics.tier as TutorTier];
  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : [];

  const paidTotal    = payments.filter(p => p.status === "Paid").reduce((a, p) => a + (p.amount || 0), 0);
  const earningsPaid = payments.filter(p => p.payout_status === "Paid").reduce((a, p) => a + (p.tutor_payout_amount || 0), 0);
  const payoutsDue   = payments.filter(p => p.payout_status === "Pending").reduce((a, p) => a + (p.tutor_payout_amount || 0), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col bg-[#F4F6FA] p-0 border-l border-gray-200">

        {/* ── Sticky header ─────────────────────────────────────────── */}
        <div className="bg-white border-b px-5 py-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl shrink-0">
                {(tutor.name || "?")[0].toUpperCase()}
              </div>
              <div>
                <SheetTitle className="text-[16px] font-black text-gray-900 leading-tight">{tutor.name}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" />{tutor.city || "—"}</span>
                  <StarRow rating={rating} />
                </div>
              </div>
            </div>

            {/* Score badge */}
            <div className="flex flex-col items-end gap-1.5">
              <div className={cn("px-3 py-1.5 rounded-xl border-2 font-black text-center", tierCfg.bg, tierCfg.border, tierCfg.color)}>
                <p className="text-[22px] leading-none">{metrics.tutorScore}</p>
                <p className="text-[8px] font-bold opacity-60">/ 100</p>
              </div>
              <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border", tierCfg.bg, tierCfg.border, tierCfg.color)}>
                {tierCfg.label}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 mt-4 bg-gray-100 rounded-lg p-1">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-bold transition-all",
                    activeTab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}>
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {loadingData && (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
          )}

          {/* ── OVERVIEW ─────────────────────────────────────────── */}
          {activeTab === "overview" && !loadingData && (
            <>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Active"  value={metrics.activeStudents}        color="bg-emerald-50 border-emerald-200 text-emerald-700" />
                <StatCard label="Assigned" value={metrics.totalAssigned}        color="bg-indigo-50 border-indigo-200 text-indigo-700" />
                <StatCard label="Converted" value={metrics.successfulConversions} color="bg-violet-50 border-violet-200 text-violet-700" />
              </div>

              {/* Profile info */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50/80 flex items-center gap-2 font-bold text-[13px] text-gray-700">
                  <GraduationCap className="w-4 h-4 text-blue-500" /> Profile
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  <InfoRow label="Gender"        value={tutor.gender || ""} />
                  <InfoRow label="Age"           value={tutor.age ? `${tutor.age} yrs` : ""} />
                  <InfoRow label="Experience"    value={tutor.experience || ""} />
                  <InfoRow label="Comm Level"    value={tutor.communication_level || ""} />
                  <InfoRow label="Qualification" value={tutor.qualification || ""} highlight="bg-blue-50 border-blue-100" />
                  <InfoRow label="Mode"          value={tutor.teaching_mode || ""} />
                  <InfoRow label="Expected Fee"  value={tutor.expected_fees ? `₹${tutor.expected_fees}` : ""} highlight="bg-emerald-50 border-emerald-100" />
                  <InfoRow label="Phone"         value={tutor.phone || ""} />
                </div>
                {subjects.length > 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-1">
                      {subjects.map((s: string) => <span key={s} className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50/80 flex items-center gap-2 font-bold text-[13px] text-gray-700">
                  <Paperclip className="w-4 h-4 text-orange-500" /> Documents
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: "Profile Photo", key: "photo_name",    color: "bg-gray-100", textColor: "text-gray-500", fileLabel: "IMG"},
                    { label: "Resume / CV",   key: "resume_name",   color: "bg-blue-100", textColor: "text-blue-600", fileLabel: "PDF"},
                    { label: "ID Proof",      key: "id_proof_name", color: "bg-orange-100", textColor: "text-orange-600", fileLabel: "ID"},
                  ].map(doc => (
                    <div key={doc.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0", doc.color, doc.textColor)}>
                        {doc.fileLabel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-900">{doc.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">{tutor[doc.key] || "No file uploaded"}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(tutor[doc.key], doc.label)} disabled={!tutor[doc.key]} className="h-7 text-[11px] shrink-0">
                        <Download className="w-3 h-3 mr-1" /> Get
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit */}
              <Button variant="outline" onClick={() => onEditClick(tutor)} className="w-full h-9 text-[13px] font-bold text-blue-700 border-blue-200 hover:bg-blue-50">
                <Edit className="w-4 h-4 mr-2" /> Edit Tutor Profile
              </Button>
            </>
          )}

          {/* ── PERFORMANCE ──────────────────────────────────────── */}
          {activeTab === "performance" && !loadingData && (
            <>
              {/* Score breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-[13px] font-black text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> Score Breakdown</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="font-semibold text-gray-600">Success Rate (×40%)</span><span className="font-black">{metrics.successRate}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${metrics.successRate}%` }} /></div>
                    <p className="text-[9px] text-gray-400 mt-0.5">Contributes {Math.round((metrics.successRate / 100) * 40)} / 40 pts</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="font-semibold text-gray-600">Rating (×30%)</span><span className="font-black">{metrics.avgRating.toFixed(1)} / 5</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${(metrics.avgRating / 5) * 100}%` }} /></div>
                    <p className="text-[9px] text-gray-400 mt-0.5">Contributes {Math.round((metrics.avgRating / 5) * 30)} / 30 pts</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="font-semibold text-gray-600">Retention Rate (×30%)</span><span className="font-black">{metrics.retentionRate}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics.retentionRate}%` }} /></div>
                    <p className="text-[9px] text-gray-400 mt-0.5">Contributes {Math.round((metrics.retentionRate / 100) * 30)} / 30 pts</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <span className="text-[12px] font-bold text-gray-600">Total Score</span>
                  <div className={cn("text-[20px] font-black px-3 py-1 rounded-xl border-2", tierCfg.bg, tierCfg.border, tierCfg.color)}>
                    {metrics.tutorScore} <span className="text-[10px] opacity-60">/ 100</span>
                  </div>
                </div>
              </div>

              {/* All metrics */}
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Trials Completed"  value={metrics.trialsCompleted}       color="bg-blue-50 border-blue-200 text-blue-700" />
                <StatCard label="Conversions"        value={metrics.successfulConversions} color="bg-violet-50 border-violet-200 text-violet-700" />
                <StatCard label="Active Students"    value={metrics.activeStudents}        color="bg-emerald-50 border-emerald-200 text-emerald-700" />
                <StatCard label="Total Assigned"     value={metrics.totalAssigned}         color="bg-indigo-50 border-indigo-200 text-indigo-700" />
                <StatCard label="Success Rate"       value={`${metrics.successRate}%`}     color="bg-violet-50 border-violet-200 text-violet-700" sub="Conv / Completed" />
                <StatCard label="Retention Rate"     value={`${metrics.retentionRate}%`}   color="bg-amber-50 border-amber-200 text-amber-700" sub="Active / Converted" />
              </div>
            </>
          )}

          {/* ── STUDENTS ─────────────────────────────────────────── */}
          {activeTab === "students" && !loadingData && (
            <div className="space-y-2">
              {assignments.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed rounded-xl">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-[13px] font-bold text-gray-500">No assignments yet</p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] text-gray-400 font-semibold">{assignments.length} total assignments</p>
                  {assignments.map(a => {
                    const statusColor =
                      a.status === "Active"    ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      a.status === "Completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      a.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-gray-50 text-gray-600 border-gray-200";
                    return (
                      <div key={a.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                          {(a.lead_name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 truncate">{a.lead_name || "—"}</p>
                          <p className="text-[10px] text-gray-400">{a.class_level || "—"} · {a.start_date ? format(parseISO(a.start_date), "dd MMM yy") : "—"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.fee && <span className="text-[11px] font-bold text-emerald-700">₹{a.fee}/mo</span>}
                          <Badge variant="outline" className={cn("text-[9px] h-5 font-bold border", statusColor)}>{a.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* ── PAYMENTS ─────────────────────────────────────────── */}
          {activeTab === "payments" && !loadingData && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Total Earning"  value={`₹${earningsPaid.toLocaleString("en-IN")}`} color="bg-emerald-50 border-emerald-200 text-emerald-700" sub="Paid payouts" />
                <StatCard label="Payouts Due"   value={`₹${payoutsDue.toLocaleString("en-IN")}`}   color="bg-amber-50 border-amber-200 text-amber-700"    sub="Pending" />
                <StatCard label="Total Revenue"  value={`₹${paidTotal.toLocaleString("en-IN")}`}    color="bg-indigo-50 border-indigo-200 text-indigo-700"  sub="Total collected" />
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed rounded-xl">
                  <IndianRupee className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-[13px] font-bold text-gray-500">No payments logged</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {payments.map(p => {
                    const statusColor =
                      p.status === "Paid"    ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      p.status === "Overdue" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-amber-50 text-amber-700 border-amber-200";
                    
                    const payoutColor = p.payout_status === "Paid" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100";

                    return (
                      <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900">{p.month || "—"}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{p.lead_name || "—"}</p>
                             <span className="text-[10px] text-gray-300">•</span>
                             <Badge variant="outline" className={cn("text-[8px] h-4 font-bold border shrink-0", statusColor)}>{p.status}</Badge>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-black text-gray-900">₹{(p.tutor_payout_amount || (p.amount * 0.5)).toLocaleString("en-IN")}</p>
                          <div className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 flex items-center justify-center gap-1", payoutColor)}>
                            {p.payout_status === "Paid" ? <CheckCircle className="w-2 h-2" /> : <Clock className="w-2 h-2" />}
                            Payout {p.payout_status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
