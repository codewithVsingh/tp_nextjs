/**
 * LeadIntelligence: The Authoritative Domain Model for Admin Leads.
 * Handles Lead Scoring, Temperature Mapping, and Business Rules.
 * Satisfies the "Domain Layer" requirement for system maturity.
 */

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface LeadScoreResult {
  score: number;
  temperature: LeadTemperature;
  breakdown: Record<string, number>;
}

export class LeadIntelligence {
  private static HIGH_BUDGET_PATTERNS = ['above ₹3000', '3000+', '>3000'];
  private static MID_BUDGET_PATTERNS = ['₹1500', '2000', '2500', '1500-3000'];
  private static CRITICAL_CLASSES = ['10', '12', 'JEE', 'NEET'];

  /**
   * Domain Logic: Resolve the final heat score for a lead.
   */
  static resolveScore(lead: any): number {
    // If we have a non-zero score in the data, use it. 
    // Otherwise, calculate it dynamically from available signals.
    if (typeof lead.lead_score === 'number' && lead.lead_score > 0) return lead.lead_score;
    return this.calculateFullAnalysis(lead).score;
  }

  /**
   * Domain Logic: Resolve the final temperature label.
   */
  static resolveTemperature(lead: any): LeadTemperature {
    // Check if we have a valid temperature label in the data.
    if (lead.lead_temperature && ['Hot', 'Warm', 'Cold'].includes(lead.lead_temperature)) {
      return lead.lead_temperature as LeadTemperature;
    }
    // If not, calculate it from the analysis (which also handles the score sync).
    return this.calculateFullAnalysis(lead).temperature;
  }

  /**
   * Internal Engine: Computes the 0-100 score based on business heuristics.
   */
  private static calculateFullAnalysis(lead: any): LeadScoreResult {
    const breakdown: Record<string, number> = {};

    // 1. Budget Analysis
    const budget = (lead.budget || '').toLowerCase();
    if (this.HIGH_BUDGET_PATTERNS.some(p => budget.includes(p.toLowerCase()))) {
      breakdown['high_budget'] = 25;
    } else if (this.MID_BUDGET_PATTERNS.some(p => budget.includes(p.toLowerCase()))) {
      breakdown['mid_budget'] = 15;
    }

    // 2. Academic Urgency (Class Level)
    const cls = (lead.class_level || '').toLowerCase();
    if (this.CRITICAL_CLASSES.some(p => cls.includes(p.toLowerCase()))) {
      breakdown['critical_exam_year'] = 30;
    }

    // 3. Geographic Relevance
    if (lead.city && lead.city.trim().length > 0) {
      breakdown['serviceable_city'] = 15;
    }

    // 4. Intent Signals
    const urgency = (lead.urgency || '').toLowerCase();
    if (urgency.includes('asap') || urgency.includes('immediate')) {
      breakdown['high_intent'] = 30;
    }

    const raw = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    const score = Math.min(100, Math.max(0, raw));

    let temperature: LeadTemperature = 'Cold';
    if (score >= 70) temperature = 'Hot';
    else if (score >= 40) temperature = 'Warm';

    return { score, temperature, breakdown };
  }

  static getVisuals(temp: LeadTemperature) {
    switch (temp) {
      case 'Hot':  return { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    emoji: '🔴' };
      case 'Warm': return { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  emoji: '🟡' };
      case 'Cold': return { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-200',  emoji: '⚪' };
    }
  }
}
