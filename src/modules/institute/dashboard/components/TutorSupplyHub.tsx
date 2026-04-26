"use client";

import { useState, useEffect } from "react";
import { tutorService } from "../services/tutorService";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, ShieldCheck, MapPin, Star, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const TutorSupplyHub = ({ user }: any) => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSupply = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tutor_profiles")
        .select(`
          id, 
          full_name, 
          bio, 
          verification_level, 
          min_fee,
          created_at,
          tutor_reputation_metrics!fk_reputation_tutor(reputation_score),
          tutor_subjects!fk_subjects_tutor(subject_name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supply Matrix Error Details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      setTutors(data || []);
    } catch (err: any) {
      console.error("Supply Matrix Sync Failure:", err.message || err);
      // Fallback to simple select if join fails
      const { data: simpleData } = await supabase
        .from("tutor_profiles")
        .select("*")
        .eq("is_active", true)
        .limit(10);
      
      if (simpleData) setTutors(simpleData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSupply(); }, []);

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-tp-institute transition-colors" />
            <Input 
              placeholder="Search global talent by subject or name..." 
              className="pl-14 h-16 bg-white border-slate-200 rounded-[2rem] font-bold shadow-sm focus:ring-2 focus:ring-tp-institute/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            <Badge className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none">All Modes</Badge>
            <Badge className="bg-white text-slate-500 border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Premium Only</Badge>
         </div>
      </div>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
             <div className="p-4 bg-slate-50 rounded-full animate-pulse"><GraduationCap className="w-8 h-8" /></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Supply Matrix...</span>
          </div>
        ) : tutors.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
             <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Tutors Found</p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <motion.div key={tutor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
              <Card className="bg-white border-slate-200 hover:border-tp-institute/30 transition-all rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-md h-full flex flex-col">
                <CardContent className="p-8 flex-grow">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative">
                         <Users className="w-7 h-7 text-slate-300" />
                         {tutor.verification_level === 'premium' && (
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"><Star className="w-3 h-3 text-white fill-current" /></div>
                         )}
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-tp-institute uppercase tracking-widest">{tutor.verification_level} Node</div>
                         <div className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{tutor.tutor_reputation_metrics?.[0]?.reputation_score || 50}% IQ</div>
                      </div>
                   </div>

                   <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{tutor.full_name}</h3>
                   <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-4">{tutor.bio || 'Expert educator in the intelligence network.'}</p>

                   <div className="flex flex-wrap gap-2 mb-6">
                      {tutor.tutor_subjects?.slice(0, 3).map((s: any) => (
                        <Badge key={s.subject_name} className="bg-slate-50 text-slate-500 border-slate-100 text-[8px] font-black uppercase px-2">{s.subject_name}</Badge>
                      ))}
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-tp-institute" /> Region Node</span>
                      <span className="text-slate-900 font-bold">₹{tutor.min_fee}/hr</span>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
