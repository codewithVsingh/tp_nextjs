/**
 * Smart Tutor Matching Engine — v2
 * ────────────────────────────────────────────────────────────────────────────
 * Score breakdown (max 100):
 *   Subject match           → 30 pts  (mandatory — 0 = excluded)
 *   Class match             → 20 pts
 *   Budget fit              → 15 pts
 *   Location proximity      → 15 pts
 *   Tutor Performance Score → 20 pts  (from tutorScore engine, normalised /100)
 *
 * Reason tags generated per match:
 *   "Best Match"         — matchScore >= 80
 *   "Subject Expert"     — subjects == 30/30
 *   "High Success Rate"  — tutor successRate >= 70%
 *   "Nearby"             — location == 15/15
 *   "Top Performer"      — tutorScore >= 80
 *   "Budget Friendly"    — budget == 15/15
 *   "Class Specialist"   — class == 20/20
 */

import { supabase } from "@/integrations/supabase/client";
import { computeTutorMetrics } from "@/modules/shared/logic/tutorScore";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MatchBreakdown {
  subjects:  number;   // 0–30
  class:     number;   // 0–20
  budget:    number;   // 0–15
  location:  number;   // 0–15
  tutorPerf: number;   // 0–20
}

export interface TutorMatch {
  tutor:          any;
  matchScore:     number;        // 0–100
  matchPct:       number;        // same, displayed as %
  breakdown:      MatchBreakdown;
  reasonTags:     string[];
  tutorMetrics:   ReturnType<typeof computeTutorMetrics>;
  alreadyAssigned: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toArr = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

const norm = (s: string) => s.toLowerCase().trim();

function parseBudget(str: string | null | undefined): number {
  if (!str) return 0;
  const b = str.replace(/[₹,\s]/g, "");
  const above = b.match(/above(\d+)|(\d+)\+/i);
  if (above) return parseInt(above[1] || above[2]);
  const range = b.match(/(\d+)[–\-](\d+)/);
  if (range) return (parseInt(range[1]) + parseInt(range[2])) / 2;
  const plain = b.match(/(\d+)/);
  if (plain) return parseInt(plain[1]);
  return 0;
}

// ─── Individual dimension scorers ─────────────────────────────────────────────
function scoreSubject(leadSubs: string[], tutorSubs: string[]): number {
  if (!leadSubs.length || !tutorSubs.length) return 0;
  const ls = leadSubs.map(norm);
  const ts = tutorSubs.map(norm);
  const hits = ls.filter(l => ts.some(t => t.includes(l) || l.includes(t)));
  if (hits.length === 0) return 0;
  return hits.length === ls.length ? 30 : 18;
}

function scoreClass(leadClass: string, tutorClasses: string[]): number {
  if (!leadClass || !tutorClasses.length) return 0;
  const lc = norm(leadClass);
  return tutorClasses.some(c => norm(c).includes(lc) || lc.includes(norm(c))) ? 20 : 0;
}

function scoreBudget(leadBudget: number, tutorMin: number, tutorMax: number): number {
  if (leadBudget === 0 && tutorMin === 0) return 8;
  if (leadBudget === 0 || (tutorMin === 0 && tutorMax === 0)) return 4;
  if (leadBudget >= tutorMin && (tutorMax === 0 || leadBudget <= tutorMax)) return 15;
  if (Math.abs(leadBudget - tutorMin) / Math.max(tutorMin, 1) <= 0.2) return 8;
  return 0;
}

function scoreLocation(leadCity: string | null, tutorCity: string | null, prefLocs: string | null): number {
  if (!leadCity) return 0;
  const lc = norm(leadCity);
  if (tutorCity && norm(tutorCity) === lc) return 15;
  if (prefLocs && norm(prefLocs).includes(lc)) return 10;
  return 0;
}

function scoreTutorPerf(tutorScore: number): number {
  // tutorScore is 0–100; we map it to 0–20 pts
  return Math.round((tutorScore / 100) * 20);
}

// ─── Reason tag generator ─────────────────────────────────────────────────────
function generateTags(
  bd: MatchBreakdown,
  matchScore: number,
  metrics: ReturnType<typeof computeTutorMetrics>,
): string[] {
  const tags: string[] = [];
  if (matchScore >= 80)              tags.push("Best Match");
  if (bd.subjects >= 30)             tags.push("Subject Expert");
  if (metrics.successRate >= 70)     tags.push("High Success Rate");
  if (bd.location >= 15)             tags.push("Nearby");
  if (metrics.tutorScore >= 80)      tags.push("Top Performer");
  if (bd.budget >= 15)               tags.push("Budget Friendly");
  if (bd.class >= 20)                tags.push("Class Specialist");
  return tags.slice(0, 4); // cap at 4 tags
}

// ─── Main Matcher ─────────────────────────────────────────────────────────────
export async function getSmartTutorMatches(
  leadRecord: any,
  topN = 10,
): Promise<any[]> {
  const { data, error } = await supabase.rpc('match_tutors_for_params', {
    p_subject: (Array.isArray(leadRecord.subjects) ? leadRecord.subjects[0] : leadRecord.subjects) || null,
    p_area_slug: leadRecord.area || null,
    p_class_label: leadRecord.class_level || null,
    p_board_name: leadRecord.board || null
  });

  if (error) {
    console.error("RPC Match Error:", error);
    return [];
  }

  // Map to UI friendly format
  return (data || []).map((m: any) => ({
    id: m.tutor_id,
    name: m.tutor_name,
    phone: m.phone,
    matchScore: m.match_score,
    matchReasons: m.match_reasons,
    city: m.city,
    experience: m.experience,
    qualification: m.qualification,
    expected_fees: m.expected_fees,
    teaching_mode: m.teaching_mode,
    step_reached: m.step_reached,
    status: m.status,
    created_at: m.created_at,
    subjects: Array.isArray(leadRecord.subjects) ? leadRecord.subjects : [leadRecord.subjects]
  }));
}

/** Fetch all assignments for a lead (history) */
export async function getLeadAssignmentHistory(leadId: string): Promise<any[]> {
  const { data } = await supabase
    .from("lead_tutor_assignments")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  return data || [];
}

/** Fetch tutors already assigned (active) to a lead */
export async function getAssignedTutors(leadId: string): Promise<any[]> {
  const { data } = await supabase
    .from("lead_tutor_assignments")
    .select("*, tutor:tutor_id (id, name, phone, subjects, city, expected_fees, rating, teaching_mode, experience)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  return data || [];
}

