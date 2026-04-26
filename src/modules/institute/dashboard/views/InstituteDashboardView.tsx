"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Globe, Activity, ShieldAlert, Plus, Search, History, ShieldCheck
} from "lucide-react";
import { 
  Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import TrustReportForm from "@/components/trust/TrustReportForm";
import { useInstitute } from "../hooks/useInstitute";
import { ClusterList } from "../components/ClusterList";
import { CRMLeadPipeline } from "../components/CRMLeadPipeline";
import { ReportActivityList } from "../components/ReportActivityList";
import { LeadExchangeMarketplace } from "../components/LeadExchangeMarketplace";
import { PostLeadModal } from "../components/PostLeadModal";

export default function InstituteDashboardView() {
  const { user } = useTrustAuth();
  const { stats, refresh, refreshKey } = useInstitute(user);
  const [activeTab, setActiveTab] = useState("tutors");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleReportSuccess = () => {
    refresh();
    setIsReportOpen(false);
  };

  const getTrustLabel = (score: number) => {
    if (score >= 0.8) return "Trusted Elite";
    if (score >= 0.4) return "Verified Source";
    return "Neutral Contributor";
  };

  const trustStyle = stats.agencyTrust >= 0.8 
    ? { bg: "bg-emerald-500" }
    : stats.agencyTrust >= 0.4 
    ? { bg: "bg-blue-500" }
    : { bg: "bg-slate-500" };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1500px] mx-auto bg-[#F8FAFC]">
      {/* 1. COMPACT ENTERPRISE HEADER */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">Operations Terminal</h1>
              <div className="flex items-center gap-2 mt-1">
                 <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5", trustStyle.bg, "text-white border-none")}>
                    {getTrustLabel(stats.agencyTrust)}
                 </Badge>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Node: {user?.email?.split('@')[0]}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow lg:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
                <Input 
                  placeholder="Network Search..." 
                  className="pl-10 h-11 bg-white border-slate-200 rounded-xl font-bold text-[11px] shadow-sm focus:ring-2 focus:ring-tp-institute/10 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {activeTab === 'exchange' ? (
                 <PostLeadModal user={user} onSuccess={refresh} />
              ) : (
                <Sheet open={isReportOpen} onOpenChange={setIsReportOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-11 px-6 bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest rounded-xl shadow-lg hover:bg-slate-800 transition-all">
                      <Plus className="w-3.5 h-3.5 mr-2 text-tp-institute" /> Report Signal
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="sm:max-w-[800px] p-0 border-none shadow-2xl">
                     <div className="flex h-full">
                        <div className="flex-1 overflow-y-auto p-10 bg-white">
                           <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">Signal Intelligence</SheetTitle>
                           <SheetDescription className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-8">Broadcast to Network</SheetDescription>
                           <TrustReportForm onClose={() => setIsReportOpen(false)} onSuccess={handleReportSuccess} defaultType={activeTab === 'tutors' ? 'tutor' : 'parent'} />
                        </div>
                     </div>
                  </SheetContent>
                </Sheet>
              )}
           </div>
        </div>

        {/* High-Density KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Confidence", value: `${stats.networkIQ}%`, icon: Zap, bg: "bg-amber-500" },
            { label: "Verified", value: stats.verifiedSignals, icon: ShieldCheck, bg: "bg-tp-institute" },
            { label: "Access", value: stats.accessLevel === 'full' ? 'ELITE' : 'LOCKED', icon: Globe, bg: trustStyle.bg },
            { label: "Alerts", value: stats.riskAlerts, icon: ShieldAlert, bg: "bg-rose-600" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-all overflow-hidden border-b-2 border-b-slate-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl text-white shadow-sm", stat.bg)}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-tighter text-slate-900 leading-none">{stat.value}</div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
                  </div>
                </div>
                <div className="w-6 h-0.5 bg-slate-50 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. COMPACT OPERATIONAL WORKSPACE */}
      <Tabs defaultValue="tutors" className="w-full space-y-6" onValueChange={setActiveTab}>
        <div className="border-b border-slate-100 pb-1">
          <TabsList className="bg-transparent h-9 gap-6 p-0">
            {["tutors", "parents", "crm", "exchange"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="data-[state=active]:bg-transparent data-[state=active]:text-tp-institute data-[state=active]:border-b-2 data-[state=active]:border-tp-institute border-none rounded-none px-0 pb-3 font-black uppercase text-[10px] tracking-widest transition-all text-slate-400 hover:text-slate-600"
              >
                {tab === 'crm' ? 'CRM' : tab === 'exchange' ? 'Exchange' : tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Sentinel Audit View */}
            {searchQuery.replace(/\D/g, "").length >= 10 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                  <div className="space-y-2">
                    <Badge className="bg-tp-institute/20 text-tp-institute border-tp-institute/30 px-2 py-0.5 text-[8px] font-black uppercase">Sentinel Active</Badge>
                    <h2 className="text-lg font-black tracking-tighter uppercase leading-none">Analysis: {searchQuery}</h2>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[100px]">
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Verdict</div>
                    <div className="text-2xl font-black text-tp-institute tracking-tighter">SAFE</div>
                  </div>
                </div>
              </motion.div>
            )}

            <TabsContent value="tutors" className="mt-0 outline-none">
              <ClusterList key={`tutor-${refreshKey}`} entityType="tutor" searchQuery={searchQuery} user={user} accessLevel={stats.accessLevel} />
            </TabsContent>
            <TabsContent value="parents" className="mt-0 outline-none">
              <ClusterList key={`parent-${refreshKey}`} entityType="parent" searchQuery={searchQuery} user={user} accessLevel={stats.accessLevel} />
            </TabsContent>
            <TabsContent value="crm" className="mt-0 outline-none">
              <CRMLeadPipeline user={user} />
            </TabsContent>
            <TabsContent value="exchange" className="mt-0 outline-none">
              <LeadExchangeMarketplace user={user} />
            </TabsContent>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Sentinel
               </h2>
               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                 {[
                   { type: "Blacklist", msg: "Phone +91 98XXX risk > 85%.", time: "2m ago" },
                   { type: "Watchlist", msg: "New signal on tracked entity.", time: "15m ago" },
                 ].map((alert, i) => (
                   <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                     <div className="flex justify-between items-start mb-0.5">
                       <span className="text-[8px] font-black uppercase tracking-widest text-rose-500">{alert.type}</span>
                       <span className="text-[8px] text-slate-400 font-bold">{alert.time}</span>
                     </div>
                     <p className="text-[10px] text-slate-600 font-medium group-hover:text-slate-900 leading-tight">{alert.msg}</p>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <History className="w-3.5 h-3.5 text-tp-institute" /> Pulse
               </h2>
               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm max-h-[350px] overflow-y-auto">
                 <ReportActivityList key={`history-${refreshKey}`} userId={user?.id} />
               </div>
            </div>
            
            <div className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group shadow-lg">
               <div className="flex items-center gap-2 text-tp-institute mb-3">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Shield Active</span>
               </div>
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Verification active at 100%. Signals cross-referenced globally.</p>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
