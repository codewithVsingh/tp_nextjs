"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, AlertTriangle, UserX, ArrowUpRight, Users, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { instituteService } from "../services/instituteService";
import { supabase } from "@/integrations/supabase/client";
import { trackAgencyActivity } from "@/modules/shared/logic/intelligenceTrackingEngine";
import { cn } from "@/lib/utils";

export const ClusterList = ({ entityType, searchQuery, user, accessLevel = 0 }: any) => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const data = await instituteService.fetchClusters(entityType, searchQuery);
      setClusters(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();

    if (searchQuery && user) {
      trackAgencyActivity(user.id, 'search', { query: searchQuery, entityType });
    }

    const channel = supabase
      .channel(`intelligence_matrix`)
      .on("postgres_changes", { event: "*", table: "entity_reports" }, () => fetchClusters())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [entityType, searchQuery]);

  if (loading) return (
    <div className="h-48 flex flex-col items-center justify-center text-slate-500 font-bold animate-pulse gap-3">
      <div className="p-3 bg-slate-50 rounded-full border border-slate-100"><Users className="w-6 h-6 text-slate-300" /></div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Syncing Matrix...</span>
    </div>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'BLACKLISTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'RISKY': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CAUTION': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  if (clusters.length === 0) return (
    <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white shadow-sm">
      <UserX className="w-10 h-10 text-slate-200 mx-auto mb-3" />
      <h3 className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Clear Horizon</h3>
      <p className="text-slate-500 text-[9px] mt-1 font-medium italic">No signals detected yet.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {clusters.map((cluster) => (
        <motion.div key={cluster.normalized_phone} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="group">
          <Card className="bg-white border-slate-200 hover:border-tp-institute/30 transition-all cursor-pointer relative overflow-hidden h-full flex flex-col rounded-xl shadow-sm hover:shadow-md">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-tp-institute" />
             </div>
             
             <CardHeader className="p-5 pb-3">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge className={cn("text-[7px] font-black uppercase tracking-widest px-1.5 py-0", getRiskColor(cluster.risk_level))}>
                    {cluster.risk_level}
                  </Badge>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[7px] font-black uppercase tracking-widest px-1.5 py-0">
                    {cluster.risk_score}% RISK
                  </Badge>
                  <Badge className={cn(
                    "text-[7px] font-black uppercase tracking-widest px-1.5 py-0",
                    cluster.fidelity_status === 'verified' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
                    {cluster.fidelity_status === 'verified' ? "Verified" : "Provisional"}
                  </Badge>
                </div>
                <CardTitle className={cn(
                  "text-slate-900 group-hover:text-tp-institute transition-colors text-[13px] font-black tracking-tight uppercase leading-none mb-1",
                  accessLevel < 1 && "blur-md select-none"
                )}>
                  {cluster.primary_name}
                </CardTitle>
                <CardDescription className={cn(
                  "flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-widest",
                  accessLevel < 1 && "blur-sm select-none"
                )}>
                  <MapPin className="w-3 h-3 text-tp-institute" /> {cluster.city || "Region Unknown"}
                </CardDescription>

                {accessLevel < 1 && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl flex flex-col items-center gap-2 text-center">
                       <ShieldCheck className="w-4 h-4 text-tp-institute" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Unlock Data</span>
                    </div>
                  </div>
                )}
             </CardHeader>

             <CardContent className="p-5 pt-0 space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                     <div className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Signal ID</div>
                     <p className="text-[10px] font-bold text-slate-700">..{cluster.normalized_phone.slice(-4)}</p>
                   </div>
                   <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                     <div className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Reports</div>
                     <p className="text-[10px] font-bold text-slate-700">{cluster.total_signals} Signals</p>
                   </div>
                </div>
             </CardContent>

             <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className={cn("w-3 h-3", cluster.risk_score > 50 ? "text-rose-500" : "text-tp-institute")} /> 
                  Verified
                </span>
                <span className="opacity-50">Pulse: {new Date(cluster.last_seen).toLocaleDateString()}</span>
             </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
