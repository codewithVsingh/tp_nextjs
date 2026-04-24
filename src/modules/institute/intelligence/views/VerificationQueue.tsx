"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  MapPin,
  Building2,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const supabase = supabaseClient as any;

const VerificationQueue = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQueue();
    const subscription = supabase
      .channel('verification_queue_changes')
      .on('postgres_changes', { event: '*', table: 'entity_reports' }, () => fetchQueue())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from("entity_reports")
        .select(`
          *,
          trust_users (institute_name, city, trust_score)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      toast.error("Failed to sync queue");
    }
  };

  const handleAction = async (reportId: string, action: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("entity_reports")
        .update({ status: action })
        .eq("id", reportId);

      if (error) throw error;
      toast.success(`Report ${action} successfully`);
      // Update local state for immediate feedback
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const filteredReports = reports.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.trust_users?.institute_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="bg-tp-institute p-2 rounded-xl shadow-lg shadow-tp-institute/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            Verification Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Signal Validation Pipeline</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-tp-institute transition-colors" />
            <Input 
              placeholder="Search target or reporter..." 
              className="pl-10 bg-white border-slate-200 text-slate-700 w-full sm:w-64 focus:ring-tp-institute/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 font-bold text-lg">Active Reports</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Verified signals are propagated across the intelligence network instantly.</CardDescription>
              </div>
              <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 px-3 py-1 font-black tracking-widest">
                {filteredReports.length} PENDING
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reporting Entity</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence Flow</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <AnimatePresence mode="popLayout">
                    {filteredReports.map((report) => (
                      <motion.tr 
                        layout
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{report.name}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                              <MapPin className="w-3 h-3" />
                              {report.phone || report.email || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                              <Building2 className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-700">{report.trust_users?.institute_name}</p>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500 px-1 font-black">
                                  IQ {report.trust_users?.trust_score}
                                </Badge>
                                <span className="text-[8px] text-slate-600 font-bold uppercase">{report.trust_users?.city}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] font-black uppercase px-2 py-0.5">
                            {report.fraud_type || report.issue_type || "SUSPICIOUS"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-[10px] text-slate-400 font-medium italic line-clamp-1">
                            "{report.description || "No context provided"}"
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              onClick={() => handleAction(report.id, 'verified')}
                              className="h-8 px-4 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-[10px] font-black rounded-lg transition-all"
                            >
                              VERIFY
                            </Button>
                            <Button 
                              onClick={() => handleAction(report.id, 'rejected')}
                              className="h-8 px-4 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[10px] font-black rounded-lg transition-all"
                            >
                              REJECT
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredReports.length === 0 && (
              <div className="py-32 text-center">
                <div className="relative inline-block">
                  <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full"
                  />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-6">All signals validated. Network is clean.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationQueue;

