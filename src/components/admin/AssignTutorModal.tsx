import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Star, CheckCircle, GraduationCap, MapPin, User, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSmartTutorMatches } from "@/lib/tutorMatcher";
import { toast } from "sonner";
import { format } from "date-fns";

export const AssignTutorModal = ({ isOpen, onClose, lead, activeTab, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [workloads, setWorkloads] = useState<Record<string, number>>({});
  
  // Phase 2 State
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [startDate, setStartDate] = useState("");
  const [fee, setFee] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && lead) {
      reset();
      fetchTutors();
      fetchWorkloads();
    }
  }, [isOpen, lead]);

  const fetchWorkloads = async () => {
     try {
       const { data } = await supabase.from('lead_tutor_assignments').select('tutor_id').eq('status', 'Active');
       if (data) {
         setWorkloads(data.reduce((acc: any, curr: any) => { acc[curr.tutor_id] = (acc[curr.tutor_id] || 0) + 1; return acc; }, {}));
       }
     } catch(e) {}
  };

  const reset = () => {
    setSelectedTutor(null);
    setSearchQuery("");
    setStartDate("");
    setFee("");
    setNotes("");
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      // Get AI Ranked Matches First
      let matches = await getSmartTutorMatches(lead);
      const matchIds = matches.map((m: any) => m.id);

      // Get rest of active tutors
      const { data: allUnranked } = await supabase.from('tutor_registrations').select('*').neq('current_status', 'Pending');
      const unranked = (allUnranked || []).filter((t: any) => !matchIds.includes(t.id));
      
      setTutors([...matches, ...unranked]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!startDate) {
      toast.error("Start Date is mandatory.");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Insert Assignment
      const { error: assignError } = await supabase.from('lead_tutor_assignments').insert({
        lead_id: lead.id,
        lead_name: lead.name || 'Anonymous',
        lead_phone: lead.phone || lead.mobile || '',
        location: lead.city || lead.area || '',
        class_level: lead.class_level || lead.exam || lead.class || '',
        tutor_id: selectedTutor.id,
        tutor_name: selectedTutor.name,
        tutor_phone: selectedTutor.phone,
        start_date: startDate,
        fee: fee ? parseFloat(fee) : null,
        notes: notes,
        status: 'Active'
      });

      if (assignError) throw assignError;

      // 2. Update Lead Status
      const { error: leadError } = await supabase.from(activeTab).update({
        status: 'Converted',
        is_new: false
      }).eq('id', lead.id);

      if (leadError) throw leadError;

      toast.success("Tutor successfully assigned!");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to assign tutor");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tutors.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone?.includes(searchQuery) ||
    t.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(t.subjects) ? t.subjects.join(' ') : '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-gray-50">
        <DialogHeader className="bg-white px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            {selectedTutor ? "Confirm Assignment Details" : "Assign Tutor"}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1 text-sm bg-indigo-50/50 p-2 rounded border border-indigo-100">
             <User className="w-4 h-4 text-indigo-500" /> Lead: <strong>{lead?.name || 'Unknown'}</strong> ({lead?.phone})
          </div>
        </DialogHeader>

        <div className="p-0">
          {!selectedTutor ? (
            <div className="flex flex-col h-[55vh]">
              {/* Search Header */}
              <div className="px-5 py-3 border-b bg-white flex shrink-0">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search global registry (name, phone, location, subject)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-gray-50"
                  />
                </div>
              </div>

              {/* Tutors List */}
              <div className="overflow-y-auto flex-1 p-5 space-y-3">
                {loading ? (
                  <div className="flex py-10 justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : filtered.length === 0 ? (
                   <p className="text-center py-10 text-gray-500 text-sm">No tutors found.</p>
                ) : (
                  filtered.map((tutor) => (
                    <div key={tutor.id} className="bg-white border rounded-xl overflow-hidden hover:border-indigo-300 transition-colors shadow-sm relative group flex items-center justify-between p-4">
                      {tutor.matchScore > 0 && !searchQuery && (
                         <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 font-black text-[10px] px-2.5 py-0.5 rounded-bl-lg border-b border-l border-orange-200 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-orange-500" /> TOP MATCH ({tutor.matchScore}%)
                         </div>
                      )}
                      
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-gray-900 leading-none mb-2 text-lg flex items-center">
                           {tutor.name}
                           {workloads[tutor.id] && (
                             <span className="ml-2 bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded shadow-sm border border-indigo-200" title="Active Assignments">
                               {workloads[tutor.id]} Assigned
                             </span>
                           )}
                        </h4>
                        <div className="flex flex-wrap items-center col-span-2 gap-y-1.5 gap-x-4 text-xs text-gray-600 font-medium">
                           <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 w-fit">
                             <GraduationCap className="w-3 h-3" /> {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || 'General Subjects')}
                           </div>
                           <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /> {tutor.city || '-'}</div>
                           <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> ⭐ Exp: {tutor.experience || '-'}</div>
                           <div className="flex items-center gap-1 font-bold text-gray-900">₹ {tutor.expected_fees || '-'}</div>
                        </div>
                      </div>

                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => setSelectedTutor(tutor)}
                        className="shrink-0 bg-[#18181b] hover:bg-black font-semibold shadow-sm w-24"
                      >
                         Assign <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-5 bg-white">
               {/* Selected Tutor Block */}
               <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Selected Tutor</p>
                    <p className="font-bold text-gray-900">{selectedTutor.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTutor(null)} className="h-8 text-blue-600 hover:text-blue-800">Change</Button>
               </div>

               {/* Form */}
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                     <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="h-10 border-gray-300 shadow-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Fee (Optional)</label>
                     <Input type="number" placeholder="₹" value={fee} onChange={e => setFee(e.target.value)} className="h-10 border-gray-300 shadow-sm" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Optional)</label>
                   <Input placeholder="e.g. Trial class completed, mapping 4 days a week..." value={notes} onChange={e => setNotes(e.target.value)} className="h-10 border-gray-300 shadow-sm" />
                 </div>
               </div>

               <div className="pt-4 flex justify-end gap-3 border-t">
                  <Button variant="outline" onClick={() => setSelectedTutor(null)} className="h-10">Cancel</Button>
                  <Button variant="default" onClick={handleAssign} disabled={loading} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow border-0 px-6">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} Confirm Assignment
                  </Button>
               </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
