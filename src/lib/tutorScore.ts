/**
 * Tutor Intelligence Scoring Engine
 * Computes performance metrics and tutor score from assignment data.
 */

export interface TutorMetrics {
  totalAssigned:         number;
  trialsCompleted:       number;
  successfulConversions: number;
  activeStudents:        number;
  avgRating:             number;
  successRate:           number; // successfulConversions / trialsCompleted
  retentionRate:         number; // activeStudents / successfulConversions
  tutorScore:            number; // 0–100 composite
  tier:                  "Top" | "Mid" | "Low";
}

export type TutorTier = "Top" | "Mid" | "Low";

export const TIER_CONFIG: Record<TutorTier, { label: string; color: string; bg: string; border: string; ring: string }> = {
  Top: { label: "Top Performer", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", ring: "ring-emerald-200" },
  Mid: { label: "Mid Performer", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-300",   ring: "ring-amber-200"   },
  Low: { label: "Needs Support", color: "text-red-700",     bg: "bg-red-50",     border: "border-red-300",     ring: "ring-red-200"     },
};

/**
 * Compute metrics for a single tutor given their assignments.
 */
export function computeTutorMetrics(assignments: any[], ratingFromProfile: number): TutorMetrics {
  const totalAssigned         = assignments.length;
  const trialsCompleted       = assignments.filter(a => ["Completed", "Active", "Converted"].includes(a.status)).length;
  const successfulConversions = assignments.filter(a => ["Active", "Converted"].includes(a.status)).length;
  const activeStudents        = assignments.filter(a => a.status === "Active").length;

  const avgRating = ratingFromProfile || 0;

  const successRate  = trialsCompleted > 0       ? (successfulConversions / trialsCompleted) * 100    : 0;
  const retentionRate = successfulConversions > 0 ? (activeStudents / successfulConversions) * 100     : 0;

  // Composite tutor score (0–100)
  // Success Rate  → 40 pts (max)
  // Rating        → 30 pts (max)  [rating/5 * 30]
  // Retention     → 30 pts (max)
  const scoreSuccess   = Math.min(40, (successRate   / 100) * 40);
  const scoreRating    = Math.min(30, (avgRating / 5) * 30);
  const scoreRetention = Math.min(30, (retentionRate / 100) * 30);

  const tutorScore = Math.round(scoreSuccess + scoreRating + scoreRetention);

  const tier: TutorTier = tutorScore >= 80 ? "Top" : tutorScore >= 50 ? "Mid" : "Low";

  return {
    totalAssigned,
    trialsCompleted,
    successfulConversions,
    activeStudents,
    avgRating,
    successRate:   Math.round(successRate),
    retentionRate: Math.round(retentionRate),
    tutorScore,
    tier,
  };
}

/**
 * Merge metrics into a tutor object.
 */
export function enrichTutor(tutor: any, assignments: any[]): any {
  const rating  = parseFloat(tutor.rating) || 0;
  const metrics = computeTutorMetrics(assignments, rating);
  return { ...tutor, ...metrics };
}
