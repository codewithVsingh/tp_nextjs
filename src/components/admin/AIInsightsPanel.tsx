/**
 * AIInsightsPanel — Intelligent Sales & Operational Nudges
 * ─────────────────────────────────────────────────────────────────────────────
 * Calculates heuristics-based "insights" from CRM data.
 * Lightweight: Component receives raw data and computes nudges.
 */
import { useMemo } from "react";
import { 
  Zap, AlertCircle, TrendingUp, Target, 
  Users, IndianRupee, ArrowRight, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";;

interface Props {
  leads: any[];
  tutors: any[];
  payments: any[];
  assignments: any[];
}

export const AIInsightsPanel = ({ leads, tutors, payments, assignments }: Props) => {
  
  const insights = useMemo(() => {
    const list: any[] = [];

    // ─── Lead Insights ──────────────────────────────────────
    const hotNoTrial = leads.filter(l => 
      l.lead_temperature === "Hot" && 
      !["Trial Booked", "Trial Done", "Converted"].includes(l.status)
    );
    if (hotNoTrial.length > 0) {
      list.push({
        type: "lead",
        title: "High Chance to Convert",
        desc: `${hotNoTrial.length} Hot leads haven't booked trials yet. High priority follow-up.`,
        icon: Target,
        color: "text-red-600 bg-red-50 border-red-100",
        actionText: "Open CRM",
        actionLink: "/admin/leads?temp=Hot"
      });
    }

    const inactive = leads.filter(l => {
      if (!l.last_contacted_at || l.status === "Converted" || l.status === "Dropped") return false;
      const days = (Date.now() - new Date(l.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24);
      return days > 2;
    });
    if (inactive.length > 0) {
      list.push({
        type: "lead",
        title: "At Risk (Inactive)",
        desc: `${inactive.length} active leads have no activity for 48h+. Call them before interest fades.`,
        icon: AlertCircle,
        color: "text-amber-600 bg-amber-50 border-amber-100",
        actionText: "Review Pipeline",
        actionLink: "/admin/leads"
      });
    }

    const overdueLeads = leads.filter(l => l.next_follow_up && new Date(l.next_follow_up) < new Date());
    if (overdueLeads.length > 0) {
      list.push({
        type: "lead",
        title: "Urgent: Overdue Tasks",
        desc: `You have ${overdueLeads.length} follow-ups that need immediate attention.`,
        icon: AlertCircle,
        color: "text-red-600 bg-red-50 border-red-100",
        actionText: "Handle Now",
        actionLink: "/admin/followups"
      });
    }

    // ─── Tutor Insights ─────────────────────────────────────
    const topTutors = tutors.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 1);
    if (topTutors.length > 0 && topTutors[0].score > 85) {
      list.push({
        type: "tutor",
        title: "Top Performer Alert",
        desc: `${topTutors[0].name} has exceptional score (${Math.round(topTutors[0].score)}). Clone their strategy.`,
        icon: Zap,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        actionText: "View Profile",
        actionLink: `/admin/tutors`
      });
    }

    const lowTutors = tutors.filter(t => t.score > 0 && t.score < 40);
    if (lowTutors.length > 0) {
      list.push({
        type: "tutor",
        title: "Tutors Needing Attention",
        desc: `${lowTutors.length} tutors are performing below baseline score (40). Review demos.`,
        icon: Users,
        color: "text-pink-600 bg-pink-50 border-pink-100",
        actionText: "Audit Tutors",
        actionLink: "/admin/tutors"
      });
    }

    // ─── Revenue & City Insights ───────────────────────────
    const pendingLong = payments.filter(p => {
      if (p.status !== "Pending") return false;
      const days = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return days > 5;
    });
    if (pendingLong.length > 0) {
      const sum = pendingLong.reduce((a, b) => a + Number(b.amount || 0), 0);
      list.push({
        type: "revenue",
        title: "Revenue at Risk",
        desc: `₹${sum.toLocaleString()} in pending payments are overdue by 5+ days.`,
        icon: IndianRupee,
        color: "text-red-700 bg-red-50 border-red-200",
        actionText: "Collect Now",
        actionLink: "/admin/revenue"
      });
    }

    // Growth Opportunity: City with leads > 10 but tutors < 2
    const cityMap: Record<string, {l: number, t: number}> = {};
    leads.forEach(l => { const c = l.city || "Other"; if(!cityMap[c]) cityMap[c] = {l:0, t:0}; cityMap[c].l++; });
    tutors.forEach(t => { const c = t.city || "Other"; if(cityMap[c]) cityMap[c].t++; });
    const underserved = Object.entries(cityMap).find(([_, v]) => v.l > 8 && v.t < 2);
    if (underserved) {
      list.push({
        type: "revenue",
        title: "Growth Opportunity",
        desc: `High demand in ${underserved[0]} but low tutor supply. Recruitment needed.`,
        icon: TrendingUp,
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
        actionText: "View Cities",
        actionLink: "/admin/cities"
      });
    }

    // fallback if no critical alerts
    if (list.length === 0) {
      list.push({
        type: "general",
        title: "All Systems Normal",
        desc: "No critical alerts detected in the pipeline today. Keep maintaining the high conversion rate!",
        icon: Sparkles,
        color: "text-gray-600 bg-gray-50 border-gray-100",
        actionText: "View Stats",
        actionLink: "/admin/dashboard"
      });
    }

    return list.slice(0, 3);
  }, [leads, tutors, payments]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <h2 className="text-[14px] font-black text-gray-900">AI Intelligence Insights</h2>
        <span className="text-[10px] font-bold text-gray-400 ml-auto uppercase tracking-widest">Real-time Nudges</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((insight, idx) => (
          <div key={idx} className={cn("rounded-xl border p-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md", insight.color)}>
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 rounded-lg bg-white/60 shadow-sm border border-black/5">
                   <insight.icon className="w-3.5 h-3.5" />
                 </div>
                 <h3 className="text-[13px] font-black leading-tight">{insight.title}</h3>
               </div>
               <p className="text-[11px] leading-relaxed font-medium opacity-80">{insight.desc}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
               <Link href={insight.actionLink} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group">
                 {insight.actionText} <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

