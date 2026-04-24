"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Globe, Activity, ShieldAlert, Plus, Search, History, ShieldCheck
} from "lucide-react";
import { 
  Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import TrustReportForm from "@/components/trust/TrustReportForm";
import { useInstitute } from "../hooks/useInstitute";
import { ClusterList } from "../components/ClusterList";
import { ReportActivityList } from "../components/ReportActivityList";

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

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Signal Confidence", value: `${stats.networkIQ}%`, icon: Zap, color: "text-white", bg: "bg-amber-500", border: "border-amber-100", desc: "Network Accuracy" },
          { label: "Global Signals", value: stats.totalSignals, icon: Globe, color: "text-white", bg: "bg-tp-institute", border: "border-teal-100", desc: "Cross-Agency Intelligence" },
          { label: "Your Contribution", value: stats.yourContribution, icon: Activity, color: "text-white", bg: "bg-emerald-600", border: "border-emerald-100", desc: "Trusted Submissions" },
          { label: "Risk Alerts", value: stats.riskAlerts, icon: ShieldAlert, color: "text-white", bg: "bg-rose-600", border: "border-rose-100", desc: "System anomalies" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={cn("bg-white border-slate-200 shadow-sm overflow-hidden group transition-all hover:shadow-md", stat.border)}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg} shadow-lg shadow-current/10`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                  <div className="w-8 h-1 bg-slate-100 rounded-full" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">{stat.label}</div>
                <div className="text-[9px] text-slate-500 mt-3 flex items-center gap-1 font-bold uppercase"><History className="w-3 h-3" /> {stat.desc}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="tutors" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <TabsList className="bg-slate-100 border border-slate-200 p-1.5 h-12">
                <TabsTrigger value="tutors" className="data-[state=active]:bg-white data-[state=active]:text-tp-institute data-[state=active]:shadow-sm px-8 font-black uppercase text-[10px] tracking-widest transition-all">Tutors</TabsTrigger>
                <TabsTrigger value="parents" className="data-[state=active]:bg-white data-[state=active]:text-tp-institute data-[state=active]:shadow-sm px-8 font-black uppercase text-[10px] tracking-widest transition-all">Parents</TabsTrigger>
              </TabsList>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
                  <Input 
                    placeholder={`Filter by name or phone...`}
                    className="pl-10 bg-white border-slate-200 text-slate-900 h-12 focus:ring-2 focus:ring-tp-institute/20 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Drawer open={isReportOpen} onOpenChange={setIsReportOpen}>
                  <DrawerTrigger asChild>
                    <Button className="h-12 px-6 bg-tp-institute hover:bg-tp-institute/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-tp-institute/20 transition-all">
                      <Plus className="w-4 h-4 mr-2" /> Report
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-white border-slate-200 max-h-[95vh] p-8">
                    <div className="max-w-2xl mx-auto w-full">
                      <TrustReportForm 
                        onClose={() => setIsReportOpen(false)} 
                        onSuccess={handleReportSuccess}
                        defaultType={activeTab === 'tutors' ? 'tutor' : 'parent'}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <TabsContent value="tutors" className="mt-0 outline-none">
              <ClusterList key={`tutor-${refreshKey}`} entityType="tutor" searchQuery={searchQuery} user={user} />
            </TabsContent>
            <TabsContent value="parents" className="mt-0 outline-none">
              <ClusterList key={`parent-${refreshKey}`} entityType="parent" searchQuery={searchQuery} user={user} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <History className="w-4 h-4 text-tp-institute" /> Activity Feed
             </h2>
             <Button variant="ghost" className="text-[9px] font-black text-slate-400 uppercase hover:text-slate-900 transition-colors">Clear</Button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            <ReportActivityList key={`history-${refreshKey}`} userId={user?.id} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-3xl relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <ShieldCheck className="w-32 h-32 text-tp-institute" />
            </div>
            <div className="flex items-center gap-3 text-tp-institute mb-4">
              <div className="p-2 bg-teal-100 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Network Shield</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Verification protocol active. All signals verified against 8-point intelligence matrix. Shared across the global network instantly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
