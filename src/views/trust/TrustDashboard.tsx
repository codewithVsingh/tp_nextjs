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
  ChevronRight
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
    totalTutors: 0,
    totalParents: 0,
    yourReports: 0,
    networkTrust: 0
  });

  useEffect(() => {
    // Fetch real stats from Supabase
    const fetchStats = async () => {
      // For now, using mock or simple counts
      const { count: tutorCount } = await supabase
        .from("entity_clusters")
        .select("*", { count: "exact", head: true })
        .eq("entity_type", "tutor");
      
      const { count: parentCount } = await supabase
        .from("entity_clusters")
        .select("*", { count: "exact", head: true })
        .eq("entity_type", "parent");

      const { count: yourCount } = await supabase
        .from("entity_reports")
        .select("*", { count: "exact", head: true })
        .eq("reported_by_user_id", user?.id);

      setStats({
        totalTutors: tutorCount || 0,
        totalParents: parentCount || 0,
        yourReports: yourCount || 0,
        networkTrust: 98 // Placeholder
      });
    };

    if (user) fetchStats();
  }, [user, refreshKey]);

  const handleReportSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setIsReportOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight leading-none">Trust Intelligence</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Closed Network v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">{user?.institute_name}</span>
              <span className="text-[10px] text-slate-500">{user?.city} • Score: {user?.trust_score}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tutor Registry", value: stats.totalTutors, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Parent Registry", value: stats.totalParents, icon: UserSquare2, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Your Reports", value: stats.yourReports, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Network Trust", value: `${stats.networkTrust}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden group">
                  <div className={`h-1 w-full ${stat.bg.replace('/10', '')}`} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
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
        </main>
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
             {/* Risk Badge on Card Top */}
             <div className="absolute top-4 right-4">
               {cluster.status === 'high_risk' && <Badge className="bg-red-500/20 text-red-500 border-red-500/50">High Risk</Badge>}
               {cluster.status === 'repeat_offender' && <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50">Repeat Offender</Badge>}
               {cluster.status === 'normal' && <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">Reported</Badge>}
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

export default TrustDashboard;
