"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Filter, History, ShieldCheck, Zap, Globe, AlertTriangle } from "lucide-react";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { ReportActivityList } from "../components/ReportActivityList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { instituteService } from "../services/instituteService";

export default function MyReportsView() {
  const { user } = useTrustAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, verified: 0, impact: 0 });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      const history = await instituteService.fetchReportHistory(user.id);
      const verified = history.filter(h => h.status === 'verified').length;
      setStats({
        total: history.length,
        verified: verified,
        impact: verified * 12 // Estimated agencies protected
      });
    };
    loadStats();
  }, [user]);

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen bg-slate-50/30">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 p-2 rounded-xl shadow-xl shadow-slate-900/10">
                <Activity className="w-5 h-5 text-tp-institute" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Intelligence Archive</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             My <span className="text-tp-institute">Intel</span> Reports
           </h1>
           <p className="text-slate-400 text-sm font-medium mt-2">Historical log of your contributions to the global security network.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
            <Input 
              placeholder="Search your history..." 
              className="pl-12 h-14 bg-white border-slate-200 rounded-2xl font-bold shadow-sm focus:ring-tp-institute/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 px-8 border-slate-200 bg-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 mr-2" /> Advanced Filter
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-tp-institute/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-16 h-16 text-tp-institute" /></div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Contributions</div>
            <div className="text-4xl font-black text-slate-900">{stats.total}</div>
            <div className="text-[9px] font-bold text-tp-institute uppercase mt-2">Active Signals</div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-tp-institute/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-16 h-16 text-tp-institute" /></div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Fidelity</div>
            <div className="text-4xl font-black text-tp-institute">{stats.verified}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase mt-2">Validated Intelligence</div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Globe className="w-16 h-16 text-tp-institute" /></div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Network Impact</div>
            <div className="text-4xl font-black text-white">{stats.impact}</div>
            <div className="text-[9px] font-bold text-tp-institute uppercase mt-2">Agencies Protected</div>
         </div>
      </div>

      {/* Submission List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
             <History className="w-4 h-4 text-tp-institute" /> Intelligence Timeline
           </h2>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted History</span>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <ReportActivityList userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
