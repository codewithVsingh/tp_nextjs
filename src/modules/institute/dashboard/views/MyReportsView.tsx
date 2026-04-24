"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Filter, History } from "lucide-react";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { ReportActivityList } from "../components/ReportActivityList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyReportsView() {
  const { user } = useTrustAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="bg-tp-institute p-2 rounded-xl shadow-lg shadow-tp-institute/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            My Intel Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Your Contributions to Network Security</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
            <Input 
              placeholder="Filter your reports..." 
              className="pl-10 bg-white border-slate-200 text-slate-900 w-full sm:w-64 h-12 focus:ring-2 focus:ring-tp-institute/20 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-200 bg-white text-slate-500 h-12 px-6 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-tp-institute">
               <History className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Submission History</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Live Sync Enabled</span>
          </div>
          
          <div className="min-h-[400px]">
            <ReportActivityList userId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
