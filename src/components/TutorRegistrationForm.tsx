import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, Video, ArrowRight, ArrowLeft, X, Loader2, MapPin, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { openWhatsApp } from "@/modules/shared/logic/whatsapp";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "tutor_registration_draft";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Science", "Social Studies", "Computer Science", "Economics", "Accountancy", "French", "German", "Spanish"];
const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
const LANGUAGES = ["English", "Hindi", "Punjabi", "Urdu", "French", "German", "Spanish"];
const CLASS_GROUPS = [
  { label: "1–5", value: "1-5" },
  { label: "6–8", value: "6-8" },
  { label: "9–10", value: "9-10" },
  { label: "11–12", value: "11-12" },
  { label: "Competitive Exams", value: "competitive" },
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning (8–12)", "Afternoon (12–4)", "Evening (4–8)"];
const QUALIFICATIONS = ["12th Pass", "Undergraduate", "Graduate", "Post Graduate", "PhD", "B.Ed", "M.Ed"];
const EXPERIENCE_OPTIONS = ["0–1 years", "1–3 years", "3–5 years", "5+ years"];
const STATUS_OPTIONS = ["Student", "Working Professional", "Full-time Tutor"];
const CITIES = ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"];
const STATES = ["Delhi", "Haryana", "Uttar Pradesh", "Rajasthan", "Punjab", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Bihar", "Madhya Pradesh"];
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const COMMUNICATION_LEVELS = ["Competent", "Proficient", "Expert", "Master"];

interface FormData {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  gender: string;
  age: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  teachingMode: string;
  preferredAreaIds: number[];
  homeArea: string;
  stateId: number | null;
  cityId: number | null;
  languages: string[];
  qualification: string;
  specialization: string;
  experience: string;
  currentStatus: string;
  communicationLevel: string;
  availableDays: string[];
  timeSlots: string[];
  expectedFees: string;
  travelWilling: string;
  travelRadius: string;
  bio: string;
  videoLink: string;
}

const defaultForm: FormData = {
  name: "", phone: "", email: "", state: "", city: "",
  gender: "", age: "",
  subjects: [], classes: [], boards: [], teachingMode: "", preferredAreaIds: [], languages: [], homeArea: "",
  stateId: null, cityId: null,
  qualification: "", specialization: "", experience: "", currentStatus: "", communicationLevel: "", availableDays: [], timeSlots: [], expectedFees: "", travelWilling: "", travelRadius: "",
  bio: "", videoLink: "",
};

const stepTitles = ["Basic Info", "Teaching Profile", "Experience", "Verification"];

interface Props {
  onClose?: () => void;
  isModal?: boolean;
  sourcePage?: string;
  sourceCta?: string;
}

const TutorRegistrationForm = ({ onClose, isModal = false, sourcePage, sourceCta }: Props) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [idProofName, setIdProofName] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<{id: number, name: string}[]>([]);
  const [states, setStates] = useState<{id: number, name: string}[]>([]);
  const [cities, setCities] = useState<{id: number, name: string}[]>([]);
  const [masterData, setMasterData] = useState<{
    subjects: {id: number, name: string}[];
    classes: {id: number, label: string, value: string}[];
    boards: {id: number, name: string}[];
    languages: {id: number, name: string}[];
    days: {id: number, name: string}[];
    slots: {id: number, label: string}[];
  }>({ subjects: [], classes: [], boards: [], languages: [], days: [], slots: [] });
  const [areaSearch, setAreaSearch] = useState("");
  const [homeAreaSearch, setHomeAreaSearch] = useState("");
  const [showHomeAreaDropdown, setShowHomeAreaDropdown] = useState(false);
  const [showPreferredDropdown, setShowPreferredDropdown] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all master data on mount
  useEffect(() => {
    async function init() {
      const [
        { data: s }, { data: c }, { data: b }, { data: l }, { data: d }, { data: ts }, { data: st }
      ] = await Promise.all([
        supabase.from('master_subjects').select('id, name').order('name'),
        supabase.from('master_classes').select('id, label, value').order('sort_order'),
        supabase.from('master_boards').select('id, name').order('name'),
        supabase.from('master_languages').select('id, name').order('name'),
        supabase.from('master_days').select('id, name').order('sort_order'),
        supabase.from('master_time_slots').select('id, label').order('sort_order'),
        supabase.from('states').select('id, name').order('name')
      ]);

      setMasterData({
        subjects: s || [],
        classes: c || [],
        boards: b || [],
        languages: l || [],
        days: d || [],
        slots: ts || []
      });
      if (st) setStates(st);
    }
    init();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    async function fetchCities() {
      if (!form.stateId) {
        setCities([]);
        return;
      }
      const { data } = await supabase.from('cities').select('id, name').eq('state_id', form.stateId).order('name');
      if (data) setCities(data);
    }
    fetchCities();
  }, [form.stateId]);

  // Fetch areas when city changes
  useEffect(() => {
    async function fetchAreas() {
      if (!form.cityId) {
        setAvailableAreas([]);
        return;
      }
      const { data } = await supabase.from('areas').select('id, name').eq('city_id', form.cityId).order('name');
      if (data) {
        setAvailableAreas(data);
      }
    }
    fetchAreas();
  }, [form.cityId]);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.error("Failed to load draft:", e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, mounted]);



  const set = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const toggleArray = (field: keyof FormData, value: any) => {
    const arr = form[field] as any[];
    set(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit mobile required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
      if (!form.stateId) e.state = "State is required";
      if (!form.cityId) e.city = "City is required";
      if (!form.gender) e.gender = "Gender is required";
      if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 80) e.age = "Valid age required (18-80)";
    }
    if (s === 2) {
      if (form.subjects.length === 0) e.subjects = "Select at least one subject";
      if (form.classes.length === 0) e.classes = "Select at least one class group";
      if (form.boards.length === 0) e.boards = "Select at least one board";
      if (!form.teachingMode) e.teachingMode = "Select teaching mode";
      if ((form.teachingMode === "home" || form.teachingMode === "both") && form.preferredAreaIds.length === 0) e.preferredAreaIds = "Select at least one preferred location";
      if (form.languages.length === 0) e.languages = "Select at least one language";
    }
    if (s === 3) {
      if (!form.qualification) e.qualification = "Select qualification";
      if (!form.experience) e.experience = "Select experience";
      if (!form.currentStatus) e.currentStatus = "Select current status";
      if (!form.communicationLevel) e.communicationLevel = "Select communication level";
      if (form.availableDays.length === 0) e.availableDays = "Select available days";
      if (form.timeSlots.length === 0) e.timeSlots = "Select time slots";
      if (!form.expectedFees) e.expectedFees = "Enter expected fees";
    }
    if (s === 4) {
      if (!photoName) e.photo = "Profile photo required";
      if (!idProofName) e.idProof = "ID proof required";
      if (form.bio.trim().split(/\s+/).length > 200) e.bio = "Max 200 words";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => { 
    if (validate(step)) {
      // PARTIAL LEAD CAPTURE: Save/Update DB on every step
      await savePartialData(step);
      setStep(s => Math.min(s + 1, 4)); 
    }
  };

  const savePartialData = async (currentStep: number) => {
    try {
      const payload: any = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        state: form.state,
        city: form.city,
        step_reached: currentStep,
        // @ts-ignore
        source_page: sourcePage || null,
        // @ts-ignore
        source_cta: sourceCta || null,
      };

      if (currentStep >= 2) {
        payload.subjects = form.subjects;
        payload.classes = form.classes;
        payload.boards = form.boards;
        payload.teaching_mode = form.teachingMode;
        payload.preferred_locations = form.preferredAreaIds.length > 0 
          ? availableAreas.filter(a => form.preferredAreaIds.includes(a.id)).map(a => a.name).join(", ") 
          : null;
        payload.languages = form.languages;
      }

      if (currentStep >= 3) {
        payload.qualification = form.qualification;
        payload.specialization = form.specialization || null;
        payload.experience = form.experience;
        payload.current_status = form.currentStatus;
        payload.communication_level = form.communicationLevel;
        payload.available_days = form.availableDays;
        payload.time_slots = form.timeSlots;
        payload.expected_fees = form.expectedFees;
        payload.travel_willing = form.teachingMode === 'online' ? 'No' : 'Yes';
      }

      if (registrationId) {
        // Update existing record
        await supabase.from('tutor_registrations').update(payload).eq('id', registrationId);
      } else if (currentStep === 1) {
        // Create new record
        const { data, error } = await supabase.from('tutor_registrations').insert(payload).select('id').single();
        if (data) setRegistrationId(data.id);
      }
    } catch (e) {
      console.error("Step save failed:", e);
    }
  };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setIsSubmitting(true);
    try {
      const payload = {
        bio: form.bio || null,
        video_link: form.videoLink || null,
        photo_name: photoName || null,
        id_proof_name: idProofName || null,
        resume_name: resumeName || null,
        status: 'pending', // or 'completed' depending on your review flow
        step_reached: 4
      };

      if (registrationId) {
        const { error } = await supabase.from('tutor_registrations').update(payload).eq('id', registrationId);
        if (error) throw error;

        if (form.preferredAreaIds.length > 0 && (form.teachingMode === "home" || form.teachingMode === "both")) {
          await supabase.from('tutor_locations').delete().eq('tutor_id', registrationId);
          await supabase.from('tutor_locations').insert(form.preferredAreaIds.map(areaId => ({
            tutor_id: registrationId,
            area_id: areaId,
            mode: form.teachingMode === "both" ? "both" : "offline",
            is_primary: false
          })));
        }

        // ENTERPRISE SYNC: Populate Normalized Join Tables
        const syncJoins = async (tableName: string, masterList: any[], selectedValues: string[], idField: string, valueField: string = "name") => {
          await supabase.from(tableName).delete().eq('tutor_id', registrationId);
          const ids = masterList.filter(m => selectedValues.includes(m[valueField])).map(m => m.id);
          if (ids.length > 0) {
            await supabase.from(tableName).insert(ids.map(id => ({ tutor_id: registrationId, [idField]: id })));
          }
        };

        await Promise.all([
          syncJoins('tutor_subjects', masterData.subjects, form.subjects, 'subject_id'),
          syncJoins('tutor_classes', masterData.classes, form.classes, 'class_id', 'label'),
          syncJoins('tutor_boards', masterData.boards, form.boards, 'board_id'),
          syncJoins('tutor_languages', masterData.languages, form.languages, 'language_id'),
        ]);

        // Special handling for Availability (Days x Slots)
        await supabase.from('tutor_availability').delete().eq('tutor_id', registrationId);
        const availInserts: any[] = [];
        masterData.days.filter(d => form.availableDays.includes(d.name)).forEach(day => {
          masterData.slots.filter(s => form.timeSlots.includes(s.label)).forEach(slot => {
            availInserts.push({ tutor_id: registrationId, day_id: day.id, slot_id: slot.id });
          });
        });
        if (availInserts.length > 0) {
          await supabase.from('tutor_availability').insert(availInserts);
        }
      }

      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (setter: (n: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
      setter(file.name);
    }
  };

  const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-sm text-destructive mt-1">{errors[field]}</p> : null;

  const MultiSelect = ({ label, options, field }: { label: string; options: string[]; field: keyof FormData }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const selected = (form[field] as string[]).includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggleArray(field, opt)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"}`}>
              {opt}
            </button>
          );
        })}
      </div>
      <FieldError field={field} />
    </div>
  );

  if (!mounted) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile Submitted 🎉</h2>
        <p className="text-muted-foreground mb-6">We'll connect you with students near you within 24 hours.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="cta" size="lg" onClick={() => {
            openWhatsApp(`Hi, I just registered as a tutor. Name: ${form.name}, Subjects: ${form.subjects.join(", ")}`);
          }}>
            Continue on WhatsApp
          </Button>
          {onClose && <Button variant="outline" size="lg" onClick={onClose}>Close</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? "" : "max-w-2xl mx-auto"}`}>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {stepTitles.map((title, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i + 1 <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i + 1 < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{title}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">Step {step} of 4</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Tell us about yourself</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <Input placeholder="Enter your full name" value={form.name} onChange={e => set("name", e.target.value)} />
                  <FieldError field="name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Mobile Number *</label>
                  <Input placeholder="10-digit mobile number" value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
                  <FieldError field="phone" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email ID *</label>
                  <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                  <FieldError field="email" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Gender *</label>
                    <Select value={form.gender} onValueChange={v => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{GENDER_OPTIONS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                    <FieldError field="gender" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Age *</label>
                    <Input type="number" placeholder="e.g. 25" value={form.age} onChange={e => set("age", e.target.value)} />
                    <FieldError field="age" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State *</label>
                  <Select onValueChange={v => {
                    const s = states.find(st => st.id.toString() === v);
                    set("stateId", parseInt(v));
                    set("state", s?.name || "");
                    set("cityId", null);
                    set("city", "");
                    set("homeArea", "");
                    set("preferredAreaIds", []); // CLEAR selected areas if state changes
                  }} value={form.stateId?.toString()}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                      {states.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError field="state" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                  <Select onValueChange={v => {
                    const c = cities.find(ci => ci.id.toString() === v);
                    set("cityId", parseInt(v));
                    set("city", c?.name || "");
                    set("homeArea", "");
                    set("preferredAreaIds", []); // CLEAR selected areas if city changes
                  }} value={form.cityId?.toString()} disabled={!form.stateId}>
                    <SelectTrigger><SelectValue placeholder={form.stateId ? "Select City" : "Choose state first"} /></SelectTrigger>
                    <SelectContent>
                      {cities.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError field="city" />
                </div>
              </div>

              {/* Residential Area Selector - Searchable Dropdown */}
              {form.cityId && (
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-1">Your Residential Area (Local) *</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search your area..." 
                      className="pl-9"
                      value={showHomeAreaDropdown ? homeAreaSearch : form.homeArea}
                      onFocus={() => setShowHomeAreaDropdown(true)}
                      onChange={e => setHomeAreaSearch(e.target.value)}
                    />
                  </div>
                  {showHomeAreaDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                      {availableAreas
                        .filter(a => a.name.toLowerCase().includes(homeAreaSearch.toLowerCase()))
                        .map(a => (
                          <button
                            key={a.id}
                            onClick={() => {
                              set("homeArea", a.name);
                              setHomeAreaSearch("");
                              setShowHomeAreaDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                          >
                            {a.name}
                          </button>
                        ))
                      }
                      {availableAreas.filter(a => a.name.toLowerCase().includes(homeAreaSearch.toLowerCase())).length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground italic">No matching areas found</div>
                      )}
                    </div>
                  )}
                  {showHomeAreaDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowHomeAreaDropdown(false)} />}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-foreground">Your Teaching Profile</h3>
              <MultiSelect label="Subjects You Teach *" options={masterData.subjects.map(s => s.name)} field="subjects" />
              <MultiSelect label="Classes/Grades *" options={masterData.classes.map(c => c.label)} field="classes" />
              <MultiSelect label="Boards *" options={masterData.boards.map(b => b.name)} field="boards" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Teaching Mode *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: "Online", value: "online" }, { label: "Home Tuition", value: "home" }, { label: "Both", value: "both" }].map(m => (
                    <button key={m.value} type="button" onClick={() => set("teachingMode", m.value)}
                      className={`py-2.5 px-3 rounded-lg text-sm border transition-all ${form.teachingMode === m.value ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <FieldError field="teachingMode" />
              </div>
              {(form.teachingMode === "home" || form.teachingMode === "both") && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Preferred Locations (Areas in {form.city || "your city"}) *</label>
                  
                  {/* Selected Areas Tags */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-lg bg-muted/30">
                    {form.preferredAreaIds.length === 0 && <span className="text-sm text-muted-foreground italic">No areas selected yet...</span>}
                    {form.preferredAreaIds.map(id => {
                      const area = availableAreas.find(a => a.id === id);
                      return (
                        <div key={id} className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
                          {area?.name}
                          <button onClick={() => toggleArray("preferredAreaIds", id)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Searchable Area Dropdown */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search area name..." 
                        className="pl-9"
                        value={areaSearch}
                        onFocus={() => setShowPreferredDropdown(true)}
                        onChange={e => setAreaSearch(e.target.value)}
                      />
                    </div>
                    {showPreferredDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[250px] overflow-y-auto">
                        {availableAreas
                          .filter(a => !form.preferredAreaIds.includes(a.id)) // HIDE already selected
                          .filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase()))
                          .map(a => (
                            <button
                              key={a.id}
                              onClick={() => {
                                toggleArray("preferredAreaIds", a.id);
                                setAreaSearch("");
                                // Keep dropdown open for more selections unless user clicks away
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex justify-between items-center"
                            >
                              {a.name}
                            </button>
                          ))
                        }
                        {availableAreas.filter(a => !form.preferredAreaIds.includes(a.id)).filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-sm text-muted-foreground italic">
                            {areaSearch ? "No matching areas found" : "All available areas selected"}
                          </div>
                        )}
                      </div>
                    )}
                    {showPreferredDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowPreferredDropdown(false)} />}
                  </div>
                  <FieldError field="preferredAreaIds" />
                </div>
              )}
              <MultiSelect label="Languages *" options={masterData.languages.map(l => l.name)} field="languages" />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-foreground">Experience & Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Highest Qualification *</label>
                  <Select value={form.qualification} onValueChange={v => set("qualification", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{QUALIFICATIONS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="qualification" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Specialization</label>
                  <Input placeholder="e.g., B.Sc Physics" value={form.specialization} onChange={e => set("specialization", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Teaching Experience *</label>
                  <Select value={form.experience} onValueChange={v => set("experience", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{EXPERIENCE_OPTIONS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="experience" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Current Status *</label>
                  <Select value={form.currentStatus} onValueChange={v => set("currentStatus", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="currentStatus" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Communication Level *</label>
                <Select value={form.communicationLevel} onValueChange={v => set("communicationLevel", v)}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>{COMMUNICATION_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
                <FieldError field="communicationLevel" />
              </div>
              <MultiSelect label="Available Days *" options={masterData.days.map(d => d.name)} field="availableDays" />
              <MultiSelect label="Preferred Time Slots *" options={masterData.slots.map(s => s.label)} field="timeSlots" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Expected Fees (₹/hour) *</label>
                <Input placeholder="e.g., 500" value={form.expectedFees} onChange={e => set("expectedFees", e.target.value.replace(/\D/g, ""))} />
                <FieldError field="expectedFees" />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-foreground">Verification & Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Profile Photo *</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{photoName || "Upload photo"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setPhotoName)} />
                  </label>
                  <FieldError field="photo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">ID Proof (Aadhar/PAN) *</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{idProofName || "Upload ID proof"}</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange(setIdProofName)} />
                  </label>
                  <FieldError field="idProof" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Resume (optional)</label>
                <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{resumeName || "Upload resume"}</span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange(setResumeName)} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Short Bio (max 200 words)</label>
                <Textarea placeholder="Tell students about your teaching style, experience, and approach..." value={form.bio} onChange={e => set("bio", e.target.value)} rows={4} />
                <p className="text-xs text-muted-foreground mt-1">{form.bio.trim().split(/\s+/).filter(Boolean).length}/200 words</p>
                <FieldError field="bio" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Demo Video Link (optional)</label>
                <Input placeholder="YouTube or Google Drive link" value={form.videoLink} onChange={e => set("videoLink", e.target.value)} />
                <div className="flex items-center gap-2 mt-2 p-3 bg-accent/50 rounded-lg">
                  <Video className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-accent-foreground">Profiles with demo videos get <strong>3x more student requests</strong></p>
                </div>
              </div>

              {/* Summary Preview Section */}
              <div className="mt-8 p-4 bg-muted/20 rounded-xl border border-border space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Review Your Profile
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Location & Mode</p>
                    <p className="font-medium">{form.city}, {form.state}</p>
                    <p className="text-xs text-primary font-medium">{form.teachingMode === 'both' ? 'Online + Home Tuition' : form.teachingMode === 'online' ? 'Online Only' : 'Home Tuition'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Subjects & Classes</p>
                    <p className="font-medium">{form.subjects.slice(0, 2).join(", ")}{form.subjects.length > 2 ? ` +${form.subjects.length - 2}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{form.classes.join(", ")}</p>
                  </div>

                  {(form.teachingMode === 'home' || form.teachingMode === 'both') && (
                    <div className="md:col-span-2 space-y-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">Preferred Teaching Areas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.preferredAreaIds.slice(0, 3).map(id => (
                          <Badge key={id} variant="secondary" className="text-[10px] py-0 px-2 h-5">
                            {availableAreas.find(a => a.id === id)?.name}
                          </Badge>
                        ))}
                        {form.preferredAreaIds.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="text-[10px] h-5 px-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold">
                                  +{form.preferredAreaIds.length - 3} more
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="p-2 max-w-[250px]">
                                <div className="flex flex-wrap gap-1">
                                  {form.preferredAreaIds.slice(3).map(id => (
                                    <span key={id} className="bg-background/50 px-1.5 py-0.5 rounded text-[10px]">
                                      {availableAreas.find(a => a.id === id)?.name}
                                    </span>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        {step > 1 ? (
          <Button variant="outline" onClick={prev}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        ) : <div />}
        {step < 4 ? (
          <Button variant="cta" onClick={next}>Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
        ) : (
          <Button variant="cta" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Submit Registration
          </Button>
        )}
      </div>
    </div>
  );
};

export default TutorRegistrationForm;

