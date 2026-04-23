/**
 * Automation Engine
 * ─────────────────
 * Client-side rule runner.  Called from:
 *  • AdminDashboard mount  → runAllAutomations()
 *  • AddEntryModal submit  → runLeadCreatedRule(id)
 *  • FollowUpModal submit  → runStatusChangeAutomations(id, newStatus)
 *
 * Dedup guarantee: Supabase unique index (rule_name, record_id, DATE(triggered_at))
 * means each rule fires at most once per lead per calendar day even if called
 * multiple times.
 */

import { supabase } from "@/integrations/supabase/client";
import { addHours } from "date-fns";

// ─── Rule names ──────────────────────────────────────────────────────────────
export const RULES = {
  LEAD_CREATED:       "lead_created",
  NO_RESPONSE_48H:    "no_response_48h",
  TRIAL_REMINDER:     "trial_reminder",
  TRIAL_FEEDBACK:     "trial_feedback",
  LEAD_CONVERTED:     "lead_converted",
} as const;

export type RuleName = typeof RULES[keyof typeof RULES];

// ─── Core helpers ─────────────────────────────────────────────────────────────

/** Write an automation log entry; silently ignored if dedup constraint fires */
async function logAutomation(
  ruleName: RuleName,
  leadId: string,
  message: string,
  tableName = "leads"
) {
  try {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    await supabase.from("automation_logs").insert({
      rule_name: ruleName,
      record_id: leadId,
      table_name: tableName,
      message,
      triggered_date: today,
    });
  } catch (_) {
    // Dedup unique constraint conflict is expected — ignore silently
  }
}

/** Return true if this rule already fired today for this lead */
async function alreadyFiredToday(ruleName: RuleName, leadId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const { count } = await supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("rule_name", ruleName)
      .eq("record_id", leadId)
      .eq("triggered_date", today);
    return (count ?? 0) > 0;
  } catch (_) {
    return false;
  }
}

// ─── Rule 1: Lead Created ─────────────────────────────────────────────────────
/**
 * Ensures a 24-hour follow-up is set and logs the automation event.
 * Called immediately after a new lead is inserted.
 */
