"use client";

import { useState, useEffect } from "react";
import { exchangeService } from "../services/exchangeService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Zap, Search, Filter, ShieldCheck, 
  MapPin, BookOpen, Banknote, Clock, 
  Plus, ChevronRight, Share2, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LeadExchangeMarketplace = ({ user }: any) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const loadMarketplace = async () => {
    setLoading(true);
    try {
      const data = await exchangeService.fetchMarketplace();
      setLeads(data || []);
    } catch (err) {
      console.error("Marketplace Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMarketplace(); }, []);

  const handleClaim = async (leadId: string) => {
    if (!user) return;
    try {
      await exchangeService.claimLead(user.id, leadId, "Interested in this lead.");
      loadMarketplace();
    } catch (err) {
      console.error("Claim Failed:", err);
    }
  };

  const filteredLeads = leads.filter(l => 
    (l.subject.toLowerCase().includes(search.toLowerCase()) || 
     l.location_slug.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === "all" || (activeFilter === "safe" && l.parent_risk_score < 30))
  );

  return (
    <div className="space-y-6">
      {/* Marketplace Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
            <Input 
              placeholder="Search leads, subjects, locations..." 
              className="pl-11 h-11 bg-white border-slate-200 rounded-xl font-bold text-xs shadow-sm focus:ring-2 focus:ring-tp-institute/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            <Badge className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-none">All Modes</Badge>
            <Badge className="bg-white text-slate-500 border-slate-200 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">Elite Only</Badge>
         </div>
      </div>

      {/* Exchange Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
            {loading ? (
               Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-slate-50 rounded-xl animate-pulse border border-slate-200" />
               ))
            ) : filteredLeads.map((lead) => (
               <motion.div 
                 key={lead.id} 
                 layout 
                 initial={{ opacity: 0, scale: 0.98 }} 
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
               >
                  <Card className="bg-white border-slate-200 hover:border-tp-institute/30 transition-all rounded-xl overflow-hidden group shadow-sm hover:shadow-lg relative flex flex-col h-full">
                     <div className={cn(
                       "h-1.5 w-full",
                       (lead.parent_risk_score > 50) ? "bg-rose-500" : (lead.parent_risk_score > 20) ? "bg-amber-500" : "bg-emerald-500"
                     )} />
                     
                     <CardContent className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-tp-institute/10 transition-colors">
                                 <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-tp-institute transition-colors" />
                              </div>
                              <div>
                                 <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">{lead.subject}</h3>
                                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{lead.grade_level} • {lead.mode}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <Badge className={cn(
                                "text-[8px] font-black uppercase px-2 py-0.5",
                                (lead.parent_risk_score > 50) ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-500 border-emerald-100"
                              )}>
                                 {lead.parent_risk_level || 'SAFE'}
                              </Badge>
                           </div>
                        </div>

                        <div className="space-y-3 mb-6">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <MapPin className="w-3 h-3 text-tp-institute" /> {lead.location_slug}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <Banknote className="w-3 h-3 text-tp-institute" /> ₹{lead.budget_min} - ₹{lead.budget_max}
                           </div>
                           <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-medium leading-relaxed line-clamp-2">"{lead.notes || 'No specific notes.'}"</p>
                           </div>
                        </div>

                        <div className="mt-auto space-y-4">
                           <div className="flex items-center justify-between p-3 bg-tp-institute/5 rounded-xl border border-tp-institute/10">
                              <div>
                                 <div className="text-[7px] font-black text-tp-institute uppercase tracking-widest mb-0.5">Comm</div>
                                 <div className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{lead.payment_terms}</div>
                              </div>
                              <div className="text-right text-lg font-black text-tp-institute leading-none">{lead.commission_percent}%</div>
                           </div>

                           <div className="flex gap-2">
                              <Button 
                                onClick={() => handleClaim(lead.id)}
                                className="flex-1 h-10 bg-slate-900 text-white rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-tp-institute transition-all shadow-md"
                              >
                                 Claim Node
                              </Button>
                              <Button variant="outline" className="w-10 h-10 border-slate-200 text-slate-400 rounded-lg hover:text-tp-institute hover:border-tp-institute transition-all">
                                 <Share2 className="w-3.5 h-3.5" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Network Pulse Overlay */}
      {!loading && filteredLeads.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-8">
           <div className="w-2 h-2 bg-tp-institute rounded-full animate-ping" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Marketplace Synchronized • {filteredLeads.length} Available Nodes</span>
        </div>
      )}
    </div>
  );
};
