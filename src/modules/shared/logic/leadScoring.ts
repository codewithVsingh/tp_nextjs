/**
 * Lead Scoring System
 * Computes a 0-100 score and assigns a temperature (Hot / Warm / Cold)
 * based on the lead's profile fields.
 *
 * Scoring Rules:
 *  Budget > ₹3000        → +25
 *  Budget ₹1500–3000     → +15
 *  Class 10 / 12         → +20
 *  Urgent (within 3 days)→ +25
 *  Home Tuition mode     → +10
 *  City is filled        → +10
 *  Maximum capped at 100
 */

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface LeadScoreResult {
  score: number;
  temperature: LeadTemperature;
  breakdown: Record<string, number>;
}

/** Known high-budget string values that come from the lead capture flow or manual entry */
const HIGH_BUDGET_PATTERNS  = ['above ₹3000', 'above 3000', '3000+', '>3000'];
const MID_BUDGET_PATTERNS   = ['₹1500', '1500', '2000', '2500', '1500-3000', '1500–3000'];

function matchesBudget(budget: string | null | undefined, patterns: string[]): boolean {
  if (!budget) return false;
  const b = budget.toLowerCase().trim();
  return patterns.some(p => b.includes(p.toLowerCase()));
}

function isHighBudget(budget: string | null | undefined): boolean {
  return matchesBudget(budget, HIGH_BUDGET_PATTERNS);
}

function isMidBudget(budget: string | null | undefined): boolean {
  // Don't double-count high budget leads
  if (isHighBudget(budget)) return false;
  return matchesBudget(budget, MID_BUDGET_PATTERNS);
}

function isCriticalClass(classLevel: string | null | undefined): boolean {
  if (!classLevel) return false;
  const c = classLevel.toLowerCase();
  return c.includes('10') || c.includes('12');
}

function isUrgent(urgency: string | null | undefined, startTime?: string | null | undefined): boolean {
  const u = (urgency || '').toLowerCase();
  const s = (startTime || '').toLowerCase();
  return (
    u.includes('within 3') ||
    u.includes('urgent') ||
    u.includes('asap') ||
    s.includes('asap') ||
    s.includes('urgent') ||
    s.includes('immediately')
  );
}

function isHomeTuition(mode: string | null | undefined): boolean {
  if (!mode) return false;
  return mode.toLowerCase().includes('home');
}

function hasCity(city: string | null | undefined): boolean {
  return !!(city && city.trim().length > 0);
}

export function calculateLeadScore(lead: {
  budget?: string | null;
  class_level?: string | null;
  urgency?: string | null;
  start_time?: string | null;
  mode?: string | null;
  city?: string | null;
}): LeadScoreResult {
  const breakdown: Record<string, number> = {};

  // Budget scoring
  if (isHighBudget(lead.budget)) {
    breakdown['budget_high'] = 25;
  } else if (isMidBudget(lead.budget)) {
    breakdown['budget_mid'] = 15;
  }

  // Class scoring
  if (isCriticalClass(lead.class_level)) {
    breakdown['class_critical'] = 20;
  }

  // Urgency scoring
  if (isUrgent(lead.urgency, lead.start_time)) {
    breakdown['urgency'] = 25;
  }

  // Mode scoring
  if (isHomeTuition(lead.mode)) {
    breakdown['home_tuition'] = 10;
  }

  // City scoring
  if (hasCity(lead.city)) {
    breakdown['serviceable_city'] = 10;
  }

  const raw = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const score = Math.min(100, Math.max(0, raw));

  let temperature: LeadTemperature;
  if (score >= 70) temperature = 'Hot';
  else if (score >= 40) temperature = 'Warm';
  else temperature = 'Cold';

  return { score, temperature, breakdown };
}

export function getTemperatureColor(temp: LeadTemperature) {
  switch (temp) {
    case 'Hot':  return { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    };
    case 'Warm': return { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  };
    case 'Cold': return { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-200',  dot: 'bg-slate-400'  };
  }
}

export function getTemperatureEmoji(temp: LeadTemperature) {
  switch (temp) {
    case 'Hot':  return '🔴';
    case 'Warm': return '🟡';
    case 'Cold': return '⚪';
  }
}

/** Utility: given the raw DB row, return the best temperature (DB value or re-computed) */
export function resolveTemperature(lead: any): LeadTemperature {
  if (lead.lead_temperature && ['Hot', 'Warm', 'Cold'].includes(lead.lead_temperature)) {
    return lead.lead_temperature as LeadTemperature;
  }
  return calculateLeadScore(lead).temperature;
}

/** Utility: given the raw DB row, return the best score (DB value or re-computed) */
export function resolveScore(lead: any): number {
  if (typeof lead.lead_score === 'number') return lead.lead_score;
  return calculateLeadScore(lead).score;
}

