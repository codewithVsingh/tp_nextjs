import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, Video, ArrowRight, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

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

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  teachingMode: string;
  preferredLocations: string;
  languages: string[];
  qualification: string;
  specialization: string;
  experience: string;
  currentStatus: string;
  availableDays: string[];
  timeSlots: string[];
  expectedFees: string;
  travelWilling: string;
  travelRadius: string;
  bio: string;
  videoLink: string;
}

const defaultForm: FormData = {
  name: "", phone: "", email: "", city: "", pincode: "",
  subjects: [], classes: [], boards: [], teachingMode: "", preferredLocations: "", languages: [],
  qualification: "", specialization: "", experience: "", currentStatus: "", availableDays: [], timeSlots: [], expectedFees: "", travelWilling: "", travelRadius: "",
  bio: "", videoLink: "",
};

const stepTitles = ["Basic Info", "Teaching Profile", "Experience", "Verification"];

interface Props {
  onClose?: () => void;
  isModal?: boolean;
}

const TutorRegistrationForm = ({ onClose, isModal = false }: Props) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultForm, ...JSON.parse(saved) } : defaultForm;
    } catch { return defaultForm; }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [idProofName, setIdProofName] = useState("");
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const set = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const toggleArray = (field: keyof FormData, value: string) => {
    const arr = form[field] as string[];
    set(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit mobile required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
      if (!form.city) e.city = "Select city";
      if (!form.pincode.match(/^\d{6}$/)) e.pincode = "Valid 6-digit pincode required";
    }
    if (s === 2) {
      if (form.subjects.length === 0) e.subjects = "Select at least one subject";
      if (form.classes.length === 0) e.classes = "Select at least one class group";
      if (form.boards.length === 0) e.boards = "Select at least one board";
      if (!form.teachingMode) e.teachingMode = "Select teaching mode";
      if ((form.teachingMode === "home" || form.teachingMode === "both") && !form.preferredLocations.trim()) e.preferredLocations = "Location required for home tuition";
      if (form.languages.length === 0) e.languages = "Select at least one language";
    }
    if (s === 3) {
      if (!form.qualification) e.qualification = "Select qualification";
      if (!form.experience) e.experience = "Select experience";
      if (!form.currentStatus) e.currentStatus = "Select current status";
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

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!validate(4)) return;
    localStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
    toast.success("Registration submitted successfully!");
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

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile Submitted 🎉</h2>
        <p className="text-muted-foreground mb-6">We'll connect you with students near you within 24 hours.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="cta" size="lg" onClick={() => {
            const msg = encodeURIComponent(`Hi, I just registered as a tutor. Name: ${form.name}, Subjects: ${form.subjects.join(", ")}`);
            window.open(`https://wa.me/919873101564?text=${msg}`, "_blank");
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email ID *</label>
                <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                <FieldError field="email" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                  <Select value={form.city} onValueChange={v => set("city", v)}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldError field="city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Pincode *</label>
                  <Input placeholder="110001" value={form.pincode} onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
                  <FieldError field="pincode" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-foreground">Your Teaching Profile</h3>
              <MultiSelect label="Subjects You Teach *" options={SUBJECTS} field="subjects" />
              <MultiSelect label="Classes/Grades *" options={CLASS_GROUPS.map(c => c.label)} field="classes" />
              <MultiSelect label="Boards *" options={BOARDS} field="boards" />
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Preferred Locations *</label>
                  <Input placeholder="e.g., Rohini, Dwarka, Pitampura" value={form.preferredLocations} onChange={e => set("preferredLocations", e.target.value)} />
                  <FieldError field="preferredLocations" />
                </div>
              )}
              <MultiSelect label="Languages *" options={LANGUAGES} field="languages" />
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
              <MultiSelect label="Available Days *" options={DAYS} field="availableDays" />
              <MultiSelect label="Preferred Time Slots *" options={TIME_SLOTS} field="timeSlots" />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Expected Fees (₹/hour) *</label>
                <Input placeholder="e.g., 500" value={form.expectedFees} onChange={e => set("expectedFees", e.target.value.replace(/\D/g, ""))} />
                <FieldError field="expectedFees" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Willing to Travel? *</label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map(v => (
                      <button key={v} type="button" onClick={() => set("travelWilling", v)}
                        className={`flex-1 py-2 rounded-lg text-sm border transition-all ${form.travelWilling === v ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                {form.travelWilling === "Yes" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Travel Radius (km)</label>
                    <Input placeholder="e.g., 10" value={form.travelRadius} onChange={e => set("travelRadius", e.target.value.replace(/\D/g, ""))} />
                  </div>
                )}
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
          <Button variant="cta" size="lg" onClick={handleSubmit}>Submit Registration</Button>
        )}
      </div>
    </div>
  );
};

export default TutorRegistrationForm;
