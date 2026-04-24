// Shared funnel stage definitions — used across FunnelTracker, FollowUpModal, LeadDetailDrawer

export type FunnelStage =
  | "New Lead"
  | "Contacted"
  | "Trial Booked"
  | "Trial Done"
  | "Converted"
  | "Dropped";

export interface FunnelStageConfig {
  id: FunnelStage;
  label: string;
  emoji: string;
  color: string;       // Tailwind bg color for active
  textColor: string;   // text color
  borderColor: string;
  lightBg: string;     // light bg for badges/chips
  isTerminal?: boolean; // Dropped
}

export const FUNNEL_STAGES: FunnelStageConfig[] = [
  {
    id: "New Lead",
    label: "New Lead",
    emoji: "🆕",
    color: "bg-slate-600",
    textColor: "text-slate-700",
    borderColor: "border-slate-300",
    lightBg: "bg-slate-100",
  },
  {
    id: "Contacted",
    label: "Contacted",
    emoji: "📞",
    color: "bg-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    lightBg: "bg-blue-100",
  },
  {
    id: "Trial Booked",
    label: "Trial Booked",
    emoji: "📅",
    color: "bg-violet-600",
    textColor: "text-violet-700",
    borderColor: "border-violet-300",
    lightBg: "bg-violet-100",
  },
  {
    id: "Trial Done",
    label: "Trial Done",
    emoji: "✅",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    lightBg: "bg-amber-100",
  },
  {
    id: "Converted",
    label: "Converted",
    emoji: "🎉",
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
    lightBg: "bg-emerald-100",
  },
  {
    id: "Dropped",
    label: "Dropped",
    emoji: "❌",
    color: "bg-red-500",
    textColor: "text-red-700",
    borderColor: "border-red-300",
    lightBg: "bg-red-100",
    isTerminal: true,
  },
];

export const MAIN_FUNNEL = FUNNEL_STAGES.filter(s => !s.isTerminal);

export const getFunnelStage = (id: FunnelStage) =>
  FUNNEL_STAGES.find(s => s.id === id)!;

export const FUNNEL_STATUS_OPTIONS: FunnelStage[] = [
  "New Lead",
  "Contacted",
  "Trial Booked",
  "Trial Done",
  "Converted",
  "Dropped",
];

