import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { calculateLeadScore } from "@/lib/leadScoring";
import { runLeadCreatedRule } from "@/lib/automationEngine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onAdded: () => void;
  initialData?: any;
}

export const AddEntryModal = ({ isOpen, onClose, activeTab, onAdded, initialData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (initialData && isOpen) {
      const data = { ...initialData };
      if (data.subjects && Array.isArray(data.subjects)) {
        data.subjects = data.subjects.join(', ');
      }
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [initialData, isOpen]);

  const handleChange = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { 
        is_new: true,
        ...formData
      };

      if (activeTab === 'tutor_registrations') {
        payload.current_status = "Pending";
      } else if (activeTab === 'contact_messages') {
        payload.inquiry_type = "Manual Admin Entry";
      } else {
        payload.status = "Pending";
      }

      if (payload.subjects) {
        payload.subjects = payload.subjects.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      // Auto-score + auto follow-up for leads
      if (activeTab === 'leads') {
        const { score, temperature } = calculateLeadScore(payload);
        payload.lead_score = score;
        payload.lead_temperature = temperature;
        if (!initialData) {
          payload.next_follow_up = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          payload.follow_up_status = 'Pending';
        }
      }

      let error;
      if (initialData?.id) {
        delete payload.is_new;
        const { error: err } = await supabase.from(activeTab).update(payload).eq('id', initialData.id);
        error = err;
      } else {
        const { error: err } = await supabase.from(activeTab).insert([payload]);
        error = err;
      }
      
      if (error) {
        if (error.message.includes('column "is_new"')) {
           toast.error("Database schema update required. Please run supabase-lead-scoring.sql first.");
           return;
        }
        throw error;
      }
      
      toast.success("Entry added manually.");

      // Fire lead-created automation (idempotent, deduped by DB)
      if (activeTab === "leads" && !error) {
        // Get the newly inserted ID to pass to automation
        const { data: inserted } = await supabase
          .from("leads")
          .select("id")
          .eq("phone", payload.phone || "")
          .order("created_at", { ascending: false })
          .limit(1);
        if (inserted?.[0]?.id) {
          runLeadCreatedRule(inserted[0].id).catch(console.error);
        }
      }
      setFormData({});
      onAdded();
      onClose();
    } catch (err: any) {
      toast.error("Failed to add entry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (activeTab) {
      case "contact_messages":
        return (
          <>
            <div className="space-y-1">
              <Label>Name</Label><Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label><Input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label><Input value={formData.email || ''} type="email" onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Message / Notes</Label><Textarea value={formData.message || ''} onChange={e => handleChange('message', e.target.value)} />
            </div>
          </>
        );
      case "counselling_requests":
        return (
          <>
            <div className="space-y-1">
              <Label>Name</Label><Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label><Input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Student Class/Age</Label><Input value={formData.class_age || ''} onChange={e => handleChange('class_age', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Concern</Label><Textarea value={formData.concern || ''} onChange={e => handleChange('concern', e.target.value)} />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label><Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label><Input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>City</Label><Input value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Class / Exam</Label><Input value={formData.class_level || ''} onChange={e => handleChange('class_level', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <Label>Subjects (Comma-separated)</Label>
              <Input value={formData.subjects || ''} onChange={e => handleChange('subjects', e.target.value)} placeholder="Maths, Science" />
            </div>

            {activeTab === 'tutor_registrations' && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-dashed">
                <div className="space-y-1">
                  <Label className="text-xs">Gender</Label>
                  <select
                    value={formData.gender || ''}
                    onChange={e => handleChange('gender', e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Age</Label>
                  <Input type="number" value={formData.age || ''} onChange={e => handleChange('age', e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Communication Level</Label>
                  <select
                    value={formData.communication_level || ''}
                    onChange={e => handleChange('communication_level', e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white"
                  >
                    <option value="">Select Level</option>
                    <option value="Competent">Competent</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Expert">Expert</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                  Lead Scoring Fields
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Budget</Label>
                    <select
                      onChange={e => handleChange('budget', e.target.value)}
                      className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Not specified</option>
                      <option value="Below ₹1500">Below ₹1500</option>
                      <option value="₹1500–3000">₹1500–3000 (+15 pts)</option>
                      <option value="Above ₹3000">Above ₹3000 (+25 pts)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Urgency</Label>
                    <select
                      onChange={e => handleChange('urgency', e.target.value)}
                      className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Not specified</option>
                      <option value="Within 3 Days">Within 3 Days (+25 pts)</option>
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Teaching Mode</Label>
                    <select
                      onChange={e => handleChange('mode', e.target.value)}
                      className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Not specified</option>
                      <option value="Home Tuition">Home Tuition (+10 pts)</option>
                      <option value="Online">Online</option>
                      <option value="Both">Both (Online + Home)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Preferred Tutor Gender</Label>
                    <select
                      onChange={e => handleChange('preferred_tutor_gender', e.target.value)}
                      className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">No Preference</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  Score auto-computed on save · Class 10/12 +20 · City filled +10
                </p>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-pink-500" />
                  Marketing Attribution
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Lead Source</Label>
                    <select
                      onChange={e => handleChange('source', e.target.value)}
                      className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Organic">Organic</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Referral">Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Campaign Cost (₹)</Label>
                    <Input type="number" placeholder="0" onChange={e => handleChange('campaign_cost', e.target.value)} className="h-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Campaign Name</Label>
                  <Input placeholder="e.g. Search_Delhi_Maths_April" onChange={e => handleChange('campaign_name', e.target.value)} className="h-9" />
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="capitalize">{initialData ? 'Edit' : 'Add'} Custom {activeTab.replace(/_/g, ' ')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {renderFields()}
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
