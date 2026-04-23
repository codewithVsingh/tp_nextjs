"use client";

import { useState, useEffect } from "react";
import { 
  Share2, 
  Globe, 
  Building2, 
  Users, 
  Zap, 
  MapPin, 
  Search,
  ArrowUpRight,
  ShieldCheck,
  Network,
  Activity,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AgencyNetwork = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const { data: clusters, error: clusterError } = await supabase
        .from("entity_clusters")
        .select("*")
        .order("risk_score", { ascending: false })
        .limit(20);

      const { data: trustUsers, error: userError } = await supabase
        .from("trust_users")
        .select("*")
        .order("trust_score", { ascending: false });

      if (clusterError || userError) throw clusterError || userError;

      setNodes(clusters || []);
      setAgencies(trustUsers || []);
    } catch (err) {
      toast.error("Network visualization offline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#020617] min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/20">
              <Network className="w-6 h-6 text-white" />
            </div>
            Agency Intelligence Network
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Cross-Agency Cluster Visualization</p>
        </div>

        <div className="flex gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search network nodes..." 
              className="pl-10 bg-slate-900/50 border-slate-800 text-slate-300 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/20">
            <Globe className="w-4 h-4 mr-2" /> Global View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Network Map Placeholder (Conceptual Visualization) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-slate-950 border-slate-800 h-[600px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            
            <CardHeader className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    Live Cluster Topology
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase">
                      Syncing
                    </Badge>
                  </CardTitle>
                  <CardDescription>Visualizing {nodes.length} high-risk entities across {agencies.length} agencies</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="h-full flex items-center justify-center p-0">
               {/* Concept: Interactive Graph UI */}
               <div className="relative w-full h-full p-10 overflow-hidden">
                  {nodes.map((node, i) => (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: Math.sin(i) * 300,
                        y: Math.cos(i) * 200,
                      }}
                      whileHover={{ scale: 1.1, zIndex: 50 }}
                      onClick={() => setSelectedNode(node)}
                      className={cn(
                        "absolute left-1/2 top-1/2 p-3 rounded-2xl border-2 cursor-pointer transition-all shadow-2xl",
                        node.risk_score > 70 ? "bg-rose-500/10 border-rose-500/50 shadow-rose-500/10" : "bg-blue-500/10 border-blue-500/50 shadow-blue-500/10"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Users className={cn("w-5 h-5", node.risk_score > 70 ? "text-rose-400" : "text-blue-400")} />
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate w-20 text-center">
                          {node.primary_name}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] text-slate-500 font-bold">{node.risk_score}% RISK</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Dynamic Connections SVG (Conceptual) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    {/* Add paths here in real implementation */}
                  </svg>
               </div>
            </CardContent>

            {/* Selection Overlay */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div 
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/90 border-l border-slate-800 backdrop-blur-xl p-6 z-50 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-rose-500/20 p-2 rounded-xl">
                      <Zap className="w-5 h-5 text-rose-500" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="text-slate-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tighter mb-1 uppercase">
                    {selectedNode.primary_name}
                  </h3>
                  <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] font-black uppercase mb-6">
                    CRITICAL ALERT NODE
                  </Badge>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Normalized Signal</label>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-300 font-bold">{selectedNode.normalized_phone || "No phone linked"}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{selectedNode.normalized_email || "No email linked"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reports</p>
                        <p className="text-lg font-black text-white">{selectedNode.report_count}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Agencies</p>
                        <p className="text-lg font-black text-white">4</p>
                      </div>
                    </div>

                    <Button className="w-full bg-white text-black hover:bg-slate-200 font-black text-xs uppercase tracking-widest py-6">
                       Initiate Takedown
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="bg-slate-900/40 border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Hotspot</span>
                </div>
                <p className="text-lg font-black text-white uppercase tracking-tighter">New Delhi, NCR</p>
             </Card>
             <Card className="bg-slate-900/40 border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Health</span>
                </div>
                <p className="text-lg font-black text-white uppercase tracking-tighter">99.8% Nominal</p>
             </Card>
             <Card className="bg-slate-900/40 border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared Intel</span>
                </div>
                <p className="text-lg font-black text-white uppercase tracking-tighter">142 Signals</p>
             </Card>
          </div>
        </div>

        {/* Agency IQ Leaderboard */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            Top Intel Providers
          </h2>
          <div className="space-y-3">
            {agencies.map((agency, i) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-purple-600/20 transition-colors">
                        <Building2 className="w-5 h-5 text-slate-500 group-hover:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight truncate w-24">
                          {agency.institute_name}
                        </p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                          {agency.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400 tracking-widest">{agency.trust_score}</div>
                      <div className="text-[7px] text-slate-600 uppercase font-black">Net Worth</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-purple-600 p-6 border-none shadow-2xl shadow-purple-600/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform duration-500">
               <ShieldCheck className="w-24 h-24 text-white" />
            </div>
            <h4 className="text-lg font-black text-white leading-tight mb-2 relative z-10 uppercase tracking-tighter">
              Network-Wide Immunity Active
            </h4>
            <p className="text-xs text-purple-100 font-bold opacity-80 relative z-10">
              All agencies are now synchronized with real-time fraud alerts.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyNetwork;
