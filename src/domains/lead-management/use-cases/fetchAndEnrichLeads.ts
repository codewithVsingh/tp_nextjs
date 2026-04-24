import { leadsService } from "../services/leadsService";
import { LeadIntelligence } from "../domain/leadIntelligence";

/**
 * Use Case: FetchAndEnrichLeads
 * Orchestrates the fetching of raw data and the application of domain intelligence.
 * This is the "Service Orchestrator" that keeps hooks clean.
 */
export async function fetchAndEnrichLeads(params: {
  page: number;
  pageSize: number;
  filterStatus: string;
  filterCity: string;
  dateRange: any;
  sortByScore: boolean;
  filterTemperature: string;
}) {
  // 1. Fetch raw data from Service
  const { data: leads, count: leadsCount } = await leadsService.fetchLeads(params);

  // 2. Optional: Fetch demo bookings if on page 1
  let demoLeads: any[] = [];
  let totalDemos = 0;
  if (params.page === 1) {
    const { data: dRows, count: dCount } = await leadsService.fetchDemoBookings(params.dateRange);
    demoLeads = (dRows || []).map(r => ({ ...r, source: r.source || "demo_booking_page" }));
    totalDemos = dCount || 0;
  }

  const combined = [...(leads || []), ...demoLeads];

  // 3. Apply Domain Intelligence
  let enriched = combined.map(row => ({
    ...row,
    lead_score: LeadIntelligence.resolveScore(row),
    lead_temperature: LeadIntelligence.resolveTemperature(row)
  }));

  // 4. Handle Post-Fetch Filtering
  if (params.filterTemperature !== "all") {
    enriched = enriched.filter(r => LeadIntelligence.resolveTemperature(r) === params.filterTemperature);
  }

  // 5. Apply Sorting
  if (params.sortByScore) {
    enriched = [...enriched].sort((a, b) => LeadIntelligence.resolveScore(b) - LeadIntelligence.resolveScore(a));
  } else {
    enriched = [...enriched].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return {
    data: enriched,
    total: (leadsCount || 0) + totalDemos
  };
}
