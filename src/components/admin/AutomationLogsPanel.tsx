import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { Zap, Loader2, RotateCcw, AlertTriangle, CheckCircle2, Bell, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RULES, RuleName } from "@/lib/automationEngine";

interface AutomationLog {
  id: string;
  rule_name: string;
  record_id: string;
  table_name: string;
  message: string;
  triggered_at: string;
}

// Visual config per rule
const RULE_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  [RULES.LEAD_CREATED]: {
    label: "Lead Created",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  [RULES.NO_RESPONSE_48H]: {
    label: "No Response (48h)",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  [RULES.TRIAL_REMINDER]: {
    label: "Trial Reminder",
    icon: <Bell className="w-3.5 h-3.5" />,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  [RULES.TRIAL_FEEDBACK]: {
    label: "Trial Feedback",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  [RULES.LEAD_CONVERTED]: {
    label: "Lead Converted",
    icon: <UserCheck className="w-3.5 h-3.5" />,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const getMeta = (ruleName: string) =>
  RULE_META[ruleName] ?? {
    label: ruleName,
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };

interface Props {
  /** How many logs to show per page */
  limit?: number;
}

export const AutomationLogsPanel = ({ limit = 20 }: Props) => {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_logs")
        .select("*")
        .order("triggered_at", { ascending: false })
        .limit(limit);

      if (error) {
        // Table doesn't exist yet — silently hide panel
        if (error.message.includes("does not exist")) {
          setLogs([]);
          return;
        }
        throw error;
      }
      setLogs(data || []);

      // Count today's triggers
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("automation_logs")
        .select("id", { count: "exact", head: true })
        .gte("triggered_at", today.toISOString());
      setTodayCount(count ?? 0);
    } catch (e) {
      console.error("AutomationLogsPanel:", e);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Group logs by rule for summary counts
  const ruleCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.rule_name] = (acc[l.rule_name] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b bg-gradient-to-r from-violet-50/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm leading-none">Automation Log</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{todayCount} triggers today</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLogs}
          className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Rule summary pills */}
      {!loading && Object.keys(ruleCounts).length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b bg-gray-50/50">
          {Object.entries(ruleCounts).map(([rule, count]) => {
            const meta = getMeta(rule);
            return (
              <span
                key={rule}
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  meta.bg, meta.color, meta.border
                )}
              >
                {meta.icon} {meta.label} · {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Log list */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Zap className="w-7 h-7 mx-auto mb-2 text-violet-300" />
            <p className="text-[12px] font-semibold">No automation events yet.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Run the SQL migration to enable automations.</p>
          </div>
        ) : (
          logs.map(log => {
            const meta = getMeta(log.rule_name);
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors"
              >
                {/* Icon dot */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border",
                  meta.bg, meta.color, meta.border
                )}>
                  {meta.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("text-[10px] font-black uppercase tracking-wide", meta.color)}>
                      {meta.label}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDistanceToNow(parseISO(log.triggered_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-700 leading-snug">{log.message}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-mono">
                    {format(parseISO(log.triggered_at), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
