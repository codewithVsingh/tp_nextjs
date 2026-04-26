"use client";

import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { CRMLeadPipeline } from "@/modules/institute/dashboard/components/CRMLeadPipeline";
import { motion } from "framer-motion";
import { Zap, Activity, ShieldCheck } from "lucide-react";

export default function CRMPage() {
  const { user } = useTrustAuth();

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-[1500px] mx-auto">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-tp-institute/10 border border-tp-institute/20 rounded-full mb-3">
             <Zap className="w-3 h-3 text-tp-institute animate-pulse" />
             <span className="text-[8px] font-black uppercase tracking-widest text-tp-institute">Operational Workflow</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Agency <span className="text-tp-institute">CRM</span> Terminal
          </h1>
          <p className="text-slate-400 text-[11px] font-medium mt-1">Manage leads and operational security in real-time.</p>
        </motion.div>

        <div className="flex gap-3">
           <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center min-w-[100px]">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Health</div>
              <div className="text-tp-institute font-black text-lg leading-none uppercase">Optimal</div>
           </div>
        </div>
      </div>

      {/* Main CRM Component */}
      <CRMLeadPipeline user={user} />
      
      {/* Compact Security Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-slate-900 rounded-2xl text-white flex items-center gap-4 border border-white/5 shadow-lg shadow-slate-900/10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5 text-tp-institute" /></div>
            <div>
               <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Live Pulse</div>
               <div className="text-xs font-bold uppercase tracking-tight">100% Coverage</div>
            </div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 col-span-2 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-tp-institute" />
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-2xl">
              Every lead added to this CRM is automatically audited against the <span className="text-slate-900 font-black">Global Intelligence Matrix.</span> We notify you instantly if a parent or tutor crosses the risk threshold.
            </p>
         </div>
      </div>
    </div>
  );
}
