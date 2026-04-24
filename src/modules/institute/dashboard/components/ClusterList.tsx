"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, AlertTriangle, UserX, ArrowUpRight, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { instituteService } from "../services/instituteService";
import { supabase } from "@/integrations/supabase/client";
import { trackAgencyActivity } from "@/modules/shared/logic/intelligenceTrackingEngine";

export const ClusterList = ({ entityType, searchQuery, user }: any) => {
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
      .channel(`clusters_${entityType}`)
      .on("postgres_changes", { event: "*", table: "entity_clusters", filter: `entity_type=eq.${entityType}` }, () => fetchClusters())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [entityType, searchQuery]);

  if (loading) return <div className="h-40 flex items-center justify-center text-slate-500 font-bold animate-pulse">Scanning Intelligence...</div>;

  if (clusters.length === 0) return (
    <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white shadow-sm">
      <div className="relative inline-block mb-6">
        <UserX className="w-16 h-16 text-slate-200 mx-auto" />
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
      </div>
      <h3 className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">Clear Horizon</h3>
      <p className="text-slate-500 text-xs mt-2 font-medium">No intelligence matches for this category yet.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) => (
        <motion.div key={cluster.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="group">
          <Card className="bg-white border-slate-200 hover:border-tp-institute/30 transition-all cursor-pointer relative overflow-hidden h-full flex flex-col rounded-3xl shadow-sm hover:shadow-md">
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-tp-institute" />
             </div>
             
             <CardHeader className="pb-4">
               <div className="flex gap-2 mb-4">
                 {cluster.risk_score >= 50 ? (
                   <Badge className="bg-rose-50 text-rose-600 border-rose-100 text-[8px] font-black uppercase tracking-widest px-2">High Risk</Badge>
                 ) : (
                   <Badge className="bg-teal-50 text-tp-institute border-teal-100 text-[8px] font-black uppercase tracking-widest px-2">Suspicious</Badge>
                 )}
                 <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[8px] font-black uppercase tracking-widest px-2">Live Sync</Badge>
               </div>
               <CardTitle className="text-slate-900 group-hover:text-tp-institute transition-colors text-xl font-black tracking-tighter uppercase">{cluster.primary_name}</CardTitle>
               <CardDescription className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest"><MapPin className="w-3 h-3 text-tp-institute" /> {cluster.city || "Region Unknown"}</CardDescription>
             </CardHeader>

             <CardContent className="space-y-6 flex-grow">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1"><Phone className="w-3 h-3" /> <span className="text-[9px] font-black uppercase tracking-widest">Phone</span></div>
                    <p className="text-xs font-bold text-slate-700">XXXXXX{cluster.normalized_phone.slice(-4)}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> <span className="text-[9px] font-black uppercase tracking-widest">Signals</span></div>
                    <p className="text-xs font-bold text-slate-700">{cluster.report_count} Reports</p>
                  </div>
               </div>
             </CardContent>

             <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-tp-institute" /> {cluster.unique_reporters_count} Sources</span>
                <span className="opacity-50">{new Date(cluster.updated_at).toLocaleDateString()}</span>
             </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
