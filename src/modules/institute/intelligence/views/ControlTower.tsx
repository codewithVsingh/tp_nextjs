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
  TrendingUp,
  Clock,
  Building2,
  ArrowUpRight,
  Eye,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const supabase = supabaseClient as any;

const TrustControlTower = () => {
  const [stats, setStats] = useState({
    totalEntities: 0,
    activeAlerts: 0,
    globalRiskScore: 0,
    trustedAgencies: 0
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const logsPageSize = 10;
  
  const [selectedAgencyLogs, setSelectedAgencyLogs] = useState<any[]>([]);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [viewingAgencyName, setViewingAgencyName] = useState("");

  useEffect(() => {
    fetchTowerData();
    const cleanup = subscribeToChanges();
    return () => {
      cleanup();
    };
  }, [logsPage]);

  const fetchTowerData = async () => {
    try {
      // 1. Fetch Basic Counts (Safe)
      const entitiesRes = await supabase.from("entity_clusters").select("id", { count: "exact", head: true });
      const activeAlertsRes = await supabase.from("intelligence_alerts").select("id", { count: "exact", head: true }).eq("is_resolved", false);
      const trustedAgenciesRes = await supabase.from("trust_users").select("id", { count: "exact", head: true }).gte("trust_score", 80);

      setStats({
        totalEntities: entitiesRes.count || 0,
        activeAlerts: activeAlertsRes.count || 0,
        globalRiskScore: 42, 
        trustedAgencies: trustedAgenciesRes.count || 0
      });

      // 2. Fetch Lists with fallbacks (Standardized DDA Queries)
      const { data: alertsList } = await supabase
        .from("intelligence_alerts")
        .select("*, entity_clusters(primary_name, risk_score)")
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(10);
      setAlerts(alertsList || []);

      const { data: agencyList } = await supabase
        .from("trust_users")
        .select("*")
        .order("trust_score", { ascending: false })
        .limit(5);
      setAgencies(agencyList || []);

      // 3. Fetch Paginated Activity Summary (Using our new view)
      const start = (logsPage - 1) * logsPageSize;
      const end = start + logsPageSize - 1;

      const { data: logs, count: logCount } = await supabase
        .from("agency_activity_summary")
        .select("*", { count: "exact" })
        .order("last_active", { ascending: false })
        .range(start, end);
      
      setActivityLogs(logs || []);
      setLogsTotal(logCount || 0);

    } catch (err: any) {
      console.error("[ControlTower] Fetch Error:", err);
      // Silent fail to keep UI alive
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

  const handleViewAgencyLogs = async (userId: string, name: string) => {
    try {
      setViewingAgencyName(name);
      const { data, error } = await supabase
        .from("agency_activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setSelectedAgencyLogs(data || []);
      setIsLogsModalOpen(true);
    } catch (err: any) {
      toast.error("Could not fetch agency logs");
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
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
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            onClick={() => window.location.href = '/admin/intelligence/network'}
          >
            <Globe className="w-4 h-4 mr-2" /> Agency Network
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-bold"
            onClick={() => window.location.href = '/admin/intelligence/verification'}
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
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
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
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Activity className="w-5 h-5 text-emerald-600" />
              Network Activity Stream
            </h2>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">
              View All Logs <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <Card className="bg-white border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agency</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Types</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Logins</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activityLogs.map((log) => (
                    <tr key={log.user_id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{log.institute_name}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{log.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {log.action_types?.map((type: string) => (
                            <Badge key={type} className={cn(
                              "text-[8px] font-black uppercase px-1.5 h-4 border-none",
                              type === 'login' && "bg-blue-500/10 text-blue-600",
                              type === 'report_submission' && "bg-purple-500/10 text-purple-600",
                              type === 'search' && "bg-amber-500/10 text-amber-600",
                              type === 'view_intelligence' && "bg-emerald-500/10 text-emerald-600"
                            )}>
                              {type.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-900">{log.login_count}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-black">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(log.last_active).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">
                            {new Date(log.last_active).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewAgencyLogs(log.user_id, log.institute_name)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                Showing {Math.min(logsTotal, logsPageSize)} of {logsTotal} Agencies
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Page</span>
                <Select 
                  value={logsPage.toString()} 
                  onValueChange={(v) => setLogsPage(parseInt(v))}
                >
                  <SelectTrigger className="h-7 w-[70px] text-[10px] font-bold bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.ceil(logsTotal / logsPageSize) }).map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()} className="text-[10px] font-bold">
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Intelligence Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={cn(
                    "border-slate-200 p-4 transition-all hover:border-slate-300 bg-white shadow-sm",
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
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {alert.description}
                  </p>
                  {alert.entity_clusters && (
                    <div className="mt-3 flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold uppercase truncate w-24">{alert.entity_clusters.primary_name}</span>
                      <span className="text-[10px] text-rose-500 font-black tracking-widest">{alert.entity_clusters.risk_score}% RISK</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Agency IQ Index
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
              {agencies.map((agency) => (
                <div key={agency.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 truncate w-32">{agency.institute_name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{agency.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-black tracking-widest",
                      agency.trust_score >= 80 ? "text-emerald-600" : "text-blue-600"
                    )}>
                      {agency.trust_score}
                    </div>
                    <div className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Trust Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agency Detail Logs Modal */}
      <Dialog open={isLogsModalOpen} onOpenChange={setIsLogsModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-900 text-white">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">{viewingAgencyName}</DialogTitle>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Audit Trail: Last 10 Interactions</p>
              </div>
              <Activity className="w-6 h-6 text-blue-400 opacity-50" />
            </div>
          </DialogHeader>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event</th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedAgencyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                          {log.action_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] text-slate-500 font-bold">
                          {new Date(log.created_at).toLocaleString('en-IN', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase border-none">
                          Verified
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {selectedAgencyLogs.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        No recent activity logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-slate-50 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsLogsModalOpen(false)} className="text-[10px] font-bold uppercase tracking-widest">
              Close Audit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrustControlTower;

