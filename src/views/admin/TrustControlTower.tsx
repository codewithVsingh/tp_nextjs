"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Globe, 
  Zap, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  AlertCircle,
  ArrowUpRight,
  ListFilter
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TrustControlTower = () => {
  const [stats, setStats] = useState({
    totalEntities: 0,
    activeAlerts: 0,
    globalRiskScore: 0,
    trustedAgencies: 0
  });
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTowerData();
    const cleanup = subscribeToChanges();
    return () => {
      cleanup();
    };
  }, []);

  const fetchTowerData = async () => {
    setLoading(true);
    try {
      const [entities, activeAlertsCount, trustedAgenciesCount] = await Promise.all([
        supabase.from("entity_clusters").select("*", { count: "exact", head: true }),
        supabase.from("intelligence_alerts").select("*", { count: "exact", head: true }).eq("is_resolved", false),
        supabase.from("trust_users").select("*", { count: "exact", head: true }).gte("trust_score", 80)
      ]);

      const { data: reports } = await supabase
        .from("entity_reports")
        .select(`
          *,
          trust_users (institute_name, city, trust_score)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: alertsList } = await supabase
        .from("intelligence_alerts")
        .select(`
          *,
          entity_clusters (primary_name, normalized_phone, entity_type, risk_score)
        `)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: agencyList } = await supabase
        .from("trust_users")
        .select("*")
        .order("trust_score", { ascending: false })
        .limit(5);

      const { data: logs } = await supabase
        .from("agency_activity_logs")
        .select(`
          *,
          trust_users (institute_name, city)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        totalEntities: entities.count || 0,
        activeAlerts: activeAlertsCount.count || 0,
        globalRiskScore: 42, 
        trustedAgencies: trustedAgenciesCount.count || 0
      });
      setPendingReports(reports || []);
      setAlerts(alertsList || []);
      setAgencies(agencyList || []);
      setActivityLogs(logs || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Control Tower out of sync");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("entity_reports")
        .update({ status: action })
        .eq("id", reportId);

      if (error) throw error;
      toast.success(`Signal ${action} in network`);
      fetchTowerData();
    } catch (err: any) {
      toast.error("Verification failed");
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel("tower_realtime")
      .on("postgres_changes", { event: "*", table: "entity_reports" }, () => fetchTowerData())
      .on("postgres_changes", { event: "*", table: "intelligence_alerts" }, () => fetchTowerData())
      .on("postgres_changes", { event: "INSERT", table: "agency_activity_logs" }, () => fetchTowerData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#020617] min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Intelligence Control Tower
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Network-Wide Surveillance Hub</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400"
            onClick={() => window.location.href = '/admin/trust/network'}
          >
            <Globe className="w-4 h-4 mr-2" /> Agency Network
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-bold"
            onClick={() => window.location.href = '/admin/trust/queue'}
          >
            <ShieldAlert className="w-4 h-4 mr-2" /> Verification Queue
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Network Nodes", value: stats.totalEntities, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Criticals", value: stats.activeAlerts, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Network Risk Score", value: `${stats.globalRiskScore}%`, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "High IQ Agencies", value: stats.trustedAgencies, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                </div>
                <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Activity Stream (Audit Trail) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-emerald-400" />
              Network Activity Stream
            </h2>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">
              View All Logs <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agency</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{log.trust_users?.institute_name}</span>
                          <span className="text-[9px] text-slate-600 font-bold">{log.trust_users?.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-2",
                          log.activity_type === 'login' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                          log.activity_type === 'report_submission' && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                          log.activity_type === 'search' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          log.activity_type === 'view_intelligence' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}>
                          {log.activity_type.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[10px] text-slate-600 font-medium italic">
                          IP: {log.ip_address || "Internal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Intelligence Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={cn(
                    "border-slate-800 p-4 transition-all hover:border-slate-700 bg-slate-900/40 backdrop-blur-sm",
                    alert.severity === 'critical' && "border-l-4 border-l-rose-500",
                    alert.severity === 'high' && "border-l-4 border-l-amber-500"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-500 uppercase font-black">
                      {alert.alert_type.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-[10px] text-slate-600 font-bold">{new Date(alert.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {alert.description}
                  </p>
                  {alert.entity_clusters && (
                    <div className="mt-3 flex items-center justify-between p-2 bg-slate-950/50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-24">{alert.entity_clusters.primary_name}</span>
                      <span className="text-[10px] text-rose-500 font-black tracking-widest">{alert.entity_clusters.risk_score}% RISK</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Agency IQ Index
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
              {agencies.map((agency) => (
                <div key={agency.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200 truncate w-32">{agency.institute_name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{agency.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-black tracking-widest",
                      agency.trust_score >= 80 ? "text-emerald-400" : "text-blue-400"
                    )}>
                      {agency.trust_score}
                    </div>
                    <div className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Trust Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustControlTower;
