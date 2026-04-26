"use client";

import { useState, useEffect } from "react";
import { crmService } from "../services/crmService";
import { instituteService } from "../services/instituteService";
import { tutorService } from "../services/tutorService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Phone, User, BookOpen, ChevronRight, Zap, ShieldCheck, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CRMLeadPipeline = ({ user }: any) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadName, setNewLeadName] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [matchingTutors, setMatchingTutors] = useState<any[]>([]);

  const loadLeads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await crmService.fetchLeads(user.id);
      const enhanced = await Promise.all(data.map(async (lead: any) => {
         try {
           const riskData = await instituteService.quickLookup(lead.parent_phone);
           return { ...lead, risk: riskData?.risk };
         } catch (err) {
           return { ...lead, risk: { risk_level: 'UNTRACKED', risk_score: 0 } };
         }
      }));
      setLeads(enhanced);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLeads(); }, [user]);

  const handleSelectLead = async (lead: any) => {
    setSelectedLead(lead);
    const matches = await tutorService.findMatchesForLead(lead.id);
    setMatchingTutors(matches || []);
  };

  const handleAddLead = async () => {
    if (!newLeadPhone) return;
    await crmService.createLead(user.id, {
      parent_phone: newLeadPhone.replace(/\D/g, ""),
      parent_name: newLeadName,
      status: 'new'
    });
    setNewLeadPhone("");
    setNewLeadName("");
    loadLeads();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'demo_scheduled': return 'bg-tp-institute/10 text-tp-institute border-tp-institute/20';
      case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        {/* Compact Quick Add Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full relative">
             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <Input 
               type="tel"
               placeholder="Parent Phone..." 
               className="pl-9 h-10 bg-slate-50 border-none rounded-lg font-bold text-xs"
               value={newLeadPhone}
               onChange={(e) => {
                 const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                 setNewLeadPhone(val);
               }}
             />
          </div>
          <div className="flex-1 w-full relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <Input 
               placeholder="Student Name..." 
               className="pl-9 h-10 bg-slate-50 border-none rounded-lg font-bold text-xs"
               value={newLeadName}
               onChange={(e) => setNewLeadName(e.target.value)}
             />
          </div>
          <Button onClick={handleAddLead} className="h-10 px-6 bg-slate-900 text-white rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-tp-institute transition-all shadow-md">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Node
          </Button>
        </div>

        {/* Compact Pipeline List */}
        <div className="space-y-3">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[9px] animate-pulse">Syncing Funnel...</div>
          ) : leads.map((lead) => (
            <Card 
              key={lead.id} 
              onClick={() => handleSelectLead(lead)}
              className={cn(
                "bg-white border-slate-200 hover:border-tp-institute/30 transition-all group cursor-pointer rounded-xl overflow-hidden shadow-sm",
                selectedLead?.id === lead.id && "border-tp-institute ring-2 ring-tp-institute/5 shadow-md"
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-4 gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-tp-institute/5 transition-colors">
                     <User className="w-5 h-5 text-slate-300 group-hover:text-tp-institute transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate">{lead.parent_name || 'Anonymous'}</h3>
                      <Badge className={cn("text-[7px] font-black uppercase tracking-widest px-1.5 py-0", getStatusColor(lead.status))}>{lead.status}</Badge>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Phone className="w-3 h-3 text-tp-institute" /> +91 {lead.parent_phone}
                    </div>
                  </div>
                  <div className="text-right pr-2">
                     <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Risk</div>
                     <Badge className={cn(
                       "text-[8px] font-black uppercase px-2 py-0",
                       (lead.risk?.risk_score > 50) ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-500 border-emerald-100"
                     )}>{lead.risk?.risk_level || 'SAFE'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compact Sidebar Match */}
      <div className="space-y-6">
        {selectedLead ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5 text-amber-500" /> Smart Match
               </h2>
               <Badge className="bg-tp-institute/10 text-tp-institute border-tp-institute/20 text-[8px] font-black uppercase px-1.5">{matchingTutors.length} Found</Badge>
            </div>
            <div className="space-y-2">
              {matchingTutors.map((tutor) => (
                <div key={tutor.tutor_id} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-tp-institute/30 transition-all group shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{tutor.full_name}</h4>
                      <div className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">IQ: {tutor.match_iq} • {tutor.risk_score}% RISK</div>
                    </div>
                    <Button size="sm" className="h-6 px-3 bg-slate-900 text-white text-[7px] font-black uppercase rounded-lg hover:bg-tp-institute">Assign</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
             <Search className="w-6 h-6 text-slate-200 mb-3" />
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed italic">Select lead for suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