export async function runLeadCreatedRule(leadId: string) {
  if (await alreadyFiredToday(RULES.LEAD_CREATED, leadId)) return;

  const nextFollowUp = addHours(new Date(), 24).toISOString();

  await supabase
    .from("leads")
    .update({
      next_follow_up: nextFollowUp,
      follow_up_status: "Pending",
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .is("next_follow_up", null); // Only set if not already scheduled

  await logAutomation(
    RULES.LEAD_CREATED,
    leadId,
    "✅ Lead created — follow-up auto-scheduled in 24 hours."
  );
}

// ─── Rule 2: No Response (48h) ────────────────────────────────────────────────
/**
 * Scans ALL leads:
 *  - last_activity_at is older than 48h (or null with created_at older than 48h)
 *  - follow_up_status ≠ Done
 *  - automation_disabled = false
 *  → marks follow_up_status = "Missed", logs event
 *
 * Returns count of leads affected.
 */
export async function runNoResponseRule(): Promise<number> {
  try {
    const cutoff = addHours(new Date(), -48).toISOString();

    const { data: stale } = await supabase
      .from("leads")
      .select("id, last_activity_at, created_at")
      .neq("follow_up_status", "Done")
      .neq("status", "Converted")
      .eq("automation_disabled", false)
      .or(`last_activity_at.lt.${cutoff},and(last_activity_at.is.null,created_at.lt.${cutoff})`);

    if (!stale || stale.length === 0) return 0;

    let affected = 0;
    for (const lead of stale) {
      if (await alreadyFiredToday(RULES.NO_RESPONSE_48H, lead.id)) continue;

      await supabase
        .from("leads")
        .update({ follow_up_status: "Missed" })
        .eq("id", lead.id);

      await logAutomation(
        RULES.NO_RESPONSE_48H,
        lead.id,
        "⚠️ No activity for 48+ hours — follow-up marked as Missed."
      );
      affected++;
    }
    return affected;
  } catch (e) {
    console.error("runNoResponseRule:", e);
    return 0;
  }
}

// ─── Rule 3: Trial Scheduled Reminder ────────────────────────────────────────
/**
 * When a lead moves to "Trial Booked":
 *  - Logs a reminder event in automation_logs AND follow_up_logs
 *  - Sets next_follow_up to 1h before trial (pragmatically: now + 23h)
 */
export async function runTrialScheduledRule(leadId: string) {
  if (await alreadyFiredToday(RULES.TRIAL_REMINDER, leadId)) return;

  const reminderAt = addHours(new Date(), 23).toISOString();
  await supabase
    .from("leads")
    .update({
      next_follow_up: reminderAt,
      follow_up_status: "Pending",
      next_action: "Send trial confirmation to student & tutor",
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  // Also write to follow_up_logs so it appears in the drawer timeline
  await supabase.from("follow_up_logs").insert({
    record_id: leadId,
    table_name: "leads",
    note: "🔔 Trial Booked — reminder scheduled. Confirm with tutor & student.",
    status: "Trial Booked",
    activity_type: "Note Added",
    next_follow_up: reminderAt,
  });

  await logAutomation(
    RULES.TRIAL_REMINDER,
    leadId,
    "🔔 Trial Booked detected — reminder logged and follow-up rescheduled."
  );
}

// ─── Rule 4: Trial Completed → Feedback Follow-up ────────────────────────────
/**
 * When a lead moves to "Trial Done":
 *  - Creates a 4-hour follow-up for feedback collection
 *  - Logs the automation
 */
export async function runTrialFeedbackRule(leadId: string) {
  if (await alreadyFiredToday(RULES.TRIAL_FEEDBACK, leadId)) return;

  const feedbackAt = addHours(new Date(), 4).toISOString();
  await supabase
    .from("leads")
    .update({
      next_follow_up: feedbackAt,
      follow_up_status: "Pending",
      next_action: "Collect trial feedback — ask if they want to continue",
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  await supabase.from("follow_up_logs").insert({
    record_id: leadId,
    table_name: "leads",
    note: "✅ Trial completed — feedback follow-up auto-created for 4 hours from now.",
    status: "Trial Done",
    activity_type: "Note Added",
    next_follow_up: feedbackAt,
  });

  await logAutomation(
    RULES.TRIAL_FEEDBACK,
    leadId,
    "✅ Trial Done — feedback follow-up auto-created in 4 hours."
  );
}

// ─── Rule 5: Lead Converted ───────────────────────────────────────────────────
/**
 * When a lead moves to "Converted":
 *  - Sets is_active_student = true
 *  - Sets automation_disabled = true (no more automated reminders)
 *  - Sets follow_up_status = "Done"
 *  - Logs celebration event
 */
export async function runConvertedRule(leadId: string) {
  if (await alreadyFiredToday(RULES.LEAD_CONVERTED, leadId)) return;

  await supabase
    .from("leads")
    .update({
      is_active_student: true,
      automation_disabled: true,
      follow_up_status: "Done",
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  await supabase.from("follow_up_logs").insert({
    record_id: leadId,
    table_name: "leads",
    note: "🎉 Lead converted to Active Student! Automated follow-ups disabled.",
    status: "Converted",
    activity_type: "Note Added",
  });

  await logAutomation(
    RULES.LEAD_CONVERTED,
    leadId,
    "🎉 Lead converted → marked Active Student. Future automation disabled."
  );
}

// ─── Status Change Router ─────────────────────────────────────────────────────
/**
 * Call this whenever a lead's status changes.
 * Routes to the correct automation rule.
 */
export async function runStatusChangeAutomations(leadId: string, newStatus: string) {
  // Update last_activity_at on every status change
  await supabase
    .from("leads")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", leadId);

  switch (newStatus) {
    case "Trial Booked":
      await runTrialScheduledRule(leadId);
      break;
    case "Trial Done":
      await runTrialFeedbackRule(leadId);
      break;
    case "Converted":
      await runConvertedRule(leadId);
      break;
    default:
      break;
  }
}

// ─── Full Scan (run on Dashboard mount) ──────────────────────────────────────
/**
 * Runs all passive automations that need periodic scanning.
 * Safe to call multiple times — dedup prevents double-triggers.
 */
export async function runAllAutomations(): Promise<{ noResponse: number }> {
  const noResponse = await runNoResponseRule();
  return { noResponse };
}
