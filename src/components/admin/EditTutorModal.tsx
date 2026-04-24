import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tutor: any | null;
  onSuccess: () => void;
}

export const EditTutorModal = ({ isOpen, onClose, tutor, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (tutor && isOpen) {
      setFormData({ ...tutor });
    }
  }, [tutor, isOpen]);

  const handleChange = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleArrayChange = (key: string, val: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [key]: val.split(',').map(s => s.trim()).filter(Boolean) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Intentionally limiting the payload to exactly what we touch
      const payload = {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        qualification: formData.qualification,
        subjects: formData.subjects,
        classes: formData.classes,
        experience: formData.experience,
        expected_fees: formData.expected_fees,
        communication_level: formData.communication_level,
        communication_skills: formData.communication_skills,
        age: parseInt(formData.age || "0") || null,
        dob: formData.dob,
        teaching_mode: formData.teaching_mode,
        city: formData.city,
        languages: formData.languages,
        demo_availability: formData.demo_availability,
        photo_name: formData.photo_name,
        id_proof_name: formData.id_proof_name,
        resume_name: formData.resume_name,
      };

      const { error } = await supabase.from('tutor_registrations').update(payload).eq('id', tutor.id);
      
      if (error) {
        if (error.message.includes("column")) {
          toast.error("Database missing new Tutor profile columns. Run the SQL upgrade script!");
          return;
        }
        throw error;
      }

      toast.success("Tutor Profile successfully updated.");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!tutor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tutor Profile</DialogTitle>
          <DialogDescription>Update the professional service structure constraints here.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} />
          </div>
          
          <div className="space-y-1">
            <Label>Gender</Label>
            <Select value={formData.gender || ''} onValueChange={v => handleChange('gender', v)}>
              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Date of Birth</Label>
            <Input value={formData.dob || ''} onChange={e => handleChange('dob', e.target.value)} placeholder="DD/MM/YYYY" />
          </div>

          <div className="space-y-1">
            <Label>Age</Label>
            <Input type="number" value={formData.age || ''} onChange={e => handleChange('age', e.target.value)} placeholder="e.g. 25" />
          </div>

          <div className="space-y-1">
            <Label>Highest Qualification</Label>
            <Input value={formData.qualification || ''} onChange={e => handleChange('qualification', e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Subjects Expertise (Comma separated)</Label>
            <Input value={formData.subjects?.join(', ') || ''} onChange={e => handleArrayChange('subjects', e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Grades / Levels Taught (Comma separated)</Label>
            <Input value={formData.classes?.join(', ') || ''} onChange={e => handleArrayChange('classes', e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Experience</Label>
            <Input value={formData.experience || ''} onChange={e => handleChange('experience', e.target.value)} placeholder="e.g. 5 Years" />
          </div>

          <div className="space-y-1">
            <Label>Communication Level</Label>
            <Select value={formData.communication_level || ''} onValueChange={v => handleChange('communication_level', v)}>
              <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Competent">Competent</SelectItem>
                <SelectItem value="Proficient">Proficient</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Hourly Rate (₹)</Label>
            <Input value={formData.expected_fees || ''} onChange={e => handleChange('expected_fees', e.target.value)} placeholder="e.g. ₹500/hr" />
          </div>

          <div className="space-y-1">
            <Label>Mode of Teaching</Label>
            <Select value={formData.teaching_mode || ''} onValueChange={v => handleChange('teaching_mode', v)}>
              <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Location / City</Label>
            <Input value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Languages Known (Comma separated)</Label>
            <Input value={formData.languages?.join(', ') || ''} onChange={e => handleArrayChange('languages', e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Demo Availability</Label>
            <Input value={formData.demo_availability || ''} onChange={e => handleChange('demo_availability', e.target.value)} placeholder="e.g. Weekends only" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label>Communication Skills Notes</Label>
            <Textarea value={formData.communication_skills || ''} onChange={e => handleChange('communication_skills', e.target.value)} placeholder="Notes on articulation, language tone..." />
          </div>

          <div className="md:col-span-2 pt-4 border-t mt-2">
            <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Document Handling</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Profile Photo File</Label>
                <Input value={formData.photo_name || ''} onChange={e => handleChange('photo_name', e.target.value)} placeholder="photo.jpg" className="text-xs h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ID Proof File</Label>
                <Input value={formData.id_proof_name || ''} onChange={e => handleChange('id_proof_name', e.target.value)} placeholder="id.pdf" className="text-xs h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Resume File</Label>
                <Input value={formData.resume_name || ''} onChange={e => handleChange('resume_name', e.target.value)} placeholder="cv.pdf" className="text-xs h-8" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 italic">* Currently tracks filenames in DB. Replace filenames to update document links.</p>
          </div>

          <div className="md:col-span-2 pt-4 flex justify-end gap-2 border-t mt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

