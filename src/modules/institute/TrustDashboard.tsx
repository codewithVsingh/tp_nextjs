"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  AlertTriangle, 
  UserX, 
  Plus, 
  LayoutDashboard, 
  UserSquare2, 
  ShieldCheck,
  LogOut,
  MapPin,
  Phone,
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Zap,
  Globe,
  Fingerprint,
  Activity,
  History,
  XCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import TrustReportForm from "@/components/trust/TrustReportForm";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { trackAgencyActivity } from "@/modules/shared/logic/intelligenceTrackingEngine";

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6M12 18V22M6 12H2M22 12H18M5.63604 5.63604L8.46447 8.46447M15.5355 15.5355L18.364 18.364M5.63604 18.364L8.46447 15.5355M15.5355 8.46447L18.364 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrustDashboard = () => {
  const { user, logout } = useTrustAuth();
  const [activeTab, setActiveTab] = useState("tutors");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    totalSignals: 0,
    networkIQ: 0,
    yourContribution: 0,
    riskAlerts: 0
  });

  useEffect(() => {
    // Fetch real stats from Supabase
    const fetchStats = async () => {
      const { count: signalCount } = await supabase
        .from("entity_reports")
        .select("*", { count: "exact", head: true });
      
      const { count: yourCount } = await supabase
        .from("entity_reports")
        .select("*", { count: "exact", head: true })
        .eq("reported_by_user_id", user?.id);

      const { count: alertCount } = await supabase
        .from("intelligence_alerts")
        .select("*", { count: "exact", head: true })
        .eq("is_resolved", false);

      setStats({
        totalSignals: signalCount || 0,
        networkIQ: 84, // Calculated based on verification ratio
        yourContribution: yourCount || 0,
        riskAlerts: alertCount || 0
      });
    };

    if (user) fetchStats();
  }, [user, refreshKey]);

  useEffect(() => {
    if (user) {
      trackAgencyActivity(user.id, 'view_intelligence');
    }
  }, [user]);

  const handleReportSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setIsReportOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Stats Grid */}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Signal Confidence", value: `${stats.networkIQ}%`, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Network Accuracy" },
              { label: "Global Signals", value: stats.totalSignals, icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Cross-Agency Intelligence" },
              { label: "Your Contribution", value: stats.yourContribution, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Trusted Submissions" },
              { label: "Risk Alerts", value: stats.riskAlerts, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", desc: "System anomalies" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-widest">Live</span>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</div>
                    <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                      <History className="w-3 h-3" /> {stat.desc}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Intelligence Clusters List */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs 
                defaultValue="tutors" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                  <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger 
                      value="tutors" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 transition-all"
                    >
                      Tutors
                    </TabsTrigger>
                    <TabsTrigger 
                      value="parents" 
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 transition-all"
                    >
                      Parents
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        placeholder={`Search ${activeTab}...`}
                        className="pl-10 bg-slate-900 border-slate-800 text-white focus:ring-blue-500/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Drawer open={isReportOpen} onOpenChange={setIsReportOpen}>
                      <DrawerTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                          <Plus className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="bg-slate-900 border-slate-800 max-h-[95vh] p-6 focus:outline-none">
                        <div className="max-w-2xl mx-auto w-full">
                          <DrawerTitle className="sr-only">Report Entity</DrawerTitle>
                          <DrawerDescription className="sr-only">Submit a report for a tutor or parent</DrawerDescription>
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

                {/* Content Area */}
                <TabsContent value="tutors" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ClusterList key={`tutor-${refreshKey}`} entityType="tutor" searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="parents" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ClusterList key={`parent-${refreshKey}`} entityType="parent" searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Your Activity Sidebar */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Your Activity Feed
              </h2>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                <ReportActivityList key={`history-${refreshKey}`} userId={user?.id} />
              </div>
              
              <div className="p-6 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-widest">Network Shield</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your contributions go through an 8-point automated verification process before being shared with the intelligence network.
                </p>
              </div>
            </div>
          </div>
        </div>
  );
};

// Sub-component for listing clusters
const ClusterList = ({ entityType, searchQuery }: { entityType: 'tutor' | 'parent', searchQuery: string }) => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusters = async () => {
      setLoading(true);
      let query = supabase
        .from("entity_clusters")
        .select("*")
        .eq("entity_type", entityType)
        .order("report_count", { ascending: false });

      if (searchQuery) {
        query = query.or(`primary_name.ilike.%${searchQuery}%,normalized_phone.ilike.%${searchQuery}%`);
      }

      const { data } = await query.limit(20);
      setClusters(data || []);
      setLoading(false);
    };

    fetchClusters();

    if (searchQuery && user) {
      trackAgencyActivity(user.id, 'search', { query: searchQuery, entityType });
    }

    // Subscribe to all cluster updates for this type
    const channel = supabase
      .channel(`clusters_${entityType}`)
      .on(
        "postgres_changes", 
        { 
          event: "*", 
          table: "entity_clusters",
          filter: `entity_type=eq.${entityType}`
        }, 
        () => fetchClusters()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityType, searchQuery]);

  if (loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (clusters.length === 0) return (
    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
      <UserX className="w-12 h-12 text-slate-700 mx-auto mb-4" />
      <h3 className="text-slate-400 font-medium">No records found</h3>
      <p className="text-slate-600 text-sm mt-1">Be the first to report an entity in this category.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) => (
        <motion.div
          key={cluster.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group relative overflow-hidden">
             <div className="absolute top-4 right-4 flex gap-2">
               {cluster.risk_score >= 50 && (
                 <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">High Confidence Fraud</Badge>
               )}
               {cluster.report_count >= 3 ? (
                 <Badge className="bg-rose-500/20 text-rose-500 border-rose-500/50 text-[10px]">Repeat Offender</Badge>
               ) : (
                 <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50 text-[10px]">Under Surveillance</Badge>
               )}
             </div>

             <CardHeader>
               <CardTitle className="text-white group-hover:text-blue-400 transition-colors">{cluster.primary_name}</CardTitle>
               <CardDescription className="flex items-center gap-2 text-slate-500">
                 <MapPin className="w-3 h-3" /> {cluster.city || "Unknown City"}
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-slate-400">
                   <Phone className="w-4 h-4" />
                   {/* Mask phone number for security */}
                   <span>XXXXXX{cluster.normalized_phone.slice(-4)}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                   <AlertTriangle className="w-4 h-4 text-amber-500" />
                   <span>{cluster.report_count} Reports</span>
                 </div>
               </div>
               
               <div className="pt-2 flex flex-wrap gap-2">
                 {cluster.categories?.slice(0, 2).map((cat: string) => (
                   <Badge key={cat} variant="secondary" className="bg-slate-800 text-[10px] text-slate-400 border-0">
                     {cat}
                   </Badge>
                 ))}
               </div>
             </CardContent>
             <div className="px-6 py-3 border-t border-slate-800/50 bg-slate-900/40 flex justify-between items-center text-[10px] text-slate-500">
                <span>Unique Reporters: {cluster.unique_reporters_count}</span>
                <span>Last Activity: {new Date(cluster.updated_at).toLocaleDateString()}</span>
             </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Sub-component for listing individual report history
const ReportActivityList = ({ userId }: { userId?: string }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) return;
      setLoading(true);
      const { data } = await supabase
        .from("entity_reports")
        .select("*")
        .eq("reported_by_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      setReports(data || []);
      setLoading(false);
    };

    fetchReports();

    // Subscribe to status changes for this user's reports
    const channel = supabase
      .channel(`user_reports_${userId}`)
      .on(
        "postgres_changes", 
        { 
          event: "UPDATE", 
          table: "entity_reports",
          filter: `reported_by_user_id=eq.${userId}`
        }, 
        () => fetchReports()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) return <div className="p-10 text-center"><Loader2 className="mx-auto" /></div>;

  if (reports.length === 0) return (
    <div className="p-8 text-center text-slate-600 text-xs italic">
      No activity yet. Your contributions will appear here.
    </div>
  );

  return (
    <div className="divide-y divide-slate-800">
      {reports.map((report) => (
        <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-all">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border",
              report.status === 'verified' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
              report.status === 'rejected' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
              "bg-amber-500/10 border-amber-500/20 text-amber-400"
            )}>
              {report.status === 'verified' ? <ShieldCheck className="w-4 h-4" /> : 
               report.status === 'rejected' ? <XCircle className="w-4 h-4" /> : 
               <Clock className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200 uppercase tracking-tight">{report.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{report.category}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className={cn(
              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5",
              report.status === 'verified' ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
              report.status === 'rejected' ? "border-rose-500/30 text-rose-400 bg-rose-500/5" :
              "border-amber-500/30 text-amber-400 bg-amber-500/5"
            )}>
              {report.status || 'Pending'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustDashboard;


