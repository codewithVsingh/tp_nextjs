"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, XCircle, Clock, User, Users, AlertTriangle, ChevronRight, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { instituteService } from "../services/instituteService";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
       <div className="w-10 h-10 border-4 border-tp-institute/30 border-t-tp-institute rounded-full animate-spin" />
       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decrypting Timeline...</span>
    </div>
  );

  if (reports.length === 0) return (
    <div className="p-20 text-center bg-slate-50/50">
       <AlertTriangle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Your Intelligence Archive is Empty.<br/>Contribute signals to secure the network.</p>
    </div>
  );

  return (
    <div className="divide-y divide-slate-100">
      {reports.map((report) => (
        <motion.div 
          key={report.id} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/80 transition-all group relative overflow-hidden"
        >
          {/* Accent Line */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2",
            report.status === 'verified' ? "bg-emerald-500" :
            report.status === 'rejected' ? "bg-rose-500" : "bg-amber-500"
          )} />

          <div className="flex items-start gap-6 flex-1">
            <div className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-all group-hover:scale-105 group-hover:shadow-2xl",
              report.status === 'verified' ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100/50" :
              report.status === 'rejected' ? "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-100/50" :
              "bg-amber-50 border-amber-100 text-amber-600 shadow-amber-100/50"
            )}>
              {report.entity_type === 'parent' ? <Users className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{report.name}</h3>
                 <Badge className="bg-slate-900 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{report.entity_type}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-tp-institute" /> {report.fraud_type || report.issue_type || 'General Issue'}</span>
                 <span className="text-slate-200">|</span>
                 <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Submitted {new Date(report.created_at).toLocaleDateString()}</span>
                 <span className="text-slate-200">|</span>
                 <span className="flex items-center gap-1.5"><Share2 className="w-3 h-3 text-blue-400" /> Network Reach: High</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 pl-12 md:pl-0">
            <div className="text-right">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Intelligence Status</div>
               <Badge className={cn(
                 "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2",
                 report.status === 'verified' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                 report.status === 'rejected' ? "text-rose-600 bg-rose-50 border-rose-100" :
                 "text-amber-600 bg-amber-50 border-amber-100"
               )}>
                 {report.status === 'verified' ? <ShieldCheck className="w-3 h-3 mr-1.5 inline" /> : null}
                 {report.status || 'Under Review'}
               </Badge>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center group-hover:border-tp-institute group-hover:bg-tp-institute/5 transition-all cursor-pointer shadow-sm">
               <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-tp-institute transition-colors" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
