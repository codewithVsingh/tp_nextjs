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
import { Badge } from "@/components/ui/badge";
import { TPButton } from "@/design-system/components/TPButton";
import { TPInput } from "@/design-system/components/TPInput";
import { networkService } from "../services/networkService";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const supabase = supabaseClient as any;

const NetworkIntelligenceView = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const filteredNodes = nodes.filter(n => 
    n.primary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgencies = agencies.filter(a => 
    a.institute_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const [clusters, trustUsers] = await Promise.all([
        networkService.getClusters(),
        networkService.getTrustUsers()
      ]);

      setNodes(clusters || []);
      setAgencies(trustUsers || []);
    } catch (err) {
      toast.error("Network visualization offline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/20">
              <Network className="w-6 h-6 text-white" />
            </div>
            Agency Intelligence Network
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Cross-Agency Cluster Visualization</p>
        </div>

        <div className="flex gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TPInput 
              placeholder="Search network nodes..." 
              className="pl-10 bg-white border-slate-200 text-slate-700 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TPButton className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 font-black uppercase text-[10px] tracking-widest">
            <Globe className="w-4 h-4 mr-2" /> Global View
          </TPButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Network Map Placeholder (Conceptual Visualization) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white border-slate-200 h-[600px] relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            
            <CardHeader className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    Live Cluster Topology
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase">
                      Syncing
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-500">Visualizing {filteredNodes.length} high-risk entities across {filteredAgencies.length} agencies</CardDescription>
                </div>
                <TPButton variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </TPButton>
              </div>
            </CardHeader>

            <CardContent className="h-full flex items-center justify-center p-0">
               {/* Concept: Interactive Graph UI */}
               <div className="relative w-full h-full p-10 overflow-hidden">
                  {/* Radar Sweep Background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute left-1/2 top-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.03]"
                      style={{ background: "conic-gradient(from 0deg, transparent, #3b82f6)" }}
                    />
                  </div>

                  {/* Ghost Nodes (Background Noise to build trust/scale) */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={`ghost-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                      className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full"
                      style={{ 
                        left: `${10 + Math.random() * 80}%`, 
                        top: `${10 + Math.random() * 80}%` 
                      }}
                    />
                  ))}

                  {filteredNodes.map((node, i) => {
                    const radius = filteredNodes.length === 1 ? 0 : 250;
                    const angle = (i * 2 * Math.PI) / filteredNodes.length;
                    
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          x: Math.sin(angle) * radius,
                          y: Math.cos(angle) * radius,
                        }}
                        whileHover={{ scale: 1.1, zIndex: 50 }}
                        onClick={() => setSelectedNode(node)}
                        className={cn(
                          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl border-2 cursor-pointer transition-all shadow-2xl z-20",
                          node.risk_score > 70 ? "bg-white border-rose-500 shadow-rose-500/20" : "bg-white border-blue-500 shadow-blue-500/20"
                        )}
                      >
                        <motion.div 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className={cn("p-2 rounded-lg", node.risk_score > 70 ? "bg-rose-50" : "bg-blue-50")}>
                            <Users className={cn("w-6 h-6", node.risk_score > 70 ? "text-rose-600" : "text-blue-600")} />
                          </div>
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter truncate w-24 text-center">
                            {node.primary_name}
                          </span>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] text-slate-600 font-black uppercase">{node.risk_score}% RISK</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* Dynamic Connections SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-10">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    {filteredNodes.length > 1 && filteredNodes.map((node, i) => {
                      if (i === 0) return null;
                      const angle1 = ((i-1) * 2 * Math.PI) / filteredNodes.length;
                      const angle2 = (i * 2 * Math.PI) / filteredNodes.length;
                      const r = 250;
                      
                      return (
                        <motion.line
                          key={`line-${i}`}
                          x1={`${50 + (Math.sin(angle1) * r / 8)}%`}
                          y1={`${50 + (Math.cos(angle1) * r / 6)}%`}
                          x2={`${50 + (Math.sin(angle2) * r / 8)}%`}
                          y2={`${50 + (Math.cos(angle2) * r / 6)}%`}
                          stroke="url(#lineGrad)"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: i * 0.1 }}
                        />
                      );
                    })}
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
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 border-l border-slate-200 backdrop-blur-xl p-6 z-50 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-rose-500/20 p-2 rounded-xl">
                      <Zap className="w-5 h-5 text-rose-500" />
                    </div>
                    <TPButton variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="text-slate-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </TPButton>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                    {selectedNode.primary_name}
                  </h3>
                  <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[9px] font-black uppercase mb-6">
                    CRITICAL ALERT NODE
                  </Badge>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Normalized Signal</label>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-700 font-bold">{selectedNode.normalized_phone || "No phone linked"}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{selectedNode.normalized_email || "No email linked"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reports</p>
                        <p className="text-lg font-black text-slate-900">{selectedNode.report_count}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Agencies</p>
                        <p className="text-lg font-black text-slate-900">4</p>
                      </div>
                    </div>

                    <TPButton className="w-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs uppercase tracking-widest py-6">
                       Initiate Takedown
                    </TPButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Hotspot</span>
                </div>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">New Delhi, NCR</p>
             </Card>
             <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Health</span>
                </div>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">99.8% Nominal</p>
             </Card>
             <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared Intel</span>
                </div>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">142 Signals</p>
             </Card>
          </div>
        </div>

        {/* Agency IQ Leaderboard */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Top Intel Providers
          </h2>
          <div className="space-y-3">
            {filteredAgencies.map((agency, i) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-purple-600/10 transition-colors">
                        <Building2 className="w-5 h-5 text-slate-400 group-hover:text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight truncate w-24">
                          {agency.institute_name}
                        </p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                          {agency.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600 tracking-widest">{agency.trust_score}</div>
                      <div className="text-[7px] text-slate-400 uppercase font-black">Net Worth</div>
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

export default NetworkIntelligenceView;

