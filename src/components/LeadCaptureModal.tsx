import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Shield, Users, Star, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { openWhatsApp } from "@/lib/whatsapp";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
  prefill?: {
    classLevel?: string;
    subject?: string;
    board?: string;
    exam?: string;
    category?: string;
    area?: string;
  };
}

const NCR_AREAS = [
  "Rohini", "Dwarka", "Laxmi Nagar", "Janakpuri", "Pitampura", "Model Town",
  "Rajouri Garden", "Preet Vihar", "Mayur Vihar", "Greater Kailash",
  "Hauz Khas", "Saket", "Noida", "Greater Noida", "Gurgaon", "Ghaziabad",
  "Faridabad", "Indirapuram", "Vaishali", "Other"
];

const TRUST_SIGNALS = [
  { icon: Users, text: "5,000+ Students Helped" },
  { icon: Shield, text: "Verified Tutors Only" },
  { icon: Star, text: "Free Demo Available" },
];

const LeadCaptureModal = ({ open, onOpenChange, source = "unknown", prefill }: LeadCaptureModalProps) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    classLevel: prefill?.classLevel || "",
    board: prefill?.board || "",
    subject: prefill?.subject || "",
    exam: prefill?.exam || "",
    mode: "",
    area: prefill?.area || "",
  });

  useEffect(() => {
    if (prefill) {
      setForm(prev => ({
        ...prev,
        classLevel: prefill.classLevel || prev.classLevel,
        subject: prefill.subject || prev.subject,
        board: prefill.board || prev.board,
        exam: prefill.exam || prev.exam,
        area: prefill.area || prev.area,
      }));
    }
  }, [prefill]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setStep(1); setSubmitted(false); }, 300);
    } else {
      trackEvent("form_opened", { source });
    }
  }, [open, source]);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const canNext = step === 1
    ? form.name.trim().length >= 2 && /^[6-9]\d{9}$/.test(form.phone)
    : step === 2
    ? form.classLevel && form.board
    : form.mode && form.area;

  const handleSubmit = () => {
    setSubmitted(true);
    trackEvent("form_submitted", {
      source,
      classLevel: form.classLevel,
      subject: form.subject || form.exam,
      area: form.area,
      mode: form.mode,
    });
    toast.success("We'll connect you with the best tutor shortly!");
  };

  const whatsappMsg = `Hi, I need a home tutor in ${form.area || "Delhi"} for ${form.classLevel || "my child"}${form.subject ? ` - ${form.subject}` : ""}`;

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-4">Our team will call you within 30 minutes to set up your free demo class.</p>
            <div className="bg-muted/50 rounded-lg p-3 mb-6">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> Limited slots available in your area — we'll prioritize your request
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
              <Button variant="outline" className="w-full" onClick={() => openWhatsApp(whatsappMsg)}>
                  Or Chat on WhatsApp for Faster Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {step === 1 ? "Get Your Free Demo Class" : step === 2 ? "Academic Details" : "Location & Preferences"}
          </DialogTitle>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </DialogHeader>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-2 mt-2">
          {TRUST_SIGNALS.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <t.icon className="w-3 h-3" /> {t.text}
            </span>
          ))}
        </div>

        <div className="space-y-4 mt-4">
          {step === 1 && (
            <>
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="Enter your name" value={form.name} onChange={e => update("name", e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={form.phone}
                  onChange={e => update("phone", e.target.value.replace(/\D/g, ""))}
                />
                {form.phone.length > 0 && form.phone.length < 10 && (
                  <p className="text-xs text-destructive mt-1">Enter a valid 10-digit number</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>Class *</Label>
                <Select value={form.classLevel} onValueChange={v => update("classLevel", v)}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {["KG", ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Board *</Label>
                <Select value={form.board} onValueChange={v => update("board", v)}>
                  <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                  <SelectContent>
                    {["CBSE", "ICSE", "State Board", "IB", "Other"].map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject / Exam</Label>
                <Input placeholder="e.g. Maths, JEE, NEET" value={form.subject || form.exam} onChange={e => update("subject", e.target.value)} maxLength={100} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>Tuition Mode *</Label>
                <Select value={form.mode} onValueChange={v => update("mode", v)}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Tuition</SelectItem>
                    <SelectItem value="online">Online Classes</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area in Delhi/NCR *</Label>
                <Select value={form.area} onValueChange={v => update("area", v)}>
                  <SelectTrigger><SelectValue placeholder="Select your area" /></SelectTrigger>
                  <SelectContent>
                    {NCR_AREAS.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Urgency */}
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary shrink-0" />
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold text-secondary">Limited slots available</span> in your area — submit now to secure your demo
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>
          )}
          <Button
            disabled={!canNext}
            onClick={() => {
              if (step < 3) {
                trackEvent("form_step_completed", { step, source });
                setStep(s => s + 1);
              } else {
                handleSubmit();
              }
            }}
            className="flex-1"
            style={step === 3 ? { background: "var(--cta-gradient)" } : undefined}
          >
            {step < 3 ? "Next" : "Get Free Demo"} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
