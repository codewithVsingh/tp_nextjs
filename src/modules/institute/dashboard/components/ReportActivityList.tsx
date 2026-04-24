"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { instituteService } from "../services/instituteService";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const ReportActivityList = ({ userId }: { userId?: string }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await instituteService.fetchReportHistory(userId);
      setReports(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const channel = supabase
      .channel(`user_reports_${userId}`)
      .on("postgres_changes", { event: "UPDATE", table: "entity_reports", filter: `reported_by_user_id=eq.${userId}` }, () => fetchReports())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Syncing history...</div>;

  if (reports.length === 0) return <div className="p-8 text-center text-slate-600 text-xs italic">No activity yet.</div>;

  return (
    <div className="divide-y divide-slate-100">
      {reports.map((report) => (
        <div key={report.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/10",
              report.status === 'verified' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
              report.status === 'rejected' ? "bg-rose-50 border-rose-100 text-rose-600" :
              "bg-amber-50 border-amber-100 text-amber-600"
            )}>
              {report.status === 'verified' ? <ShieldCheck className="w-5 h-5" /> : 
               report.status === 'rejected' ? <XCircle className="w-5 h-5" /> : 
               <Clock className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{report.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">{report.category} • {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn(
            "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border",
            report.status === 'verified' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
            report.status === 'rejected' ? "text-rose-600 bg-rose-50 border-rose-100" :
            "text-amber-600 bg-amber-50 border-amber-100"
          )}>{report.status || 'Processing'}</Badge>
        </div>
      ))}
    </div>
  );
};
