"use client";

import { useState } from "react";
import { exchangeService } from "../services/exchangeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogDescription 
} from "@/components/ui/dialog";
import { 
  Zap, MapPin, BookOpen, Banknote, 
  ShieldCheck, AlertTriangle, Send, Loader2
} from "lucide-react";

export const PostLeadModal = ({ user, onSuccess }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parent_phone: "",
    parent_name: "",
    subject: "",
    grade_level: "",
    location_slug: "",
    budget_min: "",
    budget_max: "",
    mode: "both",
    notes: "",
    commission_percent: "50",
    payment_terms: "First Month 50%"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await exchangeService.postLead(user.id, {
        ...formData,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        commission_percent: parseFloat(formData.commission_percent)
      });
      setOpen(false);
      if (onSuccess) onSuccess();
      setFormData({
        parent_phone: "",
        parent_name: "",
        subject: "",
        grade_level: "",
        location_slug: "",
        budget_min: "",
        budget_max: "",
        mode: "both",
        notes: "",
        commission_percent: "50",
        payment_terms: "First Month 50%"
      });
    } catch (err) {
      console.error("Broadcast Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-6 bg-tp-institute text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-tp-institute/10">
           Post Lead to Exchange
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-slate-800">
           <div>
              <DialogTitle className="text-lg font-black text-white tracking-tight uppercase mb-0.5">Broadcast Intelligence</DialogTitle>
              <DialogDescription className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">Global Network Gateway</DialogDescription>
           </div>
           <div className="w-10 h-10 bg-tp-institute/10 rounded-xl flex items-center justify-center border border-tp-institute/20">
              <Zap className="w-5 h-5 text-tp-institute" />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Phone</label>
                 <Input 
                   required
                   placeholder="10-digit phone"
                   className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                   value={formData.parent_phone}
                   onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Name</label>
                 <Input 
                   placeholder="Full Name"
                   className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                   value={formData.parent_name}
                   onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject & Grade</label>
                 <Input 
                   required
                   placeholder="e.g. Physics Grade 12"
                   className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                   value={formData.subject}
                   onChange={(e) => setFormData({...formData, subject: e.target.value})}
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location Node</label>
                 <Input 
                   required
                   placeholder="City or Area Slug"
                   className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                   value={formData.location_slug}
                   onChange={(e) => setFormData({...formData, location_slug: e.target.value})}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget Range</label>
                 <div className="flex gap-2">
                    <Input 
                      placeholder="Min"
                      className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                    />
                    <Input 
                      placeholder="Max"
                      className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Comm (%)</label>
                 <Input 
                   type="number"
                   className="h-10 bg-slate-50 border-slate-100 rounded-lg font-bold text-xs focus:ring-tp-institute/20"
                   value={formData.commission_percent}
                   onChange={(e) => setFormData({...formData, commission_percent: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Additional Intelligence</label>
              <Textarea 
                placeholder="Specific requirements..."
                className="bg-slate-50 border-slate-100 rounded-xl font-medium min-h-[80px] text-xs focus:ring-tp-institute/20"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
           </div>

           <div className="pt-2 flex gap-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 h-11 bg-tp-institute text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-tp-institute/10"
              >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Broadcast Intelligence"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 px-6 border-slate-200 text-slate-500 rounded-xl font-black uppercase text-[9px] tracking-widest">
                 Cancel
              </Button>
           </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
